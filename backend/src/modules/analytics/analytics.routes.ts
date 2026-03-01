import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireActiveSubscription } from "../../middlewares/requireActiveSub.middleware";
import { requireFeature } from "../../middlewares/requireFeature.middleware";
import { getAdvancedAnalytics, getBasicAnalytics } from "./analytics.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  // requireActiveSubscription,
  requireFeature("VIEW_ANALYTICS"),
  getBasicAnalytics
);

router.get(
  "/advanced",
  authenticate,
  requireActiveSubscription,
  requireFeature("ADVANCED_ANALYTICS"),
  getAdvancedAnalytics
);

export default router