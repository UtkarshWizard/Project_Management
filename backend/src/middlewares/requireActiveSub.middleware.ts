import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { SubscriptionStatus } from "@prisma/client";

export async function requireActiveSubscription(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const subscription = await prisma.subscription.findFirst({
        where: { organizationId : req.organizationId! }
    });

    if ( !subscription ) {
        return res.status(403).json({ message : "No active subscription Found" });
    }

    if ( subscription.endDate && new Date() > subscription.endDate && subscription.status !== SubscriptionStatus.EXPIRED) {
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: SubscriptionStatus.EXPIRED }
        });

        subscription.status = SubscriptionStatus.EXPIRED
    }

    if ( subscription.status !== SubscriptionStatus.ACTIVE ) {
        return res.status(403).json({
            message : "Subscription expired. Please Upgrade"
        })
    }

    next();
}