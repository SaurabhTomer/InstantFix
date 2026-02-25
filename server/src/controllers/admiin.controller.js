import User from '../models/user.model.js'
import ServiceRequest from "../models/serviceRequest.model.js";
import { getIO } from '../socket/socket.js';
import { sendElectricianApprovedMail, sendElectricianRejectedMail } from '../utils/sendEmail.js';
import NotificationService from '../utils/notificationService.js';

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        msg: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        avatar: admin.avatar,
        joinDate: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Get admin statistics
export const getAdminStats = async (req, res) => {
  try {
    // Get all counts in parallel for better performance
    const [
      totalUsers,
      totalElectricians,
      pendingElectricians,
      approvedElectricians,
      rejectedElectricians,
      suspendedElectricians,
      totalServiceRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      activeElectricians
    ] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'ELECTRICIAN' }),
      User.countDocuments({ role: 'ELECTRICIAN', approvalStatus: 'pending' }),
      User.countDocuments({ role: 'ELECTRICIAN', approvalStatus: 'approved' }),
      User.countDocuments({ role: 'ELECTRICIAN', approvalStatus: 'rejected' }),
      User.countDocuments({ role: 'ELECTRICIAN', approvalStatus: 'suspended' }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: 'pending' }),
      ServiceRequest.countDocuments({ status: 'in-progress' }),
      ServiceRequest.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'ELECTRICIAN', approvalStatus: 'approved', lastActive: { $exists: true, $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }) // Active in last 30 days
    ]);

    // Calculate revenue (mock data for now)
    const totalRevenue = completedRequests * 250; // Average $250 per completed request
    const monthlyRevenue = totalRevenue / 12; // Simple monthly calculation

    // Calculate average rating (mock data for now)
    const averageRating = 4.5;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalElectricians,
        totalServiceRequests,
        pendingRequests,
        inProgressRequests,
        completedRequests,
        pendingElectricians,
        approvedElectricians,
        rejectedElectricians,
        suspendedElectricians,
        totalRevenue,
        monthlyRevenue,
        averageRating,
        activeElectricians
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Get all service requests for admin
export const getAllServiceRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    if (req.query.priority && req.query.priority !== 'all') {
      filter.priority = req.query.priority;
    }

    const [requests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('customer', 'name email phone')
        .populate('electrician', 'name email phone')
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
    console.error('Error fetching service requests:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Update service request status
export const updateServiceRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await ServiceRequest.findById(requestId)
      .populate('customer', 'name email')
      .populate('electrician', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Service request not found",
      });
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      success: true,
      msg: `Service request status updated to ${status}`,
      data: request
    });
  } catch (error) {
    console.error('Error updating service request status:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Assign electrician to service request
export const assignElectricianToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { electricianId } = req.body;

    const request = await ServiceRequest.findById(requestId)
      .populate('customer', 'name email')
      .populate('electrician', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Service request not found",
      });
    }

    const electrician = await User.findById(electricianId);
    if (!electrician || electrician.role !== 'ELECTRICIAN') {
      return res.status(404).json({
        success: false,
        msg: "Electrician not found",
      });
    }

    request.electrician = electricianId;
    await request.save();

    return res.status(200).json({
      success: true,
      msg: "Electrician assigned successfully",
      data: request
    });
  } catch (error) {
    console.error('Error assigning electrician:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Get all users for admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { role: 'USER' };
    
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      
      User.countDocuments(filter)
    ]);

    // Get service request counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [totalRequests, completedRequests] = await Promise.all([
          ServiceRequest.countDocuments({ customer: user._id }),
          ServiceRequest.countDocuments({ 
            customer: user._id, 
            status: 'completed' 
          })
        ]);

        return {
          ...user.toObject(),
          totalRequests,
          completedRequests,
          activeRequests: totalRequests - completedRequests
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (user.role !== 'USER') {
      return res.status(400).json({
        success: false,
        msg: "Cannot modify non-user accounts",
      });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      msg: `User status updated to ${status}`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

//approve electrician 
export const approveElectrician = async (req, res) => {
    try {
        const { electricianId } = req.params; // electrician id (admin approve karega)

        const electrician = await User.findById(electricianId);

        if (!electrician) {
            return res.status(404).json({
                success: false,
                msg: "Electrician not found",
            });
        }

        //  Check role
        if (electrician.role !== "ELECTRICIAN") {
            return res.status(400).json({
                success: false,
                msg: "User is not an electrician",
            });
        }

        //  Already approved?
        if (electrician.approvalStatus === "approved") {
            return res.status(400).json({
                success: false,
                msg: "Electrician already approved",
            });
        }

        // Approve electrician
        electrician.approvalStatus = "approved";
        await electrician.save();

        // Create notification for electrician
        await NotificationService.notifyElectricianApproved(electrician._id);

        //  Real-time socket notify 
        try {
            const io = getIO();
            // console.log("bn gya")
            io.to(electrician._id.toString()).emit("ELECTRICIAN_APPROVED", {
                electricianId: electrician._id,
                message: "Your account has been approved by admin",
            });
        } catch (socketError) {
            console.log("Socket not connected, skipping emit");
        }

        
        
        sendElectricianApprovedMail(electrician.email , electrician.name)
              .catch(err => console.error("Electrician approve mail failed:", err.message));

        // Response
        return res.status(200).json({
            success: true,
            msg: "Electrician approved successfully",
            electrician: {
                id: electrician._id,
                name: electrician.name,
                email: electrician.email,
                approvalStatus: electrician.approvalStatus,
            },
        });

    } catch (error) {
        console.error("Approve electrician error:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });

    }
}


//reject electrician
export const rejectElectrician = async (req, res) => {
    try {
        const { electricianId } = req.params; // electrician id (admin approve karega)

        const electrician = await User.findById(electricianId);

        if (!electrician) {
            return res.status(404).json({
                success: false,
                msg: "Electrician not found",
            });
        }

        //  Check role
        if (electrician.role !== "ELECTRICIAN") {
            return res.status(400).json({
                success: false,
                msg: "User is not an electrician",
            });
        }

        //  Already approved
        if (electrician.approvalStatus === "approved") {
            return res.status(400).json({
                success: false,
                msg: "Electrician already approved",
            });
        }

        // reject electrician
        electrician.approvalStatus = "rejected";
        await electrician.save();

        // Create notification for electrician
        await NotificationService.notifyElectricianRejected(electrician._id, "Your electrician account has been rejected by admin");

        //  Real-time socket notify 
        try {
            const io = getIO();
            io.to(electrician._id.toString()).emit("ELECTRICIAN_REJECTED", {
                electricianId: electrician._id,
                message: "Your account has been rejected by admin",
            });
        } catch (socketError) {
            console.log("Socket not connected, skipping emit");
        }
        
        sendElectricianRejectedMail(electrician.email , electrician.name)
              .catch(err => console.error("Reject electrician mail failed:", err.message));

        // Response
        return res.status(200).json({
            success: true,
            msg: "Electrician rejected successfully",
            electrician: {
                id: electrician._id,
                name: electrician.name,
                email: electrician.email,
                approvalStatus: electrician.approvalStatus,
            },
        });

    } catch (error) {
        console.error("Reject electrician error:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });

    }
}

// get all pending electricians
export const getPendingElectricians = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      role: "ELECTRICIAN",
      approvalStatus: "pending",
    };

    const [electricians, total] = await Promise.all([
      User.find(filter)
        .select("-password") // security
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: electricians.length,
      electricians,
    });

  } catch (error) {
    console.error("Get pending electricians error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all electricians (admin)
export const getAllElectricians = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //  filter for   pending | approved | rejected
    const approvalStatus = req.query.status; 
    // pending | approved | rejected

    const filter = {
      role: "ELECTRICIAN",
    };

    if (approvalStatus) {
      filter.approvalStatus = approvalStatus;
    }

    const [electricians, total] = await Promise.all([
      User.find(filter)
        .select("-password") //  never send password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: electricians.length,
      electricians,
    });

  } catch (error) {
    console.error("Get all electricians error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// get electrician full details (admin)
export const getElectricianDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const electrician = await User.findOne({
      _id: id,
      role: "ELECTRICIAN",
    }).select("-password");

    if (!electrician) {
      return res.status(404).json({
        message: "Electrician not found",
      });
    }

    // get total number of request which consist electrician
    const [totalRequests, completedRequests] = await Promise.all([
      ServiceRequest.countDocuments({ electrician: id }),
      ServiceRequest.countDocuments({
        electrician: id,
        status: "completed",
      }),
    ]);

    return res.status(200).json({
      success: true,
      electrician,
      stats: {
        totalRequests,
        completedRequests,
      },
    });

  } catch (error) {
    console.error("Get electrician details error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
