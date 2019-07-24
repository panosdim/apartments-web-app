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