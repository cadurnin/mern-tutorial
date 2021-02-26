import React from "react";
import { useParams } from 'react-router-dom';

import PlaceList from "../components/PlaceList";


const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Very famous sky scraper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Empire_State_Building_Entrance_decoration_%286046008895%29.jpg/1280px-Empire_State_Building_Entrance_decoration_%286046008895%29.jpg",
    address: "1234 Fake Street",
    location: {
      lat: 40.74858678282475,
      lng: -73.98566440202913,
    },
    creator: "u1",
  }, 
  {
    id: "p2",
    title: "Emp State Building",
    description: "Very famous sky scraper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Empire_State_Building_Entrance_decoration_%286046008895%29.jpg/1280px-Empire_State_Building_Entrance_decoration_%286046008895%29.jpg",
    address: "1234 Fake Street",
    location: {
      lat: 40.74858678282475,
      lng: -73.98566440202913,
    },
    creator: "u2",
  }
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
