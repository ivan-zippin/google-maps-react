import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

type PlacesProps = {
  setOrigin: (position: google.maps.LatLngLiteral) => void;
  setDestination: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setOrigin: setOrigin, setDestination: setDestination}: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const {
    ready: readyDestination,
    value: valueDestination,
    setValue: setValueDestination,
    suggestions: { status: statusDestination, data: dataDestination },
    clearSuggestions: clearSuggestionsDestination,
  } = usePlacesAutocomplete();

  //TO DO: VER SI PODEMOS COMPONENTIZAR LOS ""COMPONENTES"" DE INPUTS, POR QUE SE REPITEN

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    //transpila la direccion en geoCordsResult
    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setOrigin({ lat, lng });
  };

  const handleSelectDestination = async (val: string) => {
    setValueDestination(val, false);
    clearSuggestionsDestination();

    //transpila la direccion en geoCordsResult
    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setDestination({ lat, lng });
  }

  return (
    <div>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search origin address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>

      <Combobox onSelect={handleSelectDestination}>
        <ComboboxInput
          value={valueDestination}
          onChange={(e) => setValueDestination(e.target.value)}
          disabled={!readyDestination}
          className="combobox-input"
          placeholder="Search destination address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {statusDestination === "OK" &&
              dataDestination.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
