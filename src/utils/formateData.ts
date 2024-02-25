export const formatDateAndClock = (date: string) => {
    const reverseDate = date.split('T')
    const fistNewDate = reverseDate[0].split('-').reverse().join('.')
    return fistNewDate + ' ' +  reverseDate[1]
}
export const formatDate = (date: string) => {
    return date.split('T')[0].split('-').reverse().join('.')
}

export const formatPrice = (price: number) => {
    const newPrice =  price.toFixed(2).replace('.', ',')
    return `${newPrice} ₽`
}

