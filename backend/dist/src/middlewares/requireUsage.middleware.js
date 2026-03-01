"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUsageLimit = requireUsageLimit;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
function requireUsageLimit(metric) {
    return async (req, res, next) => {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { organizationId: req.organizationId },
            include: { plan: true }
        });
        if (!subscription) {
            return res.status(403).json({ message: "No subscription found" });
        }
        const usage = await prisma_1.prisma.usageTracking.findUnique({
            where: {
                organizationId_metric: {
                    organizationId: req.organizationId,
                    metric
                }
            }
        });
        if (!usage) {
            return res.status(403).json({ message: "Usage record not found" });
        }
        let maxLimit = null;
        if (metric === client_1.UsageMetric.PROJECT_COUNT) {
            maxLimit = subscription.plan.maxProjects;
        }
        if (metric === client_1.UsageMetric.MEMBER_COUNT) {
            maxLimit = subscription.plan.maxMembers;
        }
        if (maxLimit !== null && usage.currentValue >= maxLimit) {
            return res.status(403).json({ message: ` ${metric} limit exceeded for current Plan.` });
        }
        next();
    };
}
//# sourceMappingURL=requireUsage.middleware.js.map