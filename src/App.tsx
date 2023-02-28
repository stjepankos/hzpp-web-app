import { useEffect, useState } from "react";
import StationSelect from "./StationSelect";
import { Station, StationResponse, Train } from "./types";

const url = "https://hzpp-api.onrender.com";

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [startStation, setStartStation] = useState<Station>();
  const [destStation, setDestStation] = useState<Station>();
  const [trains, setTrains] = useState<Date[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchStations() {
      const response = await fetch(url + "/stations");
      const data: StationResponse = await response.json();
      setStations(data.stations);
    }
    fetchStations();
  }, []);

  useEffect(() => {
    const mraclinStation = stations.find(
      (station) => station.name === "Mraclin"
    );
    const zagrebStation = stations.find(
      (station) => station.name === "Zagreb Glavni kol."
    );

    if (mraclinStation && zagrebStation) {
      setStartStation(mraclinStation);
      setDestStation(zagrebStation);
    }
  }, [stations]);

  useEffect(() => {
    async function fetchTrains() {
      if (!startStation || !destStation) return;

      const formattedDate = getFormattedDate(date);
      const response = await fetch(
        `${url}/trains?start=${startStation.id}&destination=${destStation.id}&departure_date=${formattedDate}`
      );
      const data: Train[] = await response.json();
      const trains: Date[] = data.map((train) => {
        const [hours, minutes] = train.time_departure.split(":");
        const date = new Date();
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));
        return date;
      });
      setTrains(trains);
    }
    fetchTrains();
  }, [startStation, destStation, date]);

  const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const handleSwitchStations = () => {
    setStartStation(destStation);
    setDestStation(startStation);
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div>
      <h1>Train App</h1>
      <div>
        <StationSelect
          stations={stations}
          selectedStation={startStation}
          setSelectedStation={setStartStation}
          label="Start"
        />
      </div>
      <div>
        <button onClick={handleSwitchStations}>SWITCH</button>
      </div>
      <div>
        <StationSelect
          stations={stations}
          selectedStation={destStation}
          setSelectedStation={setDestStation}
          label="End"
        />
      </div>
      <h1>Train Departure Times</h1>
      <h2>Date: {date.toLocaleDateString()}</h2>
      <h2>Time: {date.toLocaleTimeString()}</h2>
      <ul>
        {trains
          .filter((train) => train > date)
          .map((train) => (
            <li key={train.getTime()}>{formatTime(train)}</li>
          ))}
      </ul>
    </div>
  );
}

export default App;
