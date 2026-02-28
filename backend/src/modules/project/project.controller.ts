import { Request, Response } from "express";
import * as projectService from "./project.service";
import { error } from "node:console";

export async function createProject(req: Request, res: Response) {
  try {
    const project = await projectService.createProject(
      req.organizationId!,
      req.body
    );

    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function listProjects( req: Request , res: Response ) {
  try {
    const includeArchived = req.query.archived === "true";

    const projects = await projectService.listProjects(
      req.organizationId!,
      includeArchived
    );

    res.status(201).json(projects)
  } catch ( error: any ) {
    res.status(400).json({ message: error.message });
  }
}

export async function archiveProject( req: Request , res: Response) {
  try {
    const projectId = req.params.id as string;
    
    const projects = await projectService.archiveProject(
      req.organizationId!,
      projectId
    );

    res.status(200).json(projects);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteProject( req: Request , res: Response ) {
  try {
    const projectId = req.params.id as string;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID required" });
    }

    await projectService.deleteProject( req.organizationId! , projectId)
    res.status(200).json({ message: "Project Deleted Succesfully"})
  } catch ( error: any ) {
    res.status(400).json({ message: error.message })
  }
}

export async function exportProjects(req: Request, res: Response) {
  try {
    const projects = await projectService.getProjectsForExport(
      req.organizationId!
    );

    const csvRows = [
      "Name,Description,Archived,CreatedAt",
      ...projects.map((p) =>
        [
          p.name,
          p.description ?? "",
          p.isArchived,
          p.createdAt.toISOString(),
        ]
          .map((field) =>
            `"${String(field).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ];

    const csv = csvRows.join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment("projects.csv");
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}