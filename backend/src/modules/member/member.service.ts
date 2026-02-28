import { UsageMetric, UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";

export async function addMember( 
    organizationId: string , 
    data: {
        name: string,
        email: string,
        password: string
}) {
    return prisma.$transaction( async (tx) => {
        const subscription = await tx.subscription.findFirst({
            where: { organizationId },
            include: { plan: true }
        });

        if (!subscription) {
            throw new Error (" Subscription not found")
        }

        const usage = await tx.usageTracking.findFirst({
            where: {
                organizationId,
                metric: UsageMetric.MEMBER_COUNT
            }
        });

        if (!usage) {
            throw new Error (" Usage data not available ");
        };

        const maxMembers = subscription.plan.maxMembers;
        
        if (maxMembers != null && usage.currentValue >= maxMembers ) {
            throw new Error (" Member limit exceeded");
        };

        const passwordHash = await bcrypt.hash( data.password , 10);

        const member = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: UserRole.MEMBER,
                organizationId
            }
        })

        await tx.usageTracking.update({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: UsageMetric.MEMBER_COUNT
                }
            },
            data: {
                currentValue: {
                    increment: 1
                }
            }
        });

        return member;
    })
}

export async function getMembers(
    organizationId: string,
) {
    const members = await prisma.user.findMany({
        where: { organizationId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc"}
    })

    return members;
}