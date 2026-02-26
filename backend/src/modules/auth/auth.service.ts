import bcrypt from "bcrypt";
import { genereateToken } from "../../utils/jwt";
import { prisma } from "../../config/prisma";
import { SubscriptionStatus, UsageMetric, UserRole } from "@prisma/client";

export async function signUp(data: {
  organizationName: string;
  adminName: string;
  email: string;
  password: string;
}) {
  const { organizationName, adminName, email, password } = data;

  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
      },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await tx.user.create({
      data: {
        name: adminName,
        email,
        passwordHash,
        role: UserRole.OWNER,
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
            status: SubscriptionStatus.ACTIVE,
        }
    });

    await tx.usageTracking.createMany({
        data: [
            {
                organizationId: organization.id,
                metric: UsageMetric.PROJECT_COUNT,
                currentValue: 0,
            },
            {
                organizationId: organization.id,
                metric: UsageMetric.MEMBER_COUNT,
                currentValue: 1,
            },
        ]
    });

    const token = genereateToken({
        userId: user.id,
        organizationId: organization.id,
        role: user.role,
    });

    return {
        token,
        organization,
        user
    }
  });
}

export async function signIn(data: {
  email: string;
  password: string;
}) {
  const { email , password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error ("Invalid Credentials");
  }

  const isValid = await bcrypt.compare(password , user.passwordHash);

  if ( !isValid ) {
    throw new Error("Invalid Password")
  }

  const token = genereateToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role
  })

  return { token };
}