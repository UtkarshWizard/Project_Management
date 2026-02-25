import jwt from "jsonwebtoken";

export function genereateToken(payload: object) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Jwt secret is not defined")
    }
    return jwt.sign(payload , secret , {expiresIn: "7d"});
}

export function verifyToken(token: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Jwt secret is not defined")
    }
    
    return jwt.verify(token , secret);
}