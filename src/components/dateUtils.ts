export const format = (date: Date): string => {
    const [yyyy, mm, dd] = date.toISOString().split(/[^\d]/);
    return `${dd}-${mm}-${yyyy}`;
};

export const toMySQLDateString = (date: Date): string => {
    return date.toISOString().slice(0, 10);
};

export const formatMySQLDateString = (date: string) => {
    const [yyyy, mm, dd] = date.split('-');
    return `${dd}-${mm}-${yyyy}`;
};

export const now: Date = new Date();

export const maxDate: Date = new Date(now.getFullYear() + 4, now.getMonth(), now.getDate());

export const getYear = (date: string): number => {
    return Number(date.split('-')[0]);
};
