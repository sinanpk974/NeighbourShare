import userSchema from "../model/usermodel.js";

const AdminAuth = async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.user.UserID);

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).send({
                success: false,
                message: "Access denied"
            });
        }

        next();

    } catch (error) {
        console.log("AdminAuth error:", error);

        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export default AdminAuth;