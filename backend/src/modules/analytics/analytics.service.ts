import { UsageMetric } from "@prisma/client";
import { prisma } from "../../config/prisma";

export async function getBasicAnalytics(organizationId: string) {

  const projectCount = await prisma.project.count({
    where: { organizationId },
  });

  const memberCount = await prisma.user.count({
    where: { organizationId },
  });

  return {
    projectCount,
    memberCount,
  };
}

export async function getAdvancedAnalytics( organizationId: string) {

    const projects = await prisma.project.findMany({
        where: { organizationId },
        select: { createdAt: true },
    });

    const projectCount = await prisma.project.count({
        where: { organizationId },
    });

    const monthlyCount: Record<string, number> = {};

    projects.forEach((p) => {
        const month = p.createdAt.toISOString().slice(0, 7);
        monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });

    const memberCount = await prisma.user.count({
        where: { organizationId },
    });

    const projectArchiveCount = await prisma.project.count({
        where: { organizationId , isArchived: true }
    });

    const projectActiveCount = await prisma.project.count({
        where: { organizationId, isArchived: false }
    });

    const usageCount = await prisma.usageTracking.count({
        where: { organizationId }
    });

    return {
        projectCount,
        monthlyCount,
        memberCount,
        projectArchiveCount,
        projectActiveCount,
        usageCount
    }
}