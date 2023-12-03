import { redirect } from "react-router-dom";
import { CityParams } from "../custom-types";
import { deleteCity } from "../cities";

export async function action({ params }: { params: CityParams }) {
    await deleteCity(params.cityId);
    return redirect("/");
}