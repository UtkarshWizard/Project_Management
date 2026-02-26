import { Request, Response } from "express";
import * as authService from "./auth.service";

export async function signUp( req: Request , res: Response) {
    try {
        const result = await authService.signUp(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

export async function signIn( req: Request , res: Response) {
    try {
        const result = await authService.signIn(req.body);
        res.status(200).json(result);
    } catch (error : any) {
        res.status(400).json({ message: error.message });
    }
}