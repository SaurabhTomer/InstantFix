import cloudinary from "../utils/claudinary.js";

import User from '../models/user.model.js'

import ServiceRequest from "../models/serviceRequest.model.js"



//create request
export const createServiceRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      issueType,
      description,
      addressId,
      address,
      saveAddress,
      street,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    console.log("BODY FULL:", req.body);


    if (!issueType || !description) {
      return res.status(400).json({
        message: "Issue type and description are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // -------------------------
    // ADDRESS LOGIC
    // -------------------------
    let finalAddress;

    if (addressId) {
      const savedAddress = user.address.id(addressId);
      if (!savedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }

      finalAddress = {
        street: savedAddress.street,
        city: savedAddress.city,
        state: savedAddress.state,
        pincode: savedAddress.pincode,
      };
    } else {
      const finalStreet = street ?? address?.street;
      const finalCity = city ?? address?.city;
      const finalState = state ?? address?.state;
      const finalPincode = pincode ?? address?.pincode;

      if (!finalStreet || !finalCity || !finalState || !finalPincode) {
        return res.status(400).json({
          message: "Complete address required",
        });
      }

      finalAddress = {
        street: finalStreet,
        city: finalCity,
        state: finalState,
        pincode: finalPincode,
      };

      if (saveAddress == true) {
        user.address.push(finalAddress);
        await user.save();
      }
    }

    // -------------------------
    // IMAGE UPLOAD
    // -------------------------
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "instantfix/services",
        })
      );

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url);
    }

    // -------------------------
    // COORDINATES LOGIC (FIXED)
    // -------------------------
    const lat = Number(req.body.latitude);
    const lng = Number(req.body.longitude);
    console.log(lat , lng);

    let finalCoordinates = null;

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      finalCoordinates = [lng, lat];
    } else if (
      Array.isArray(user.location?.coordinates) &&
      user.location.coordinates.length === 2
    ) {
      finalCoordinates = user.location.coordinates;
    }

    if (!finalCoordinates) {
      return res.status(400).json({
        message: "Valid latitude and longitude required",
      });
    }


    // -------------------------
    // CREATE SERVICE REQUEST
    // -------------------------
    const serviceRequest = await ServiceRequest.create({
      customer: userId,
      issueType,
      description,
      address: finalAddress,
      location: {
        type: "Point",
        coordinates: finalCoordinates,
      },
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: serviceRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
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





// get one requst by id

// USER: GET PARTICULAR REQUEST

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



    // 1️⃣ Find request owned by user

    const request = await ServiceRequest.findOne({

      _id: requestId,

      customer: userId,

    });



    if (!request) {

      return res.status(404).json({

        message: "Request not found",

      });

    }



    // 2️⃣ Allow cancel only if pending

    if (request.status !== "pending") {

      return res.status(400).json({

        message: `Cannot cancel request in '${request.status}' state`,

      });

    }



    // 3️⃣ Cancel request

    request.status = "cancelled";

    await request.save();



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