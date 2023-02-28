import React from "react";
import Select from "react-select";
import { Station } from "./types";

type Props = {
  stations: Station[];
  selectedStation?: Station;
  setSelectedStation: React.Dispatch<React.SetStateAction<Station | undefined>>;
  label: string;
};

const StateManagedSelect: React.FC<Props> = ({
  stations,
  selectedStation,
  setSelectedStation,
  label,
}) => {
  const options = stations.map((station) => ({
    value: station,
    label: station.name,
  }));

  const handleChange = (selectedOption: any) => {
    setSelectedStation(selectedOption.value);
  };

  return (
    <div>
      <label>{label}</label>
      <Select
        value={
          selectedStation
            ? { value: selectedStation, label: selectedStation.name }
            : null
        }
        onChange={handleChange}
        options={options}
        isDisabled={true}
      />
    </div>
  );
};

export default StateManagedSelect;
