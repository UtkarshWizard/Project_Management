import { Request, Response } from "express";
import * as projectService from "./project.service";

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