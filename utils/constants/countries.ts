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
   
export interface Country {
    name: string
    currency: string
}

/*
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
*/
const Ghana: Country = {
    name: 'Ghana',
    currency: 'GHS',
}
/*
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
*/
/*
const Zambia: Country = {
    currency: 'Egyptian Pounds',
    code: 'EGP',
    $rate: '52.50'
}
*/
const Kenya: Country = {
    name: 'Kenya',
    currency: 'KES',
}
const SouthAfrica: Country = {
    name: 'South Africa',
    currency: 'ZAR',
}
const Nigeria: Country = {
    name: 'Nigeria',
    currency: 'NGN',
}


export const Countries = {
    //Uganda: Uganda,
    //Morocco: Morocco,
    Ghana: Ghana,
    //Ethiopia: Ethiopia,
    //Tanzania : Tanzania,
    //Egypt: Egypt, 
    Kenya: Kenya,
    SouthAfrica: SouthAfrica,
    Nigeria: Nigeria,
} 
