export const moneyFmt = (value: number): string => {
    const formatter = new Intl.NumberFormat('el-EL', {
        minimumFractionDigits: 2,
    });

    return formatter.format(value);
};

export const chartMoneyFmt = new Intl.NumberFormat('el-EL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
});
