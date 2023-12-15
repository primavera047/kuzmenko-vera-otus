import { CityInfo, Weather } from './custom-types'
import { getDateString } from './date-processor';

function getMostFrequent(array: number[]) {
    let frequency: Record<number, number> = {};

    for (let value of array) {
        let count: number = frequency[value] || 0;
        ++count;
        frequency[value] = count;
    }

    let mostFrequent: number = array[0];

    for (let value in frequency) {
        if (frequency[value] > frequency[mostFrequent]) {
            mostFrequent = parseInt(value);
        }
    }

    return mostFrequent;
}

function convertToIconNum(weatherCode: number): number {
    if (weatherCode >= 200 && weatherCode < 300) {
        return 4;
    }
    if (weatherCode >= 300 && weatherCode < 600) {
        return 2;
    }
    if (weatherCode >= 600 && weatherCode < 700) {
        return 3;
    }
    if (weatherCode != 800) {
        return 1;
    }

    return 0;
}

function averageWeather(forecast: { temp: number[], weather: number[] }): Weather {
    let averageTemp = Math.round(forecast.temp.reduce((a, b) => a + b, 0) / forecast.temp.length) || 0;
    let averageWeather = convertToIconNum(getMostFrequent(forecast.weather));

    return { temp: averageTemp, weather: averageWeather };
}

type ProcessedApiDataType = {
    current?: Weather,
    forecast?: Weather[]
}

function apiResponseHandler(json: any): ProcessedApiDataType {
    const currentDate = new Date();
    const currentDateSting = getDateString(currentDate);

    let result: { [date: string]: { temp: number[], weather: number[] } } = {};

    for (let record of json['list']) {
        let date: Date = new Date(record['dt'] * 1000);
        let dateString: string = getDateString(date);
        let temp: number = record['main']['temp'];
        let weather: number = record['weather']['id'];

        if (result[dateString] === undefined) {
            result[dateString] = { temp: [], weather: [] };
        }

        result[dateString].temp.push(temp);
        result[dateString].weather.push(weather);
    }

    let processedApiData: ProcessedApiDataType = { forecast: [] };

    for (let dateString in result) {
        let dayForecast: Weather = averageWeather(result[dateString]);
        dayForecast.date = dateString;

        if (dateString === currentDateSting) {
            processedApiData.current = dayForecast;
        }
        else {
            processedApiData.forecast?.push(dayForecast);
        }
    }

    return processedApiData!;
}

export function noInternetApiRequest(result: CityInfo): CityInfo {
    let json: any = {
        "list": [
            {
                "dt": 1702576086,
                "main": {
                    "temp": 25
                },
                "weather": {
                    "id": 500
                }
            },
            {
                "dt": 1702662597,
                "main": {
                    "temp": 25
                },
                "weather": {
                    "id": 500
                }
            },
            {
                "dt": 1702749018,
                "main": {
                    "temp": 25
                },
                "weather": {
                    "id": 500
                }
            },
            {
                "dt": 1702835444,
                "main": {
                    "temp": 25
                },
                "weather": {
                    "id": 500
                }
            },
            {
                "dt": 1702921871,
                "main": {
                    "temp": 25
                },
                "weather": {
                    "id": 500
                }
            },
            {
                "dt": 1703008274,
                "main": {
                    "temp": 25
                },
                "weather": {
                    "id": 500
                }
            }
        ]
    }

    let parsedResult = apiResponseHandler(json);

    result.current = parsedResult.current;
    result.forecast = parsedResult.forecast;

    return result;
}

export async function apiRequest(result: CityInfo): Promise<CityInfo> {
    let url = new URL("http://api.openweathermap.org/data/2.5/forecast")

    if (result.city.lat && result.city.lon) {
        url.searchParams.set('lat', result.city.lat.toString())
        url.searchParams.set('lon', result.city.lon.toString())
        url.searchParams.set('units', 'metric');
        url.searchParams.set('appid', '01ad26fc529debe4580e070bc4e8478c');

        console.log(url);
        AbortSignal.timeout ??= function timeout(ms) {
            const ctrl = new AbortController()
            setTimeout(() => ctrl.abort(), ms)
            return ctrl.signal
        }

        let response = await fetch(url, { signal: AbortSignal.timeout(3000) });

        console.log(response);

        if (response.ok) {
            let json: JSON = await response.json() as JSON;

            console.log(json);

            let parsedResult = apiResponseHandler(json);

            result.current = parsedResult.current;
            result.forecast = parsedResult.forecast;
        }
        else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    return result;
}