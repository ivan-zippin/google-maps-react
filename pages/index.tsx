import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";
import { Map2 } from "../components2/Map2";

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places","geometry"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map2 />;
}
