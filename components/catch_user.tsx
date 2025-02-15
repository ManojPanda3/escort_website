"use client";
import React, { useEffect, useState } from "react";

const userKey = "user";

const catchUser = (user) => {
  useEffect(() => {
    if (user) {
      localStorage.setItem(userKey, JSON.stringify(user));
    }
  }, [user]);
};

const CatchUser = ({ user }) => {
  catchUser(user);
  return <></>;
};

export const useUser = (user = null) => {
  const [userData, setUserData] = useState(user);

  const setUser = (user) => {
    setUserData(user);
    catchUser(user);
  };

  // Check localStorage for user data and update the state accordingly
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(userKey));

    // If no stored data and `user` is provided, set the user in the state
    if (storedData === null && user !== null) {
      setUser(user);
    } else if (user === null && storedData !== null) {
      setUserData(storedData);
    }
  }, [user]);

  return [userData, setUser];
};

export const deleteUser = () => {
  useEffect(() => {
    localStorage.removeItem(userKey);
  }, []);
};

export default CatchUser;

