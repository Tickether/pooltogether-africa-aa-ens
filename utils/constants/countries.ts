/*
    Top 10 African crypto users Countdown - ones I can gate for except (DRC)
    {
        Uganda
        Morocco
        Ghana
        Ethiopia
        Tanzania 
        Egypt 
        Kenya 
        South Africa
        Nigeria
    }
*/
   
interface Country {
    currency: string
    code: string
    $rate: string
}


const Uganda: Country = {
    currency: 'Ugandan Shillings',
    code: 'UGX',
    $rate: '3850.50'
}
const Morocco: Country = {
    currency: 'Moroccan Dirhams',
    code: 'MAD',
    $rate: '10.50'
}
const Ghana: Country = {
    currency: 'Ghanaian Cedis',
    code: 'GHS',
    $rate: '12.32'
}
const Ethiopia: Country = {
    currency: 'Ethiopian Birrs',
    code: 'ETB',
    $rate: '117.50'
}
const Tanzania: Country = {
    currency: 'Tanzanian Shillings',
    code: 'TZS',
    $rate: '2666.50'
}
const Egypt: Country = {
    currency: 'Egyptian Pounds',
    code: 'EGP',
    $rate: '52.50'
}
const Kenya: Country = {
    currency: 'Kenyan Shillings',
    code: 'KES',
    $rate: '158.50'
}
const SouthAfrica: Country = {
    currency: 'South African Rand',
    code: 'ZAR',
    $rate: '20.50'
}
const Nigeria: Country = {
    currency: 'Nigerian Nairas',
    code: 'NGN',
    $rate: '1155.50'
}


export const Countries = {
    Uganda: Uganda,
    Morocco: Morocco,
    Ghana: Ghana,
    Ethiopia: Ethiopia,
    Tanzania : Tanzania,
    Egypt: Egypt, 
    Kenya: Kenya,
    SouthAfrica: SouthAfrica,
    Nigeria: Nigeria,
} 
