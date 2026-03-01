"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("./member.controller");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const requireActiveSub_middleware_1 = require("../../middlewares/requireActiveSub.middleware");
const requireFeature_middleware_1 = require("../../middlewares/requireFeature.middleware");
const requireUsage_middleware_1 = require("../../middlewares/requireUsage.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, requireActiveSub_middleware_1.requireActiveSubscription, (0, requireFeature_middleware_1.requireFeature)("ADD_MEMBER"), (0, requireUsage_middleware_1.requireUsageLimit)(client_1.UsageMetric.MEMBER_COUNT), member_controller_1.addMember);
router.get("/all", auth_middleware_1.authenticate, member_controller_1.getMembers);
exports.default = router;
//# sourceMappingURL=member.routes.js.map