import { Request, Response } from "express";
import * as memberService from "./member.service"

export async function addMember ( req: Request , res: Response) {
    try {
        const member = await memberService.addMember(
            req.organizationId!,
            req.body
        )

        res.status(201).json(member)
    } catch ( error: any ) {
        res.status(400).json({ message: error.message })
    }
}