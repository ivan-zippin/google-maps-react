import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { centerPosition } from "../utils/centerPosition";
import { LatLngLiteral, MapOptions } from "../types/mapTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { configMapOptions } from "../utils/configMapOption";
import usePoint from "../hooks/usePoints";
import usePolygons from "../hooks/usePolygons";
import { isPointInPolygon } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";
import path from "path";

export const Map2 = () =>{
    const center = useMemo<LatLngLiteral>(() => (centerPosition),[]);
    const options = useMemo<MapOptions>(() => (configMapOptions),[]);

    const [map, setMap] = useState<google.maps.Map | null>(null); 
    const mapRef = useRef<GoogleMap>();
    const onLoad = useCallback((map) => (mapRef.current = map), []);
    
    const { locations } = usePoint();
    //const { polygons, setPolygons } = usePolygons();
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);

    //---LOGICA DE LOS MARCADORES
    type polygonsListProps = [google.maps.LatLngLiteral[]];
    const [polygonList, setPolygonList] = useState<polygonsListProps>([]);

    const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
    const [polygonCreated, setPolygonCreated] = useState<boolean>(false);
    const [polygonPath, setPolygonPath] = useState<google.maps.LatLngLiteral[]>([]);
  
    console.log("polPath: ", polygonPath);

    const resetPolyCreated = () =>{
      setMarkers([]);
      setPolygonCreated(false);
      setPolygonPath([]);
    }

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
      if (markers.length === 0 && !polygonCreated) {
        const firstPoint: google.maps.LatLngLiteral = {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng()
        };
        setPolygonPath([firstPoint]);
        setPolygonCreated(true);
      } else {
        const newMarker: google.maps.LatLngLiteral = {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng()
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        setPolygonPath((prevPath) => [...prevPath, newMarker]);
      }
    };

    //---LOGICA DE LOS POLIGONOS
    //TO DO: PROBABLEMENTE HAYA ROTO LA LOGICA DE LOS POLIGONOS, HACIENDO EL CAMBIO EN EL
    //MAP REF Y SETMAPREF

    const isPointInsidePolygon = (point: GeolibInputCoordinates, polygon: GeolibInputCoordinates[]) => {
      if (!polygon || polygon.length === 0) return false; // Si no hay polígonos, retorna falso
  
      return isPointInPolygon(point, polygon);
    };

    const createColoredMarkerIcon = (color: string) => ({
      url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      scaledSize: new window.google.maps.Size(30, 30),
    });

    const setIconWithMarker = (point: GeolibInputCoordinates, polygon: polygonsListProps) =>{

      //aca podemos pasarle la lista de poligonos y ver si alguno de esos poligonos matchea con sus coordenadas
      //de ser asi, retornamos el color asociado a ese poligono
      //en el futuro ademas de guardar coordenadas tenemos que guardar un ID y un color asociado
      //que tambien sera mostrado en la tabla

      for(let i = 0; i < polygon.length; i++){
        const converGeoLibPolys: GeolibInputCoordinates[] = polygon[i].map((p) =>{
          return { lat: p.lat, lng: p.lng }
        })

        if(isPointInsidePolygon(point, converGeoLibPolys)){
          return createColoredMarkerIcon("green");
        }

      }
      return createColoredMarkerIcon("red");
    }

    /*
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
  
    const onUnmount = useCallback(() => {
      listenersRef.current.forEach(lis => lis.remove());
      polygonRef.current = null;
    }, []);
    */

    const onHandleSavePolygon = useCallback(() =>{
      const auxPolyList = polygonList;
      auxPolyList?.push(polygonPath);
      setPolygonList(auxPolyList);
      resetPolyCreated();
    },[polygonPath]);

    console.log('polygon')

    useEffect(()=>{
      console.log('polygonLIST: ', polygonList);
    })

    return (
        <div className="container">
          <div className="controls">
            <h1>Tareas</h1>
          </div>
          <div className="map">
            <div className="btn-containers">
              <button className="btn-asignacion-masiva">
                Asignacion masiva
              </button>
              {
              markers.length >=2  && 
                <button className="btn-guardar-poligono" onClick={onHandleSavePolygon}>
                  Guardar poligono
                </button>
              }
            </div>
            <GoogleMap
              zoom={10}
              center={center}
              mapContainerClassName="map-container"
              options={options}
              onLoad={(map) => setMap(map)}
              onClick={handleMapClick}
            >

              {markers.map((marker, index) => (
                <Marker key={index} position={marker} />
              ))}
              { 
              //UNA VEZ QUE GUARDAMOS EL POLIGONO, SETEAMOS EL POLIGONO AUXILIAR EN NULO O VALOR POR DEFECTO
              //Y REENDERIZAMOS LA LISTA DE POLIGONOS
               }
              {polygonPath.length >= 3 && ( // Dibujamos el polígono si tiene al menos 3 puntos
                <Polygon
                  editable
                  draggable
                  path={polygonPath}
                  onMouseUp={() => {}}
                  onDragEnd={() => {}}
                />
              )}

              {
                polygonList.length > 0 && polygonList.map((listPolys)=>{
                  return(
                    <Polygon 
                      path={listPolys}
                    />
                  )
                })
              }
              {
                //Poligono de ejemplo, editable, drageable
              }
              {/*
              {
                polygons && 
                  <Polygon
                    editable
                    draggable
                    path={polygons}
                    onMouseUp={onEdit}
                    onDragEnd={onEdit}
                    onLoad={onLoadPoly}
                    onUnmount={onUnmount}
                />
              }
            */}
              {
                locations && locations.map((location) => {
                    return (
                        <Marker 
                            position={location}
                            icon={
                              setIconWithMarker(location, polygonList)
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
