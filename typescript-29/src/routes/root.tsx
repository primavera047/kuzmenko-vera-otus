import { Outlet, useLoaderData, Form, redirect, useNavigation, Navigation, useSubmit } from "react-router-dom";
import { getCities, createCity } from "../ts/cities";
import { CityInfo } from "../ts/custom-types";
import NavCityList from "./imports/nav-city-list";
import CitySearch from "./imports/city-search";
import "../css/root.css"

export async function loader({ request }: { request: Request }) {
  const url: URL = new URL(request.url);
  const searchQuery: string = url.searchParams.get("query") as string || "";
  const cities: CityInfo[] = await getCities(searchQuery);
  return { cities, searchQuery };
}

export async function action() {
  const city: CityInfo = await createCity() as CityInfo;
  return redirect(`/city/${city.city.id}/edit`);
}

export default function Root(): JSX.Element {
  const { cities, searchQuery } = useLoaderData() as { cities: CityInfo[], searchQuery: string };
  const navigation: Navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("query");  

  return (
    <>
      <div id="sidebar">
        <h1>React Погода</h1>
        <div>
          <CitySearch query={searchQuery} searching={searching!} submitFn={submit}></CitySearch>
          <Form method="post">
            <button type="submit">Добавить</button>
          </Form>
        </div>
        <NavCityList cityList={cities}></NavCityList>        
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}