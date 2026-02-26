import { Router } from "express";
import { getSubscription, upgrade } from "./subscription.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getSubscription);
router.post("/upgrade", authenticate, upgrade);

export default router;