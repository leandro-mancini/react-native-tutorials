export type Destination = {
  description: string;
  placeId: string;
  location?: { latitude: number; longitude: number };
};

export type RootStackParamList = {
  Welcome: undefined;
  Home: { destination?: Destination } | undefined;
  Search: undefined;
  SignUp?: undefined;
};
