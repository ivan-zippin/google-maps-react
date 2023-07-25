import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  Polygon,
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
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  const [path, setPath] = useState([
    { lat: -34.57, lng: -58.42 },
    { lat: -34.58, lng: -58.46 },
    { lat: -34.60, lng: -58.48 },
    { lat: -34.60, lng: -58.43 }
  ]);
  
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: true,
      zoomControl: true
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

    const onEdit = useCallback(() => {
      if (polygonRef.current) {
        const nextPath = polygonRef.current
          .getPath()
          .getArray()
          .map(latLng => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
        setPath(nextPath);
      }
    }, [setPath]);
  
    // Bind refs to current Polygon and listeners
    const onLoadPoly = useCallback(
      polygon => {
        polygonRef.current = polygon;
        const path = polygon.getPath();
        listenersRef.current.push(
          path.addListener("set_at", onEdit),
          path.addListener("insert_at", onEdit),
          path.addListener("remove_at", onEdit)
        );
      },
      [onEdit]
    );
  
    // Clean up refs
    const onUnmount = useCallback(() => {
      listenersRef.current.forEach(lis => lis.remove());
      polygonRef.current = null;
    }, []);


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
          <Polygon
            // Make the Polygon editable / draggable
            editable
            draggable
            path={path}
            // Event used when manipulating and adding points
            onMouseUp={onEdit}
            // Event used when dragging the whole Polygon
            onDragEnd={onEdit}
            onLoad={onLoadPoly}
            onUnmount={onUnmount}
          />
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
