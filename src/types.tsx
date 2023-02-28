export type Station = {
  id: number;
  name: string;
};

export type StationResponse = {
  stations: Station[];
};

export type TrainResponse = {
  trains: Train[];
};

export type Train = {
  time_departure: string;
};
