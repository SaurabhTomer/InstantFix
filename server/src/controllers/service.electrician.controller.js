import ServiceRequest from "../models/serviceRequest.model.js";
import { getIO } from "../socket/socket.js";

export const acceptRequest = async (req, res) => {
  try {
    const electricianId = req.user.id; // auth middleware se
    const { requestId } = req.params;

    //  Find request
    const request = await ServiceRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    //  Only pending requests can be accepted
    if (request.status !== "pending") {
      return res.status(400).json({
        message: `Request already ${request.status}`,
      });
    }

    //  Assign electrician
    request.electrician = electricianId;
    request.status = "accepted";

    await request.save();

    //real tie socket emit
    const io = getIO();
    io.to(request.customer.toString()).emit("REQUEST_STATUS_UPDATED" , {
      requestId : request.id,
      status : request.status,
      electricianId : electricianId,
    })

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      request,
    });

  } catch (error) {
    console.error("Accept request error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
