export type UserType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
};

export type FlatType = {
    id: number;
    name: string;
    address: string;
    floor: number;
};

export type LesseeType = {
    id: number;
    name: string;
    address: string;
    postalCode: string;
    from: string;
    until: string;
    flatId: number;
};
