import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

export function requireFeature ( featureCode : string ) {
    return async ( req: Request , res: Response , next: NextFunction ) => {
        const subscription = await prisma.subscription.findFirst({
            where: { organizationId: req.organizationId! },
            include: {
                plan: {
                    include: {
                        features: {
                            include: { feature: true },
                        }
                    }
                }
            }
        });

        if (!subscription) {
            return res.status(403).json({ message: "No Subscription found" });
        }

        const hasFeature = subscription.plan.features.some(
            (pf) => pf.feature.code === featureCode
        );

        if (!hasFeature) {
            return res.status(403).json({
                message: ` Feature ${featureCode} not available in current Plan.`
            })
        }

        next();
    }
}