export const format = (date: Date): string => {
    const [yyyy, mm, dd] = date.toISOString().split(/[^\d]/);
    return `${dd}-${mm}-${yyyy}`;
};
