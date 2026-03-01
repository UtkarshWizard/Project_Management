"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_controller_2 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.signUp);
router.post("/signin", auth_controller_2.signIn);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map