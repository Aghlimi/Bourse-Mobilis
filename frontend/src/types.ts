type Mission = {
    id: number;
    title: string;
    description: string;
    from: string;
    to: string;
    when: string;
    distance: number;
    status: string;
    rejection_reason?: string;
    created_by: {
        name: string, id: number, email: string
    };
    assigned_to?: {
        name: string, id: number, email: string
    };
}

type User = {
    id: number;
    email: string;
    name: string;
    role: string;
}


export type { Mission, User };