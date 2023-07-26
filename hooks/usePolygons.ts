import { useState } from "react";

const usePolygons = () =>{
    const [polygons, setPolygons] = useState([
        { lat: -34.57, lng: -58.42 },
        { lat: -34.58, lng: -58.46 },
        { lat: -34.60, lng: -58.48 },
        { lat: -34.60, lng: -58.43 }
    ]);

    return { polygons, setPolygons }
}

export default usePolygons;