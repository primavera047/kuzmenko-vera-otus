import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation, Navigation, useSubmit } from "react-router-dom";
import { getCities, createCity } from "../cities";
import { CityInfo } from "../custom-types";
import { useEffect } from "react";

export async function loader({ request }: { request: Request }) {
  const url: URL = new URL(request.url);
  const q: string = url.searchParams.get("q") as string || "";
  const cities: CityInfo[] = await getCities(q) as CityInfo[];
  return { cities, q };
}

export async function action() {
  const city: CityInfo = await createCity() as CityInfo;
  return redirect(`/city/${city.city.id}/edit`);
}

export default function Root(): JSX.Element {
  const { cities, q } = useLoaderData() as { cities: CityInfo[], q: string };
  const navigation: Navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q")!.value = q;
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>React Погода</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search cities"
              placeholder="Поиск"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                submit(event.currentTarget.form);
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">Добавить</button>
          </Form>
        </div>
        <nav>
          {cities.length ? (
            <ul>
              {cities.map((city) => (
                <li key={city.city.id}>
                  <NavLink to={`city/${city.city.id}`} className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : ""}>
                    {city.city.name ? (
                      <>
                        {city.city.name}
                      </>
                    ) : (
                      <i>Без названия</i>
                    )}{" "}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>Список пуст</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}