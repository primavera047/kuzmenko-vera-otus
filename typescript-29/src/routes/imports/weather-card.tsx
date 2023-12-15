import { CityInfo, Weather } from "../../ts/custom-types"
import { getFullDate, getShortDate } from "../../ts/date-processor"
import "../../css/weather-card.css"

type BigWeatherCardProps = {
  cityInfo: CityInfo,
  weatherIcon: string,
}

export function BigWeatherCard(props: BigWeatherCardProps): JSX.Element {
  return (
    <div id="big-card">
      <p>
        {props.cityInfo.city.name ? (
          <>
            {props.cityInfo.city.name}
          </>
        ) : (
          <i>Без названия</i>
        )}{" "}
      </p>
      {props.cityInfo.current && <>
        {props.cityInfo.current.date && <p>{getFullDate(props.cityInfo.current.date)}</p>}
        <img
          key={props.weatherIcon}
          src={props.weatherIcon}
        />
        {props.cityInfo.current.temp && (
          <p>
            {((props.cityInfo.current.temp > 0) ? `+${props.cityInfo.current.temp}` : props.cityInfo.current.temp.toString())}
          </p>
        )}
      </>
      }
    </div>
  )
}

type SmallWeatherCardProps = {
  weather: Weather,
  weatherIcon: string,
}

export function SmallWeatherCard(props: SmallWeatherCardProps) {
  return (
    <div id="small-card">
      <div>
        <h2>{getShortDate(props.weather.date!)}</h2>
      </div>
      <div>
        <img src={props.weatherIcon}></img>
        <p>{((props.weather.temp > 0) ? `+${props.weather.temp}` : props.weather.temp.toString())}</p>
      </div>
    </div>
  )
}