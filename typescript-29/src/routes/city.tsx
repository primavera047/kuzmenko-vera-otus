import { Form, useLoaderData } from "react-router-dom";
import { getCity } from "../ts/cities"
import { CityInfo, CityParams } from "../ts/custom-types";
import { SmallWeatherCard, BigWeatherCard } from "./imports/weather-card";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import "../css/city.css"

const weatherIconCode: Record<number, string> = {
  0: "../sun.png",
  1: "../cloud.png",
  2: "../rain.png",
  3: "../snow.png",
  4: "../thunder.png",
}

export async function loader({ params }: { params: CityParams }) {
  console.log(`Find city with id ${params.cityId}`)
  const city = await getCity(params.cityId) as CityInfo;
  return city;
}

function onSubmitHandler(domEvent: React.FormEvent<HTMLFormElement>) {
  if (!confirm("Подтвердите удаление.")) {    
    domEvent.preventDefault();
  }  
}

export default function City(): JSX.Element {
  const cityInfo: CityInfo = useLoaderData() as CityInfo;
  const currentWeatherIcon = (cityInfo.current) ? weatherIconCode[cityInfo.current!.weather] : weatherIconCode[0]; 

  return (
    <div id="city">
      <div>
        <BigWeatherCard cityInfo={cityInfo} weatherIcon={currentWeatherIcon}></BigWeatherCard>
      </div>
      <div>
        <div id="action-box">
          <Form id="action-form" action="edit">
            <button type="submit">Изменить</button>
          </Form>
          <Form
            id="action-form"            
            method="post"
            action="delete"
            onSubmit={(event) => onSubmitHandler(event)}>
            <button id="delete-button" type="submit">Удалить</button>
          </Form>
        </div>

        {cityInfo.forecast &&
          <div>
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} justifyContent={'space-between'}>
              {
                cityInfo.forecast.map((weather, index) => {
                  return (
                    <div key={index}>                      
                      <SmallWeatherCard weather={weather} weatherIcon={weatherIconCode[weather.weather]}></SmallWeatherCard>
                    </div>
                    
                  )
                })
              }
            </Stack>
          </div>
        }
      </div>
    </div>
  );
}