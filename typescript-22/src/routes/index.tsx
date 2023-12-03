export default function Index(): JSX.Element {
    return (
      <p id="zero-state">
        Добавьте или выберите город из списка
        <br />
        Прогноз погоды предоставлен{" "}
        <a href="https://openweathermap.org/api">
          openweathermap.org
        </a>
        .
      </p>
    );
  }