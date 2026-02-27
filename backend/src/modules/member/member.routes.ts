import { Router } from "express";
import { addMember } from "./member.controller";
import { UsageMetric } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireActiveSubscription } from "../../middlewares/requireActiveSub.middleware";
import { requireFeature } from "../../middlewares/requireFeature.middleware";
import { requireUsageLimit } from "../../middlewares/requireUsage.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  requireActiveSubscription,
  requireFeature("ADD_MEMBER"),
  requireUsageLimit(UsageMetric.MEMBER_COUNT),
  addMember
);

export default router;