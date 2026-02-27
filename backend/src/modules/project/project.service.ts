import { UsageMetric } from "@prisma/client";
import { prisma } from "../../config/prisma";

export async function createProject (
    organizationId: string,
    data: { name: string , description?: string }
) {
    return prisma.$transaction(async (tx) => {
        const subscription = await tx.subscription.findFirst({
            where: { organizationId },
            include: { plan: true },
        });

        if ( !subscription ) {
            throw new Error(" Subscription not found ")
        }

        const usage = await tx.usageTracking.findUnique({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: UsageMetric.PROJECT_COUNT,
                }
            }
        })

        if (!usage) {
            throw new Error ("Usage record missing");
        }

        const maxProjects = subscription.plan.maxProjects;

        if ( maxProjects != null && usage.currentValue >= maxProjects) {
            throw new Error ("Project limit exceeded")
        }
        
        const project = await tx.project.create({
            data: {
                name: data.name,
                description: data.description || null,
                organizationId
            }
        })

        await tx.usageTracking.update({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: UsageMetric.PROJECT_COUNT
                }
            },
            data: {
                currentValue: {
                    increment: 1
                }
            }
        });
        
        return project;
    })
}