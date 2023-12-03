import { Form, useLoaderData } from "react-router-dom";
import { getCity, getFullDate, getShortDate } from "../cities"
import { CityInfo, CityParams } from "../custom-types";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

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

export default function City(): JSX.Element {
  const cityInfo: CityInfo = useLoaderData() as CityInfo;
  const currentWeatherIcon = (cityInfo.current) ? weatherIconCode[cityInfo.current!.weather] : weatherIconCode[0];

  return (
    <div id="contact">
      <div>
        <p style={{ fontSize: '50px', marginLeft: '20px' }}>
          {cityInfo.city.name ? (
            <>
              {cityInfo.city.name}
            </>
          ) : (
            <i>Без названия</i>
          )}{" "}
        </p>
        {cityInfo.current && <>
          {cityInfo.current.date && <p style={{ fontSize: '25px', marginLeft: '20px' }}>{getFullDate(cityInfo.current.date)}</p>}
          <img
            style={{ background: 'white', width: '100px', height: '100px', display: 'inline-block', }}
            key={currentWeatherIcon}
            src={currentWeatherIcon}
          />
          {cityInfo.current.temp && (
            <p style={{ display: 'inline-block', fontSize: '50px', marginLeft: '20px' }}>
              {((cityInfo.current.temp > 0) ? `+${cityInfo.current.temp}` : cityInfo.current.temp.toString())}
            </p>
          )}
        </>
        }
      </div>
      <div>
        <div style={{ marginBottom: '40px' }}>
          <Form action="edit" style={{ display: 'inline-block', marginLeft: '20px' }}>
            <button type="submit">Изменить</button>
          </Form>
          <Form
            style={{ display: 'inline-block', marginLeft: '20px' }}
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Подтвердите удаление."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" style={{ color: 'red' }}>Удалить</button>
          </Form>
        </div>

        {cityInfo.forecast &&
          <div>
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} justifyContent={'space-between'}>
              {
                cityInfo.forecast.map((weather, index) => {
                  return (
                    <div key={index}>
                      <div>
                        <h2>{getShortDate(weather.date!)}</h2>
                      </div>
                      <div>
                        <img src={weatherIconCode[weather.weather]} style={{ width: '40px', height: '40px', background: 'white', display: 'inline-block', }}></img>
                        <p style={{ display: 'inline-block', fontSize: '25px', marginLeft: '20px' }}>{((weather.temp > 0) ? `+${weather.temp}` : weather.temp.toString())}</p>
                      </div>
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