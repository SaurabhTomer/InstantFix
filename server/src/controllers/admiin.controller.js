import User from '../models/user.model.js'
import { getIO } from '../socket/socket.js';

//approve electrician 
export const approveElectrician = async (req, res) => {
    try {
        const { requestId } = req.params; // electrician id (admin approve karega)

        const electrician = await User.findById(requestId);

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
        const { requestId } = req.params; // electrician id (admin approve karega)

        const electrician = await User.findById(requestId);

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