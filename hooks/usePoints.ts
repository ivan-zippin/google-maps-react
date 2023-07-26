import { useState } from "react";
import { LatLngLiteral } from "../types/mapTypes";


const usePoint = () =>{
    const [locations, setLocations] = useState<LatLngLiteral[]>([
        { lat: -34.57, lng: -58.42 },
        { lat: -34.58, lng: -58.46 },
        { lat: -34.60, lng: -58.48 },
        { lat: -34.61, lng: -58.43 },
        { lat: -34.56, lng: -58.42 },
        { lat: -34.57, lng: -58.41 },
        { lat: -34.61, lng: -58.40 },
        { lat: -34.55, lng: -58.49 },
        { lat: -34.57, lng: -58.45 },
        { lat: -34.60, lng: -58.43 },
        { lat: -34.61, lng: -58.41 },
        { lat: -34.61, lng: -58.48 },
        { lat: -34.61, lng: -58.42 },
        { lat: -34.64, lng: -58.41 },
        { lat: -34.67, lng: -58.48 },
        { lat: -34.66, lng: -58.48 },
        { lat: -34.61, lng: -58.52 },
        { lat: -34.67, lng: -58.40 },
        { lat: -34.68, lng: -58.42 },
        { lat: -34.70, lng: -58.47 },
        {lat: -34.60,lng: -58.47}
    ])
    

    return {locations: locations};
}

export default usePoint;