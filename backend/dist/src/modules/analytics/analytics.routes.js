"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const requireActiveSub_middleware_1 = require("../../middlewares/requireActiveSub.middleware");
const requireFeature_middleware_1 = require("../../middlewares/requireFeature.middleware");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, 
// requireActiveSubscription,
(0, requireFeature_middleware_1.requireFeature)("VIEW_ANALYTICS"), analytics_controller_1.getBasicAnalytics);
router.get("/advanced", auth_middleware_1.authenticate, requireActiveSub_middleware_1.requireActiveSubscription, (0, requireFeature_middleware_1.requireFeature)("ADVANCED_ANALYTICS"), analytics_controller_1.getAdvancedAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map