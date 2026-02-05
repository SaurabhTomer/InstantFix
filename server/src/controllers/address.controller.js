
import User from "../models/user.model.js";


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

// update address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const { street, city, state, pincode, isDefault } = req.body;

    // 1️⃣ Validate addressId
    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3️⃣ Find address
    const address = user.address.find(addr =>
      addr._id.equals(addressId)
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // 4️⃣ If setting default → unset others
    if (isDefault) {
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    // 5️⃣ Update fields (only if provided)
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;

    // 6️⃣ Save
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: user.address,
    });

  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// GET ALL ADDRESSES
export const getAllAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.address,
    });

  } catch (error) {
    console.error("Get all address error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//set address default
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    // 1️⃣ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2️⃣ Find address
    const address = user.address.find(addr =>
      addr._id.equals(addressId)
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // 3️⃣ Remove default from all addresses
    user.address.forEach(addr => {
      addr.isDefault = false;
    });

    // 4️⃣ Set selected address as default
    address.isDefault = true;

    // 5️⃣ Save user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address,
    });

  } catch (error) {
    console.error("Set default address error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
