"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
exports.listProjects = listProjects;
exports.archiveProject = archiveProject;
exports.deleteProject = deleteProject;
exports.getProjectsForExport = getProjectsForExport;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
async function createProject(organizationId, data) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const subscription = await tx.subscription.findFirst({
            where: { organizationId },
            include: { plan: true },
        });
        if (!subscription) {
            throw new Error(" Subscription not found ");
        }
        const usage = await tx.usageTracking.findUnique({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: client_1.UsageMetric.PROJECT_COUNT,
                }
            }
        });
        if (!usage) {
            throw new Error("Usage record missing");
        }
        const maxProjects = subscription.plan.maxProjects;
        if (maxProjects != null && usage.currentValue >= maxProjects) {
            throw new Error("Project limit exceeded");
        }
        const project = await tx.project.create({
            data: {
                name: data.name,
                description: data.description || null,
                organizationId
            }
        });
        await tx.usageTracking.update({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: client_1.UsageMetric.PROJECT_COUNT
                }
            },
            data: {
                currentValue: {
                    increment: 1
                }
            }
        });
        return project;
    });
}
async function listProjects(organizationId, includeArchived = false) {
    return prisma_1.prisma.project.findMany({
        where: { organizationId,
            ...(includeArchived ? {} : { isArchived: false })
        },
        orderBy: { createdAt: "desc" }
    });
}
async function archiveProject(organizationId, projectId) {
    return prisma_1.prisma.project.update({
        where: {
            id: projectId,
            organizationId
        },
        data: {
            isArchived: true
        }
    });
}
async function deleteProject(organizationId, projectId) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const project = await tx.project.findFirst({
            where: { id: projectId, organizationId }
        });
        if (!project) {
            throw new Error("Project not found");
        }
        await tx.project.delete({
            where: { id: projectId }
        });
        await tx.usageTracking.update({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: "PROJECT_COUNT"
                }
            },
            data: {
                currentValue: {
                    decrement: 1,
                }
            }
        });
        return { message: "Project deleted" };
    });
}
async function getProjectsForExport(organizationId) {
    return prisma_1.prisma.project.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        select: {
            name: true,
            description: true,
            isArchived: true,
            createdAt: true,
        },
    });
}
//# sourceMappingURL=project.service.js.map