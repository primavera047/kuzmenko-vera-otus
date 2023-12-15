import { CityInfo } from "../../ts/custom-types";
import NavCityItem from "./nav-city-item";

type NavCityListProps = {
    cityList: CityInfo[]
}

export default function NavCityList(props: NavCityListProps): JSX.Element {
    return (
        <nav>
          {props.cityList.length ? (
            <ul>
              {props.cityList.map((city) => (
                <li key={city.city.id}>
                  <NavCityItem cityInfo={city}></NavCityItem>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>Список пуст</i>
            </p>
          )}
        </nav>
    )
}