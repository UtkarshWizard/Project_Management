"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("./subscription.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, subscription_controller_1.getSubscription);
router.post("/upgrade", auth_middleware_1.authenticate, subscription_controller_1.upgrade);
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map