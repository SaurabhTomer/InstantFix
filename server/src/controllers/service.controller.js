import cloudinary from "../utils/claudinary.js";
import User from '../models/user.model.js'
import ServiceRequest from "../models/serviceRequest.model.js"
import { getIO } from "../socket/socket.js";

//create request
export const createServiceRequest = async (req, res) => {
  try {
    // addressID if user send already save adress
    // address if user send address manualy like  new address
    // save address like is we save this address or not
    const userId = req.user.id;
    const { issueType, description, addressId, address, saveAddress, coordinates } = req.body;

    if (!issueType || !description) {
      return res.status(400).json({
        message: "Issue type and description are required"
      });
    }

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        message: "Location coordinates [longitude, latitude] are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    let finalAddress;

    //  agr already saved addressId di ho 
    if (addressId) {
      const savedAddress = user.address.find(addr => addr._id.toString() === addressId);

      if (!savedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      //agr address mil gya toh final address mai save krdo
      finalAddress = {
        street: savedAddress.street,
        city: savedAddress.city,
        state: savedAddress.state,
        pincode: savedAddress.pincode
      };
    }

    //  direct address diya ho
    else if (address && address.street && address.city && address.state && address.pincode) {
      finalAddress = address;

      if (saveAddress === "true") {
        user.address.push(finalAddress);
        await user.save();
      }
    }

    else {
      return res.status(400).json({
        message: "Address or addressId is required"
      });
    }

    //uplaod images
    let imageUrls = [];

    // In your createServiceRequest function, update the file upload part:
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
          folder: "instantfix/services"
        })
      );

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(result => result.secure_url);
    }
    //create request
    const serviceRequest = await ServiceRequest.create({
      customer: userId,
      issueType,
      description,
      address: finalAddress,
      location: {
        type: "Point",
        coordinates: coordinates
      },
      images: imageUrls
    });

    return res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: serviceRequest
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

//get all request
export const getMyAllRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    // query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    //count total no. of request
    const total = await ServiceRequest.countDocuments({
      customer: userId
    });
    //find request 
    const requests = await ServiceRequest.find({
      customer: userId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: requests
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// get one requst by id user
export const getMyRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    // 1️⃣ Find request that belongs to logged-in user
    const request = await ServiceRequest.findOne({
      _id: requestId,
      customer: userId,
    })
      .populate("electrician", "name phone avatar");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });

  } catch (error) {
    console.error("Get my request error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//cancel service request by user
export const cancelServiceRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    //  Find request owned by user
    const request = await ServiceRequest.findOne({
      _id: requestId,
      customer: userId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    //  only owner can cancel
    if (request.customer.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to cancel this request",
      });
    }

    //  Allow cancel only if pending
    if (request.status !== "pending") {
      return res.status(400).json({
        message: `Cannot cancel request in '${request.status}' state`,
      });
    }

    //  Cancel request
    request.status = "cancelled";
    await request.save();

    if (request.electrician) {

      // create notification
      await Notification.create({
        user: request.electrician,
        title: "Request Cancelled",
        message: "The user has cancelled the service request.",
        type: "REQUEST_CANCELLED",
      });

      // realtime notify
      getIO()
        .to(request.electrician.toString())
        .emit("REQUEST_CANCELLED", {
          requestId: request._id,
          message: "User cancelled the request",
        });
    }


    return res.status(200).json({
      success: true,
      message: "Request cancelled successfully",
      request,
    });

  } catch (error) {
    console.error("Cancel request error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};