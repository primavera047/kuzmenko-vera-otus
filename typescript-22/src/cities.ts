import localforage from "localforage";
import { matchSorter } from "match-sorter";
import { CityInfo, CityItem, Weather } from "./custom-types"
import { round } from "@floating-ui/utils";


export async function getCities(q?: string): Promise<CityInfo[]> {
  let cities: CityInfo[] = await localforage.getItem("cities") as CityInfo[];

  if (!cities) cities = [];

  if (q) {
    cities = matchSorter(cities, q, {keys: ['city.name']});
  }

  return cities.sort((a: CityInfo, b: CityInfo): number => { let result = (a.city.name! > b.city.name!) ? 1 : (a.city.name !== b.city.name) ? -1 : 0; return result; });
}

export async function createCity(): Promise<CityInfo> {
  let id: number = round(Math.random() * 100000);
  let city: CityInfo = { city: {id} };
  let cities = await getCities();

  cities.unshift(city);
  await set(cities);

  return city;
}

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

function averageWeather(forecast: { temp: number[], weather: number[]}): Weather {
  let averageTemp = Math.round(forecast.temp.reduce((a, b) => a + b, 0) / forecast.temp.length) || 0;
  let averageWeather = convertToIconNum(getMostFrequent(forecast.weather));

  return {temp: averageTemp, weather: averageWeather}; 
}

function getDateString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

export function getShortDate(dateString: string) {
  let date: Date = new Date(dateString);
  let shortDaysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  return `${shortDaysOfWeek[date.getDay()]} ${date.getDate()}.${date.getMonth()+1}`
}

export function getFullDate(dateString: string) {
  let date: Date = new Date(dateString);
  let fullDaysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  let fullMonth = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  return `${fullDaysOfWeek[date.getDay()]}, ${date.getDate()} ${fullMonth[date.getMonth()]} ${date.getFullYear()}`
}

function apiHandler(json: any): {current: Weather, forecast: Weather[]} {
  let cWeather: Weather;
  let forecast: Weather[] = [];
  let currentDate = new Date();
  let currentDateSting = getDateString(currentDate);

  let result: { [date: string]: { temp: number[], weather: number[]} } = {};

  for (let record of json['list']) {
    let date: Date = new Date(record['dt'] * 1000);
    let dateString: string = getDateString(date);
    let temp: number = record['main']['temp'];
    let weather: number = record['weather']['id'];  

    if (result[dateString] === undefined) {
      result[dateString] = {temp: [], weather: []};
    }

    result[dateString].temp.push(temp);
    result[dateString].weather.push(weather);
  }

  for (let dateString in result) {
    let dayForecast: Weather = averageWeather(result[dateString]);
    dayForecast.date = dateString;

    if (dateString === currentDateSting) {
      cWeather = dayForecast;
    }
    else {      
      forecast.push(dayForecast);
    }
  }

  return {current: cWeather!, forecast: forecast};
}

export async function getCity(id: number): Promise<CityInfo> {
  let cities: CityInfo[] = await localforage.getItem("cities") as CityInfo[];
  let result: CityInfo = cities.find((city: CityInfo): boolean => { return city.city.id.toString() === id.toString() }) as CityInfo;

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
      
      let parsedResult = apiHandler(json);

      result.current = parsedResult.current;
      result.forecast = parsedResult.forecast
    } else {
      alert("Ошибка HTTP: " + response.status);
    }   
  } 

  return result ?? null;
}

export async function updateCity(id: number, updates: CityItem): Promise<CityInfo> {
  let cities: CityInfo[] = await localforage.getItem("cities") as CityInfo[];
  let city: CityInfo = cities.find((city: CityInfo): boolean => { return city.city.id.toString() === id.toString() }) as CityInfo;

  if (!city) throw new Error(`Город не найден (id: ${id})`);

  Object.assign(city.city, updates);
  await set(cities);

  return city;
}

export async function deleteCity(id: number): Promise<boolean> {
  let cities: CityInfo[] = await localforage.getItem("cities") as CityInfo[];
  let index = cities.findIndex(city => city.city.id.toString() === id.toString());

  if (index > -1) {
    cities.splice(index, 1);
    await set(cities);

    return true;
  }

  return false;
}

function set(cities: CityInfo[]) {
  return localforage.setItem("cities", cities);
}
