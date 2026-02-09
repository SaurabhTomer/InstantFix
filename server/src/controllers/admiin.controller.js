import User from '../models/user.model.js'
import { getIO } from '../socket/socket.js';

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

        // 2️⃣ Check role
        if (electrician.role !== "ELECTRICIAN") {
            return res.status(400).json({
                success: false,
                msg: "User is not an electrician",
            });
        }

        // 3️⃣ Already approved?
        if (electrician.approvalStatus === "approved") {
            return res.status(400).json({
                success: false,
                msg: "Electrician already approved",
            });
        }

        // Approve electrician
        electrician.approvalStatus = "approved";
        await electrician.save();


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


        //  Real-time socket notify 
        try {
            const io = getIO();
            // console.log("bn gya")
            io.to(electrician._id.toString()).emit("ELECTRICIAN_REJECTED", {
                electricianId: electrician._id,
                message: "Your account has been rejected by admin",
            });
        } catch (socketError) {
            console.log("Socket not connected, skipping emit");
        }

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
      role: "electrician",
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

    // optional stats (admin view)
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
