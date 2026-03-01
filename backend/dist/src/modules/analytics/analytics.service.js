"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasicAnalytics = getBasicAnalytics;
exports.getAdvancedAnalytics = getAdvancedAnalytics;
const prisma_1 = require("../../config/prisma");
async function getBasicAnalytics(organizationId) {
    const projectCount = await prisma_1.prisma.project.count({
        where: { organizationId },
    });
    const memberCount = await prisma_1.prisma.user.count({
        where: { organizationId },
    });
    return {
        projectCount,
        memberCount,
    };
}
async function getAdvancedAnalytics(organizationId) {
    const projects = await prisma_1.prisma.project.findMany({
        where: { organizationId },
        select: { createdAt: true },
    });
    const projectCount = await prisma_1.prisma.project.count({
        where: { organizationId },
    });
    const monthlyCount = {};
    projects.forEach((p) => {
        const month = p.createdAt.toISOString().slice(0, 7);
        monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });
    const memberCount = await prisma_1.prisma.user.count({
        where: { organizationId },
    });
    const projectArchiveCount = await prisma_1.prisma.project.count({
        where: { organizationId, isArchived: true }
    });
    const projectActiveCount = await prisma_1.prisma.project.count({
        where: { organizationId, isArchived: false }
    });
    const usageCount = await prisma_1.prisma.usageTracking.count({
        where: { organizationId }
    });
    return {
        projectCount,
        monthlyCount,
        memberCount,
        projectArchiveCount,
        projectActiveCount,
        usageCount
    };
}
//# sourceMappingURL=analytics.service.js.map