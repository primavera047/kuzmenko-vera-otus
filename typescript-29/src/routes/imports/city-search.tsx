import { Form, SubmitFunction } from "react-router-dom";

type CitySearchProps = {
    searching: boolean,
    query: string,
    submitFn: SubmitFunction,
}

export default function CitySearch(props: CitySearchProps): JSX.Element {
    return (
        <Form id="search-form" role="search">
            <input
              id="query"
              className={props.searching ? "loading" : ""}
              aria-label="Search cities"
              placeholder="Поиск"
              type="search"
              name="query"
              defaultValue={props.query}
              onChange={(event) => {
                props.submitFn(event.currentTarget.form);
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!props.searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
    )
}