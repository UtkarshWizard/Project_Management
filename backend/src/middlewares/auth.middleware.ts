import { prisma } from "../config/prisma";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;

    if ( !header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized"});
    }

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid Token Provided"})
    }

    try {
        const payload = verifyToken(token) as { 
            userId: string , 
            organizationId: string , 
            role: string 
        };

        const user = await prisma.user.findUnique({
            where: { id: payload.userId} ,
        });

        if (!user) {
            return res.status(401).json({ message: "User not found"});
        }

        req.user = user;
        req.organizationId = user.organizationId;

        next();
    } catch (error: any) {
        return res.status(401).json({ message: error.message})
    }
}