"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genereateToken = genereateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function genereateToken(payload) {
    const secret = process.env.JWT_SECRET;
    // console.log("generate secret" , secret)
    if (!secret) {
        throw new Error("Jwt secret is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
}
function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    // console.log("verify secret ", secret)
    if (!secret) {
        throw new Error("Jwt secret is not defined");
    }
    return jsonwebtoken_1.default.verify(token, secret);
}
//# sourceMappingURL=jwt.js.map