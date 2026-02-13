import fs from "fs";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import cloudinary from "../utils/claudinary.js";

// CHANGE PASSWORD (Profile Section)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { oldPassword, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    // 2️⃣ Get user from DB using ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3️⃣ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // 4️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5️⃣ Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


//get Me
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password -electricianProfile -averageRating -totalRatings");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const { street, city, state, pincode, isDefault } = req.body;

    // 1️⃣ Validate input
    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3️⃣ If new address is default → unset old default
    if (isDefault) {
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // 4️⃣ Push new address
    user.address.push({
      street,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    });

    // 5️⃣ Save user
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: user.address
    });

  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//delete address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if address exists
    const addressExists = user.address.some(
      (addr) => addr._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // Remove address
    user.address = user.address.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address: user.address,
    });

  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//delete account of  user
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const token = req.cookies?.token;

    // 1️⃣ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2️⃣ Delete user account
    await User.findByIdAndDelete(userId);

    // 4️⃣ Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false // true in production
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    let electricianProfile = null;

    // Safely parse electricianProfile
    if (req.body.electricianProfile) {
      try {
        electricianProfile = JSON.parse(req.body.electricianProfile);
      } catch (err) {
        return res.status(400).json({
          message: "Invalid electricianProfile format"
        });
      }
    }

    
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 1. BASIC PROFILE UPDATE (ALL USERS)
    if (name) user.name = name;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "instantfix/avatars",
        resource_type: "image",
      });

      await fs.promises.unlink(req.file.path);
      user.avatar = uploadResult.secure_url;
    }

    // ✅ 2. ELECTRICIAN PROFILE UPDATE (ONLY ELECTRICIAN)
    if (electricianProfile) {

      if (user.role !== "ELECTRICIAN") {
        return res.status(403).json({
          message: "Only electricians can update electrician profile"
        });
      }

      const { skills, experience, serviceAreas, certifications, hourlyRate } =
        electricianProfile;

      user.electricianProfile = {
        ...user.electricianProfile,
        skills,
        experience,
        serviceAreas,
        certifications,
        hourlyRate,
        approved: false, // re-approval required
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      // user
       user:{
         name:user.name,
         email:user.email,
         phone:user.phone,
         role:user.role,
         avatar:user.avatar,
        location:user.location,
        electricianProfile:user.electricianProfile
       }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//update coordiantes
export const updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude required"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [
            Number(longitude), //  first longitude
            Number(latitude)   // then latitude
          ]
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      location: updatedUser.location
    });

  } catch (error) {
    console.error("Location update error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

