export declare function createProject(organizationId: string, data: {
    name: string;
    description?: string;
}): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    organizationId: string;
    description: string | null;
    isArchived: boolean;
}>;
export declare function listProjects(organizationId: string, includeArchived?: boolean): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    organizationId: string;
    description: string | null;
    isArchived: boolean;
}[]>;
export declare function archiveProject(organizationId: string, projectId: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    organizationId: string;
    description: string | null;
    isArchived: boolean;
}>;
export declare function deleteProject(organizationId: string, projectId: string): Promise<{
    message: string;
}>;
export declare function getProjectsForExport(organizationId: string): Promise<{
    name: string;
    createdAt: Date;
    description: string | null;
    isArchived: boolean;
}[]>;
//# sourceMappingURL=project.service.d.ts.map