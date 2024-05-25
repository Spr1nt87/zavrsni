"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from "react-leaflet";

const Map = () => {
  const [ruteInfo, setRuteInfo] = useState([]);
  const [staniceCord, setStaniceCord] = useState([0.0, 0.0]);
  const [staniceRender, setStaniceRender] = useState(false);
  const [routePoly, setRoutePoly] = useState([0.0, 0.0]);
  const [staniceInfo, setStaniceInfo] = useState([]);

  const getRute = async () => {
    const response = await fetch("http://localhost:8000/Info");
    const rute = await response.json();
    setRuteInfo(rute);
  };

  const handleGlavnaClick = (routeID) => {
    const route = ruteInfo
      .flatMap((info) => info.Rute)
      .find((ruta) => ruta.ID === routeID);
    if (route) {
      const coordinates = route.Stanice.map((stanica) => stanica.Cord);
      const staniceInfo = route.Stanice.map((stanica) => stanica.Ime);
      const rutaPoly = route.geometry.coordinates;
      setStaniceInfo(staniceInfo);
      setStaniceCord(coordinates);
      setRoutePoly(rutaPoly);
    }
    setStaniceRender(true);
  };

  useEffect(() => {
    getRute();
  }, []);

  return (
    <div>
      <MapContainer center={[43.84182354227483, 18.375962222168667]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ruteInfo.map((glavneStanice) => {
          return (
            <div>
              <Marker position={glavneStanice.Cord}>
                <Popup>
                  {glavneStanice.Rute.map((ruta) => {
                    return (
                      <button onClick={() => handleGlavnaClick(ruta.ID)}>
                        {ruta.Ime}
                      </button>
                    );
                  })}
                </Popup>
              </Marker>
            </div>
          );
        })}
        {staniceRender ? (
          <div>
            {staniceCord.map((stanica, index) => {
              const stanicaName = staniceInfo[index];
              console.log(stanica);
              return (
                <div>
                  <Marker key={index} position={[stanica[0], stanica[1]]}>
                    <Popup>{stanicaName}</Popup>
                  </Marker>
                </div>
              );
            })}
          </div>
        ) : null}
        <Polyline positions={[routePoly]} />
      </MapContainer>
    </div>
  );
};

export default Map;
