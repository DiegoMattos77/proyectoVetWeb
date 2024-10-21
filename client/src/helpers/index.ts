export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(amount);
}

export function toBoolean(str: string) {
    return str.toLocaleLowerCase() === "true"
}