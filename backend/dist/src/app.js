"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const subscription_routes_1 = __importDefault(require("./modules/subscriptions/subscription.routes"));
const project_routes_1 = __importDefault(require("./modules/project/project.routes"));
const member_routes_1 = __importDefault(require("./modules/member/member.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});
exports.app.use("/auth", auth_routes_1.default);
exports.app.use("/subscription", subscription_routes_1.default);
exports.app.use("/projects", project_routes_1.default);
exports.app.use("/members", member_routes_1.default);
exports.app.use("/analytics", analytics_routes_1.default);
//# sourceMappingURL=app.js.map