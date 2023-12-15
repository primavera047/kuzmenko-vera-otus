import { redirect } from "react-router-dom";
import { CityParams } from "../ts/custom-types";
import { deleteCity } from "../ts/cities";

export async function action({ params }: { params: CityParams }) {
    await deleteCity(params.cityId);
    return redirect("/");
}