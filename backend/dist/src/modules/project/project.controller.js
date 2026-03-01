"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
exports.listProjects = listProjects;
exports.archiveProject = archiveProject;
exports.deleteProject = deleteProject;
exports.exportProjects = exportProjects;
const projectService = __importStar(require("./project.service"));
async function createProject(req, res) {
    try {
        const project = await projectService.createProject(req.organizationId, req.body);
        res.status(201).json(project);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function listProjects(req, res) {
    try {
        const includeArchived = req.query.archived === "true";
        const projects = await projectService.listProjects(req.organizationId, includeArchived);
        res.status(201).json(projects);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function archiveProject(req, res) {
    try {
        const projectId = req.params.id;
        const projects = await projectService.archiveProject(req.organizationId, projectId);
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function deleteProject(req, res) {
    try {
        const projectId = req.params.id;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID required" });
        }
        await projectService.deleteProject(req.organizationId, projectId);
        res.status(200).json({ message: "Project Deleted Succesfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function exportProjects(req, res) {
    try {
        const projects = await projectService.getProjectsForExport(req.organizationId);
        const csvRows = [
            "Name,Description,Archived,CreatedAt",
            ...projects.map((p) => [
                p.name,
                p.description ?? "",
                p.isArchived,
                p.createdAt.toISOString(),
            ]
                .map((field) => `"${String(field).replace(/"/g, '""')}"`)
                .join(",")),
        ];
        const csv = csvRows.join("\n");
        res.header("Content-Type", "text/csv");
        res.attachment("projects.csv");
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//# sourceMappingURL=project.controller.js.map