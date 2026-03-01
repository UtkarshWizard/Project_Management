"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentSubscription = getCurrentSubscription;
exports.updgradePlan = updgradePlan;
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
async function checkAndUpdateExpiry(subscription) {
    if (subscription.endDate && new Date() > subscription.endDate && subscription.status !== client_1.SubscriptionStatus.EXPIRED) {
        await prisma_1.prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: client_1.SubscriptionStatus.EXPIRED },
        });
        subscription.status = client_1.SubscriptionStatus.EXPIRED;
    }
    return subscription;
}
async function getCurrentSubscription(organizationId) {
    const subscription = await prisma_1.prisma.subscription.findFirst({
        where: {
            organizationId
        },
        include: {
            plan: true,
        }
    });
    if (!subscription) {
        throw new Error("Subcription not found");
    }
    const updated = await checkAndUpdateExpiry(subscription);
    return {
        plan: updated.plan.name,
        status: updated.status,
        startDate: updated.startDate,
        endDate: updated.endDate,
        limits: {
            maxProjects: updated.plan.maxProjects ?? null,
            maxMembers: updated.plan.maxMembers ?? null,
        },
    };
}
async function updgradePlan(organizationId, planName) {
    const plan = await prisma_1.prisma.plan.findUnique({
        where: { name: planName },
    });
    if (!plan) {
        throw new Error("Plan not found");
    }
    const existingSub = await prisma_1.prisma.subscription.findFirst({
        where: { organizationId },
    });
    if (!existingSub) {
        throw new Error("Subscription not found");
    }
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);
    const updated = await prisma_1.prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
            planId: plan.id,
            status: client_1.SubscriptionStatus.ACTIVE,
            startDate: now,
            endDate: oneMonthLater,
        }
    });
    return updated;
}
//# sourceMappingURL=subscription.service.js.map