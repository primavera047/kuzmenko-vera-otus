import { useRouteError } from "react-router-dom";
import "./css/error-page.css"

type RouteError = {
    statusText?: string,
    message?: string,
}

export default function ErrorPage(): JSX.Element {
  const error: RouteError = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}