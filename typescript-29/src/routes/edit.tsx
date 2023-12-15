import { Form, useLoaderData, redirect, useNavigate, NavigateFunction } from "react-router-dom";
import { updateCity } from "../ts/cities";
import { CityInfo, CityParams } from "../ts/custom-types"
import "../css/edit.css"

export async function action({ request, params }: { request: Request, params: CityParams }) {
  const formData = await request.formData();
  const updates: any = Object.fromEntries(formData);
  await updateCity(params.cityId, updates);
  return redirect(`/city/${params.cityId}`);
}

export default function EditCity() {
  const city: CityInfo = useLoaderData() as CityInfo;
  const navigate: NavigateFunction = useNavigate();

  return (
    <Form method="post" id="city-form">
      <label>
        <span>Название</span>
        <input
          placeholder="Название"
          aria-label="name"
          type="text"
          name="name"
          defaultValue={(city.city.name) ? city.city.name : ''}
        />
      </label>
      <label>
        <span>Долгота</span>
        <input
          placeholder="Долгота"
          aria-label="lon"
          type="text"
          name="lon"
          defaultValue={(city.city.lon) ? city.city.lon : ''}
        />
      </label>
      <label>
        <span>Широта</span>
        <input
          placeholder="Широта"
          aria-label="lat"
          type="text"
          name="lat"
          defaultValue={(city.city.lat) ? city.city.lat : ''}
        />
      </label>
      <p>
        <button type="submit" >Сохранить</button>
        <button type="button" onClick={() => { navigate(-1) }} >Отменить</button>
      </p>
    </Form>
  );
}