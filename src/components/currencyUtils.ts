const moneyFmt = new Intl.NumberFormat('el-EL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
});

export const formatEuro = (value: number): string => {
    return moneyFmt.format(value);
};
