"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFeature = requireFeature;
const prisma_1 = require("../config/prisma");
function requireFeature(featureCode) {
    return async (req, res, next) => {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { organizationId: req.organizationId },
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
        const hasFeature = subscription.plan.features.some((pf) => pf.feature.code === featureCode);
        if (!hasFeature) {
            return res.status(403).json({
                message: ` Feature ${featureCode} not available in current Plan.`
            });
        }
        next();
    };
}
//# sourceMappingURL=requireFeature.middleware.js.map