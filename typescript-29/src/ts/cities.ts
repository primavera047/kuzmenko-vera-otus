import localforage from "localforage";
import { matchSorter } from "match-sorter";
import { CityInfo, CityItem } from "./custom-types"
import { v4 as uuidv4 } from 'uuid';
import { apiRequest, noInternetApiRequest } from "./external-api";


export async function getCities(q?: string): Promise<CityInfo[]> {
  let cities: CityInfo[] = await localforage.getItem("cities") as CityInfo[];

  if (!cities) cities = [];

  if (q) {
    cities = matchSorter(cities, q, { keys: ['city.name'] });
  }

  return cities.sort((a: CityInfo, b: CityInfo): number => { let result = (a.city.name! > b.city.name!) ? 1 : (a.city.name !== b.city.name) ? -1 : 0; return result; });
}

export async function createCity(): Promise<CityInfo> {
  //let id: number = round(Math.random() * 100000);
  let id: string = uuidv4();
  let city: CityInfo = { city: { id } };
  let cities = await getCities();

  cities.unshift(city);
  await set(cities);

  return city;
}

export async function getCity(id: number): Promise<CityInfo> {
  let cities: CityInfo[] = await localforage.getItem("cities") as CityInfo[];
  let result: CityInfo = cities.find((city: CityInfo): boolean => { return city.city.id.toString() === id.toString() }) as CityInfo;

  result = await apiRequest(result);

  // no Internet
  //result = noInternetApiRequest(result);

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
