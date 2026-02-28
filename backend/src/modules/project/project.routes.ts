import { Router } from "express";
import { archiveProject, createProject, deleteProject, listProjects } from "./project.controller";
import { UsageMetric } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireActiveSubscription } from "../../middlewares/requireActiveSub.middleware";
import { requireFeature } from "../../middlewares/requireFeature.middleware";
import { requireUsageLimit } from "../../middlewares/requireUsage.middleware";
import { exportProjects } from "./project.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  requireActiveSubscription,
  requireFeature("CREATE_PROJECT"),
  requireUsageLimit(UsageMetric.PROJECT_COUNT),
  createProject
);

router.get(
  "/all",
  authenticate,
  listProjects
)

router.patch(
  "/:id/archive",
  authenticate,
  requireActiveSubscription,
  requireFeature("ARCHIVE_PROJECT"),
  archiveProject
)

router.delete(
  "/:id",
  authenticate,
  requireActiveSubscription,
  requireFeature("CREATE_PROJECT"),
  deleteProject
)

router.get(
  "/export",
  authenticate,
  requireActiveSubscription,
  requireFeature("EXPORT_PROJECT"),
  exportProjects
);

export default router;