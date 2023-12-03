export type Weather = {
    temp: number,
    weather: number,
    date?: string,
}

export type CityItem = {
    id: number
    name?: string,
    lat?: number,
    lon?: number,
}

export type CityInfo = {
    city: CityItem,
    current?: Weather,
    forecast?: Weather[]
}

export type CityParams = {
    cityId: number,
}