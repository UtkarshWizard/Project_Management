"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid Token Provided" });
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        req.organizationId = user.organizationId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
//# sourceMappingURL=auth.middleware.js.map