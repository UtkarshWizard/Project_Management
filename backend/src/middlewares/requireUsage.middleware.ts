import { UsageMetric } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

export function requireUsageLimit( metric: UsageMetric ) {
    return async (req: Request , res: Response , next: NextFunction ) => {
        const subscription = await prisma.subscription.findFirst({
            where: { organizationId: req.organizationId! },
            include: { plan: true }
        })

        if (!subscription) {
            return res.status(403).json({ message: "No subscription found" });
        }

        const usage = await prisma.usageTracking.findUnique({
            where: {
                organizationId_metric: {
                    organizationId: req.organizationId!,
                    metric
                }
            }
        })

        if (!usage) {
            return res.status(403).json({ message: "Usage record not found" });
        }

        let maxLimit: number | null = null;

        if ( metric === UsageMetric.PROJECT_COUNT ) {
            maxLimit = subscription.plan.maxProjects
        }

        if ( metric === UsageMetric.MEMBER_COUNT ) {
            maxLimit = subscription.plan.maxMembers
        }

        if (maxLimit !== null && usage.currentValue >= maxLimit) {
            return res.status(403).json({ message: ` ${metric} limit exceeded for current Plan.`})
        }

        next();
    }
}