import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import { centerPosition } from "../utils/centerPosition";
import { LatLngLiteral, MapOptions } from "../types/mapTypes";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { configMapOptions } from "../utils/configMapOption";
import usePoint from "../hooks/usePoints";
import usePolygons from "../hooks/usePolygons";
import { isPointInPolygon } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";

export const Map2 = () =>{
    const center = useMemo<LatLngLiteral>(() => (centerPosition),[]);
    const options = useMemo<MapOptions>(() => (configMapOptions),[]);
    const mapRef = useRef<GoogleMap>();
    const onLoad = useCallback((map) => (mapRef.current = map), []);
    const { locations } = usePoint();
    const { polygons, setPolygons } = usePolygons();
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);

    const isPointInsidePolygon = (point: GeolibInputCoordinates, polygon: GeolibInputCoordinates[]) => {
      if (!polygons || polygons.length === 0) return false; // Si no hay polígonos, retorna falso
  
      return isPointInPolygon(point, polygons);
    };

    const createColoredMarkerIcon = (color: string) => ({
      url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      scaledSize: new window.google.maps.Size(30, 30),
    });

    const setIconWithMarker = (point: GeolibInputCoordinates, polygon: GeolibInputCoordinates[]) =>{

      let color = isPointInsidePolygon(point, polygon) ? "green" : "red";
      
      return createColoredMarkerIcon(color);
    }

    const onEdit = useCallback(() => {
      if (polygonRef.current) {
        const nextPath = polygonRef.current
          .getPath()
          .getArray()
          .map(latLng => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
          setPolygons(nextPath);
      }
    }, [setPolygons]);
  
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

    useEffect(() => {
      const point: GeolibInputCoordinates = {
        lat: -34.60,
        lng: -58.47
      } 

      const polygon: GeolibInputCoordinates[] = [
        { lat: -34.57, lng: -58.42 },
        { lat: -34.58, lng: -58.46 },
        { lat: -34.60, lng: -58.48 },
        { lat: -34.60, lng: -58.43 }
      ]

      const test = isPointInsidePolygon(point, polygon)
      console.log('isInside: ', test);

    },[]);

    useEffect(()=>{
      //console.
    },[])

    return (
        <div className="container">
          <div className="controls">
            <h1>Tareas</h1>
          </div>
          <div className="map">
            <div className="btn-asignacion-masiva">
              Asignacion masiva
            </div>
            <GoogleMap
              zoom={10}
              center={center}
              mapContainerClassName="map-container"
              options={options}
              onLoad={onLoad}
            >
              {
                polygons && 
                  <Polygon
                    // Make the Polygon editable / draggable
                    editable
                    draggable
                    path={polygons}
                    // Event used when manipulating and adding points
                    onMouseUp={onEdit}
                    // Event used when dragging the whole Polygon
                    onDragEnd={onEdit}
                    onLoad={onLoadPoly}
                    onUnmount={onUnmount}
                />
              }
              {
                  locations && locations.map((location) => {
                      return (
                          <Marker 
                              position={location}
                              icon={
                                setIconWithMarker(location, polygons)
                              }                    
                          />
                      )
                  })                    
              }
            </GoogleMap>
          </div>
        </div>
    );
}
