import { prisma } from "../../config/prisma";
import { SubscriptionStatus } from "@prisma/client";

async function checkAndUpdateExpiry(subscription: any) {
    if ( subscription.endDate && new Date() > subscription.endDate && subscription.status !== SubscriptionStatus.EXPIRED) {
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: SubscriptionStatus.EXPIRED },
        });

        subscription.status = SubscriptionStatus.EXPIRED;
    }

    return subscription;
}

export async function getCurrentSubscription ( organizationId: string ) {
    const subscription = await prisma.subscription.findFirst({
        where: {
            organizationId
        },
        include: {
            plan: true,
        }
    })

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
    }
}

export async function updgradePlan (
    organizationId: string,
    planName: string
) {
    const plan = await prisma.plan.findUnique({
        where: { name: planName },
    });

    if ( !plan ) {
        throw new Error("Plan not found");
    }

    const existingSub = await prisma.subscription.findFirst({
        where: { organizationId },
    })

    if (!existingSub) {
        throw new Error("Subscription not found");
    }

    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const updated = await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
            planId: plan.id,
            status: SubscriptionStatus.ACTIVE,
            startDate: now,
            endDate: oneMonthLater,
        }
    })

    return updated;
}