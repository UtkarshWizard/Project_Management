"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
exports.signIn = signIn;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
async function signUp(data) {
    const { organizationName, adminName, email, password } = data;
    return prisma_1.prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
            data: {
                name: organizationName,
            },
        });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await tx.user.create({
            data: {
                name: adminName,
                email,
                passwordHash,
                role: client_1.UserRole.OWNER,
                organizationId: organization.id,
            },
        });
        const freePlan = await tx.plan.findUnique({
            where: { name: "Free" },
        });
        if (!freePlan) {
            throw new Error("Free plan not found");
        }
        await tx.subscription.create({
            data: {
                organizationId: organization.id,
                planId: freePlan.id,
                status: client_1.SubscriptionStatus.ACTIVE,
            }
        });
        await tx.usageTracking.createMany({
            data: [
                {
                    organizationId: organization.id,
                    metric: client_1.UsageMetric.PROJECT_COUNT,
                    currentValue: 0,
                },
                {
                    organizationId: organization.id,
                    metric: client_1.UsageMetric.MEMBER_COUNT,
                    currentValue: 1,
                },
            ]
        });
        const token = (0, jwt_1.genereateToken)({
            userId: user.id,
            organizationId: organization.id,
            role: user.role,
        });
        return {
            token,
            organization,
            user
        };
    });
}
async function signIn(data) {
    const { email, password } = data;
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Invalid Credentials");
    }
    const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        throw new Error("Invalid Password");
    }
    const token = (0, jwt_1.genereateToken)({
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role
    });
    return { token };
}
//# sourceMappingURL=auth.service.js.map