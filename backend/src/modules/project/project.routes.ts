import { Router } from "express";
import { createProject } from "./project.controller";
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
  requireFeature("CREATE_PROJECT"),
  requireUsageLimit(UsageMetric.PROJECT_COUNT),
  createProject
);

export default router;