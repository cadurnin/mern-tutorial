import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Max Zorin",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/T%C3%B5us_83.jpg/1920px-T%C3%B5us_83.jpg",
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
