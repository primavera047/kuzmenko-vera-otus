import { CityInfo } from "../../ts/custom-types";
import { NavLink } from "react-router-dom";

type NavCityItemProps = {
    cityInfo: CityInfo
}

export default function NavCityItem(props: NavCityItemProps): JSX.Element {
    return (
        <NavLink to={`city/${props.cityInfo.city.id}`} className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : ""}>
            {props.cityInfo.city.name ? (
                <>
                    {props.cityInfo.city.name}
                </>
            ) : (
                <i>Без названия</i>
            )}{" "}
        </NavLink>
    )
}