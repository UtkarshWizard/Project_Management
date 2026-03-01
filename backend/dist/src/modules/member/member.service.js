"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMember = addMember;
exports.getMembers = getMembers;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function addMember(organizationId, data) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const subscription = await tx.subscription.findFirst({
            where: { organizationId },
            include: { plan: true }
        });
        if (!subscription) {
            throw new Error(" Subscription not found");
        }
        const usage = await tx.usageTracking.findFirst({
            where: {
                organizationId,
                metric: client_1.UsageMetric.MEMBER_COUNT
            }
        });
        if (!usage) {
            throw new Error(" Usage data not available ");
        }
        ;
        const maxMembers = subscription.plan.maxMembers;
        if (maxMembers != null && usage.currentValue >= maxMembers) {
            throw new Error(" Member limit exceeded");
        }
        ;
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const member = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: client_1.UserRole.MEMBER,
                organizationId
            }
        });
        await tx.usageTracking.update({
            where: {
                organizationId_metric: {
                    organizationId,
                    metric: client_1.UsageMetric.MEMBER_COUNT
                }
            },
            data: {
                currentValue: {
                    increment: 1
                }
            }
        });
        return member;
    });
}
async function getMembers(organizationId) {
    const members = await prisma_1.prisma.user.findMany({
        where: { organizationId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    });
    return members;
}
//# sourceMappingURL=member.service.js.map