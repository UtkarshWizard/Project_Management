import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";

export async function getSubscription( req: Request , res: Response) {
    try {
        const result = await subscriptionService.getCurrentSubscription( req.organizationId! );
        res.json(result);
    } catch ( error: any ) {
        res.status(400).json({ message: error.message })
    }
}

export async function upgrade( req: Request , res: Response) {
    try {
        const { planName } = req.body;

        const result = await subscriptionService.updgradePlan( req.organizationId! , planName );

        res.json({ message: "Plan upgraded succesfully" , subscription: result});
    } catch ( error: any ) {
        res.status(400).json({ message: error.message });
    }
}