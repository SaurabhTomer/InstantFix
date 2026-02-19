import Notification from "../models/notification.model.js";
import ServiceRequest from "../models/serviceRequest.model.js";
import User from '../models/user.model.js'
import { getIO } from "../socket/socket.js";
import { sendRequestAcceptedMail, sendRequestCompletedMail } from "../utils/sendEmail.js";

//accept request by electrician
export const acceptRequest = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { requestId } = req.params;

    const electrician = await User.findById(electricianId);
    if (!electrician) {
      return res.status(404).json({ message: "Electrician not found" });
    }

    if (electrician.approvalStatus !== "approved") {
      return res.status(403).json({
        message: "Electrician not approved by admin",
      });
    }

    //no one user can accpet infact at same time
    const request = await ServiceRequest.findOneAndUpdate(
      { _id: requestId, status: "pending" },
      {
        electrician: electricianId,
        status: "accepted",
        rejectedBy: [],   // this clear rejectedBy array if request accepted
      },
      { new: true }
    )


    if (!request) {
      return res.status(400).json({
        message: "Request already accepted",
      });
    }

    // create notification
    await Notification.create({
      user: request.customer,
      title: "Service Completed",
      message: "Your service has been completed successfully.",
      type: "REQUEST_COMPLETED",
    });

    
    console.log("✅ REQUEST ACCEPTED:", {
      requestId: request._id.toString(),
      customer: request.customer.toString(),
      electrician: electricianId,
      status: request.status,
    });

    // realtime notify user
    getIO()
      .to(request.customer.toString())
      .emit("REQUEST_STATUS_UPDATED", {
        requestId: request._id,
        status: "completed",
        electricianId,
      });

    console.log(
      "🔔 Emitting REQUEST_STATUS_UPDATED to user:",
      request.customer.toString()
    );

    //send mail
    const customer = await User.findById(request.customer);

    sendRequestAcceptedMail(
      customer.email,
      request.issueType
    ).catch(err => {
      console.error("Email send failed:", err.message);
    });

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get a single request by id (electrician)
export const getRequestDetails = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { requestId } = req.params;

    const electrician = await User.findById(electricianId).select("role approvalStatus");
    if (!electrician) {
      return res.status(404).json({ message: "Electrician not found" });
    }

    if (electrician.role !== "ELECTRICIAN") {
      return res.status(403).json({ message: "Only electrician can access this" });
    }

    if (electrician.approvalStatus !== "approved") {
      return res.status(403).json({ message: "Electrician not approved by admin" });
    }

    const request = await ServiceRequest.findById(requestId)
      .populate("customer", "name phone address")
      .populate("electrician", "name email phone");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "pending") {
      if (request.rejectedBy?.map(String).includes(String(electricianId))) {
        return res.status(403).json({ message: "You rejected this request" });
      }

      return res.status(200).json({ success: true, request });
    }

    if (String(request.electrician?._id || request.electrician) !== String(electricianId)) {
      return res.status(403).json({ message: "Not authorized for this request" });
    }

    return res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Get request details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get near by request
export const getNearbyRequests = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const maxDistance = parseInt(req.query.distance) || 10000;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const electrician = await User.findById(electricianId)    //took approvalstatus location skill 
      .select("approvalStatus location skills");

    if (!electrician) {
      return res.status(404).json({ message: "Electrician not found" });
    }

    if (electrician.approvalStatus !== "approved") {
      return res.status(403).json({ message: "Electrician not approved" });
    }

    const coordinates = electrician.location?.coordinates;
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: "Electrician location not set" });
    }

    const pipeline = [
      {
        $geoNear: {     // near  by electrician
          near: {
            type: "Point",
            coordinates
          },
          distanceField: "distance",
          maxDistance,
          spherical: true,
          key: "location",
          query: {
            status: "pending",
            rejectedBy: { $ne: electricianId }
          }
        }
      },

      // Skill Matching 
      {
        $addFields: {
          skillScore: {
            $cond: [
              { $in: ["$issueType", electrician.skills] },
              10,   // exact match
              5     // fallback match
            ]
          }
        }
      },

      // Sort by skillScore first, then distance
      {
        $sort: {
          skillScore: -1,
          distance: 1
        }
      },

      { $skip: skip },
      { $limit: limit }
    ];

    const requests = await ServiceRequest.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      page,
      limit,
      count: requests.length,
      data: requests
    });

  } catch (err) {
    console.error("Get nearby requests error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



//set electriciann controller
export const setElectricianLocation = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const electrician = await User.findById(electricianId);

    if (!electrician) {
      return res.status(404).json({
        success: false,
        message: "Electrician not found"
      });
    }

    if (electrician.role !== "ELECTRICIAN") {
      return res.status(403).json({
        success: false,
        message: "Only electricians can set location"
      });
    }

    if (electrician.approvalStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Electrician not approved"
      });
    }

    electrician.location = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)]
    };

    await electrician.save();

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: electrician.location
    });

  } catch (err) {
    console.error("Set location error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


//set availability of electrician
export const setAvailability = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { isAvailable } = req.body;

    //type check
    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "isAvailable must be true or false",
      });
    }

    const electrician = await User.findById(electricianId);

    if (!electrician) {
      return res.status(404).json({
        message: "Electrician not found",
      });
    }

    if (electrician.role !== "ELECTRICIAN") {
      return res.status(403).json({
        message: "Only electrician can set availability",
      });
    }

    if (electrician.approvalStatus !== "approved") {
      return res.status(403).json({
        message: "Electrician not approved by admin",
      });
    }

    electrician.isAvailable = isAvailable;
    electrician.lastActiveAt = new Date();
    await electrician.save();

    return res.status(200).json({
      success: true,
      message: `Electrician is now ${isAvailable ? "online" : "offline"}`,
      isAvailable,
    });

  } catch (error) {
    console.error("Set availability error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get assigned request (electrician)
export const getAssignedRequests = async (req, res) => {
  try {
    const electricianId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // status should only be accepted or in in-progress
    const filter = {
      electrician: electricianId,
      status: { $in: ["accepted", "in-progress"] },
    };

    // reuest have all request and total have number
    const [requests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate("customer", "name phone address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      ServiceRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("Get assigned requests error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//get completed requests
export const getCompletedRequests = async (req, res) => {
  try {
    const electricianId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      electrician: electricianId,
      status: "completed",
    };

    const [requests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate("customer", "name phone address")
        .sort({ completedAt: -1 }) // agar field hai
        .skip(skip)
        .limit(limit),

      ServiceRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("Get completed requests error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// reject request for a specific electrician
export const rejectRequest = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { requestId } = req.params;

    const request = await ServiceRequest.findOne({
      _id: requestId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found or no longer available",
      });
    }

    //  already rejected by this electrician
    if (request.rejectedBy.includes(electricianId)) {
      return res.status(400).json({
        message: "You already rejected this request",
      });
    }

    //  reject ONLY for this electrician
    request.rejectedBy.push(electricianId);
    request.rejectedAt = new Date();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request rejected for you",
    });

  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// start job (accepted -> in-progress)
export const startJob = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { requestId } = req.params;

    const request = await ServiceRequest.findOne({
      _id: requestId,
      electrician: electricianId,
      status: "accepted",
    });

    if (!request) {
      return res.status(400).json({
        message: "Request cannot be started",
      });
    }

    request.status = "in-progress";
    request.startedAt = new Date();
    await request.save();

    //  notify user
    getIO()
      .to(request.customer.toString())
      .emit("REQUEST_STATUS_UPDATED", {
        requestId: request._id,
        status: "in-progress",
      });


    return res.status(200).json({
      success: true,
      message: "Job started successfully",
      request,
    });

  } catch (error) {
    console.error("Start job error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// complete job (in-progress -> completed)
export const completeJob = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const { requestId } = req.params;

    const request = await ServiceRequest.findOne({
      _id: requestId,
      electrician: electricianId,
      status: "in-progress",
    });

    if (!request) {
      return res.status(400).json({
        message: "Request cannot be completed",
      });
    }

    request.status = "completed";
    request.completedAt = new Date();
    await request.save();

    await Notification.create({
      user: request.customer,
      title: "Service Completed",
      message: "Your service has been completed successfully.",
      type: "REQUEST_COMPLETED",
    });

    // notify user
    getIO()
      .to(request.customer.toString())
      .emit("REQUEST_STATUS_UPDATED", {
        requestId: request._id,
        status: "completed",
      });

    const customer = await User.findById(request.customer);

    sendRequestCompletedMail(customer.email, request.issueType)
      .catch(err => console.error("Completed mail failed:", err.message));


    return res.status(200).json({
      success: true,
      message: "Job completed successfully",
      request,
    });

  } catch (error) {
    console.error("Complete job error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
