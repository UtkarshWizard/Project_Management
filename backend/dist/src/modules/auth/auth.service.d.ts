export declare function signUp(data: {
    organizationName: string;
    adminName: string;
    email: string;
    password: string;
}): Promise<{
    token: string;
    organization: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    };
    user: {
        email: string;
        id: string;
        name: string;
        createdAt: Date;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        organizationId: string;
    };
}>;
export declare function signIn(data: {
    email: string;
    password: string;
}): Promise<{
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map