import ServiceRequest from "../models/serviceRequest.model.js";
import User from '../models/user.model.js'
import { getIO } from "../socket/socket.js";
import { sendRequestAcceptedMail } from "../utils/sendEmail.js";

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
      { electrician: electricianId, status: "accepted" },
      { new: true }
    )
    

    if (!request) {
      return res.status(400).json({
        message: "Request already accepted",
      });
    }

    const io = getIO();
    io.to(request.customer.toString()).emit("REQUEST_STATUS_UPDATED", {
      requestId: request._id,
      status: request.status,
      electricianId,
    });

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


//get nearby request 
export const getNearbyRequests = async (req, res) => {
  try {
    const electricianId = req.user.id;
    const maxDistance = parseInt(req.query.distance) || 10000;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const electrician = await User.findById(electricianId).select("approvalStatus location");

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

    // 🔥 CORRECT AGGREGATION
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates
          },
          distanceField: "distance",
          maxDistance,
          spherical: true,
          query: { status: "pending" }
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
