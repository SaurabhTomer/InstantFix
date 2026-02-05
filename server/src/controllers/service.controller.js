import cloudinary from "../utils/claudinary.js";
import User from '../models/user.model.js'
import ServiceRequest from "../models/serviceRequest.model.js"

//create request
export const createServiceRequest = async (req, res) => {
    try {
        // addressID if user send already save adress
        // address if user send address manualy like  new address
        // save address like is we save this address or not
        const userId = req.user.id;
        const { issueType, description, addressId, address, saveAddress } = req.body;

        if (!issueType || !description) {
            return res.status(400).json({
                message: "Issue type and description are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        let finalAddress;

        //  agr already saved addressId di ho 
        if (addressId) {
            const savedAddress = user.address.id(addressId);

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
        else if (address) {
            finalAddress = address;

            if (saveAddress === true) {
                user.address.push(address);
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

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, {
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
