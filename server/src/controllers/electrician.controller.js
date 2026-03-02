import User from "../models/user.model.js";
import ServiceRequest from "../models/serviceRequest.model.js";

// Get electrician dashboard statistics
export const getElectricianStats = async (req, res) => {
  try {
    const electricianId = req.user.id;

    // Get all service requests for this electrician
    const [
      totalJobs,
      completedJobs,
      pendingJobs,
      inProgressJobs,
      todayJobs,
      todayCompleted,
      todayEarnings
    ] = await Promise.all([
      ServiceRequest.countDocuments({ electrician: electricianId }),
      ServiceRequest.countDocuments({ 
        electrician: electricianId, 
        status: 'completed' 
      }),
      ServiceRequest.countDocuments({ 
        electrician: electricianId, 
        status: 'pending' 
      }),
      ServiceRequest.countDocuments({ 
        electrician: electricianId, 
        status: 'in-progress' 
      }),
      ServiceRequest.countDocuments({ 
        electrician: electricianId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      ServiceRequest.countDocuments({ 
        electrician: electricianId,
        status: 'completed',
        completedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      // Calculate today's earnings (assuming average $95 per job)
      ServiceRequest.countDocuments({ 
        electrician: electricianId,
        status: 'completed',
        completedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }).then(count => count * 95)
    ]);

    // Get weekly stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyJobs = await ServiceRequest.countDocuments({
      electrician: electricianId,
      createdAt: { $gte: weekAgo }
    });

    // Get electrician profile
    const electrician = await User.findById(electricianId).select('name email phone rating totalJobs');

    return res.status(200).json({
      success: true,
      data: {
        totalJobs,
        completedJobs,
        pendingJobs,
        inProgressJobs,
        todayJobs,
        todayCompleted,
        todayEarnings,
        weeklyJobs,
        electrician: {
          name: electrician.name,
          email: electrician.email,
          phone: electrician.phone,
          rating: electrician.rating || 0,
          totalJobs: electrician.totalJobs || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching electrician stats:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Get electrician's service requests
export const getElectricianRequests = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { electrician: electricianId };
    
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const [requests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      
      ServiceRequest.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching electrician requests:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Get available service requests (not assigned yet)
export const getAvailableRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { 
      electrician: null,
      status: 'pending'
    };

    const [requests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      
      ServiceRequest.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching available requests:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Accept a service request
export const acceptServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const electricianId = req.user.id;

    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Service request not found",
      });
    }

    if (request.electrician) {
      return res.status(400).json({
        success: false,
        msg: "Request already assigned",
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        msg: "Request is no longer available",
      });
    }

    // Assign the request to this electrician
    request.electrician = electricianId;
    request.status = 'accepted';
    await request.save();

    return res.status(200).json({
      success: true,
      msg: "Service request accepted successfully",
      data: request
    });
  } catch (error) {
    console.error('Error accepting service request:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Start a service request
export const startServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const electricianId = req.user.id;

    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Service request not found",
      });
    }

    if (request.electrician.toString() !== electricianId) {
      return res.status(403).json({
        success: false,
        msg: "You are not assigned to this request",
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        msg: "Request cannot be started",
      });
    }

    request.status = 'in-progress';
    request.startedAt = new Date();
    await request.save();

    return res.status(200).json({
      success: true,
      msg: "Service request started successfully",
      data: request
    });
  } catch (error) {
    console.error('Error starting service request:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Complete a service request
export const completeServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const electricianId = req.user.id;

    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Service request not found",
      });
    }

    if (request.electrician.toString() !== electricianId) {
      return res.status(403).json({
        success: false,
        msg: "You are not assigned to this request",
      });
    }

    if (request.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        msg: "Request cannot be completed",
      });
    }

    request.status = 'completed';
    request.completedAt = new Date();
    await request.save();

    // Update electrician's total jobs
    await User.findByIdAndUpdate(electricianId, {
      $inc: { totalJobs: 1 }
    });

    return res.status(200).json({
      success: true,
      msg: "Service request completed successfully",
      data: request
    });
  } catch (error) {
    console.error('Error completing service request:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Get electrician profile
export const getElectricianProfile = async (req, res) => {
  try {
    const electricianId = req.user.id;

    const electrician = await User.findById(electricianId)
      .select('-password')
      .populate({
        path: 'serviceRequests',
        match: { status: 'completed' },
        select: 'customer rating completedAt'
      });

    if (!electrician) {
      return res.status(404).json({
        success: false,
        msg: "Electrician not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: electrician
    });
  } catch (error) {
    console.error('Error fetching electrician profile:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};
