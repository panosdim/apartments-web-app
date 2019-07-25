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
    postal_code: string;
    from: string;
    until: string;
    flat_id: number;
};

export type BalanceType = {
    id: number;
    date: string;
    amount: number;
    flat_id: number;
    comment: string;
};
