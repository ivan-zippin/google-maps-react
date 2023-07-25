type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  return (
    <div>
      <p>
        <div>
        <span className="highlight">{leg.distance.text}</span> Del origen al destino
        </div>
        <span className="highlight">{leg.duration.text}</span>.
      </p>
    </div>
  );
}
