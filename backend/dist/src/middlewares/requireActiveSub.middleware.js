"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSubscription = requireActiveSubscription;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
async function requireActiveSubscription(req, res, next) {
    const subscription = await prisma_1.prisma.subscription.findFirst({
        where: { organizationId: req.organizationId }
    });
    if (!subscription) {
        return res.status(403).json({ message: "No active subscription Found" });
    }
    if (subscription.endDate && new Date() > subscription.endDate && subscription.status !== client_1.SubscriptionStatus.EXPIRED) {
        await prisma_1.prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: client_1.SubscriptionStatus.EXPIRED }
        });
        subscription.status = client_1.SubscriptionStatus.EXPIRED;
    }
    if (subscription.status !== client_1.SubscriptionStatus.ACTIVE) {
        return res.status(403).json({
            message: "Subscription expired. Please Upgrade"
        });
    }
    next();
}
//# sourceMappingURL=requireActiveSub.middleware.js.map