import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [origin, setOrigin] = useState<LatLngLiteral>();
  const [destination, setDestination] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat:-34.84, lng: -58.49 }),
    []
  );
  
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: true,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  const fetchDirections = (house: LatLngLiteral) => {
    if (!origin) return;

    const service = new google.maps.DirectionsService();

    //Construye la ruta (origen-destino) y lo setea en directions
    service.route(
      {
        origin: house,
        destination: origin,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  /*
    PLACES: Componente que renderiza los inputs y setea las coordenas de origen y destino
    Tambien hace un zoom en la posicion de origen
   */


  return (
    <div className="container">
      <div className="controls">
        <h1>Origen - Destino</h1>
        <Places
          setOrigin={(position) => {
            setOrigin(position);
            mapRef.current?.panTo(position);
          }}
          setDestination={(position) => {
            setDestination(position);
          }}
        />
        {!origin && <p>Seleccione su origen y su destino</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}
          {origin && (
            <>
              <Marker
                position={origin}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />
              {
                destination && (
                  <Marker 
                    key={destination.lat}
                    position={destination}
                    onClick={() => {
                      fetchDirections(destination);
                  }}
                  />
                )
              }
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
