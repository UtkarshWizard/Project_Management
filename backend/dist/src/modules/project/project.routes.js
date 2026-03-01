"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("./project.controller");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const requireActiveSub_middleware_1 = require("../../middlewares/requireActiveSub.middleware");
const requireFeature_middleware_1 = require("../../middlewares/requireFeature.middleware");
const requireUsage_middleware_1 = require("../../middlewares/requireUsage.middleware");
const project_controller_2 = require("./project.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, requireActiveSub_middleware_1.requireActiveSubscription, (0, requireFeature_middleware_1.requireFeature)("CREATE_PROJECT"), (0, requireUsage_middleware_1.requireUsageLimit)(client_1.UsageMetric.PROJECT_COUNT), project_controller_1.createProject);
router.get("/all", auth_middleware_1.authenticate, project_controller_1.listProjects);
router.patch("/:id/archive", auth_middleware_1.authenticate, requireActiveSub_middleware_1.requireActiveSubscription, (0, requireFeature_middleware_1.requireFeature)("ARCHIVE_PROJECT"), project_controller_1.archiveProject);
router.delete("/:id", auth_middleware_1.authenticate, requireActiveSub_middleware_1.requireActiveSubscription, (0, requireFeature_middleware_1.requireFeature)("CREATE_PROJECT"), project_controller_1.deleteProject);
router.get("/export", auth_middleware_1.authenticate, requireActiveSub_middleware_1.requireActiveSubscription, (0, requireFeature_middleware_1.requireFeature)("EXPORT_PROJECT"), project_controller_2.exportProjects);
exports.default = router;
//# sourceMappingURL=project.routes.js.map