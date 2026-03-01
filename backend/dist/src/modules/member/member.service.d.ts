export declare function addMember(organizationId: string, data: {
    name: string;
    email: string;
    password: string;
}): Promise<{
    email: string;
    id: string;
    name: string;
    createdAt: Date;
    passwordHash: string;
    role: import(".prisma/client").$Enums.UserRole;
    organizationId: string;
}>;
export declare function getMembers(organizationId: string): Promise<{
    email: string;
    id: string;
    name: string;
    createdAt: Date;
    role: import(".prisma/client").$Enums.UserRole;
}[]>;
//# sourceMappingURL=member.service.d.ts.map