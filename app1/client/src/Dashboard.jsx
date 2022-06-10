import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const getMessage = async () => {
    const queryData = searchParams.get("token");
    setToken(queryData);
    // if (queryData) {
    //   const res = await axios.get("http://localhost:8080/secret-route", {
    //     headers: { authorization: searchParams.get("token") },
    //   });
    //   console.log(res.data.message);
    //   if (res.data.message) {
    //     setMessage(res.data.message);
    //   }
    // }
    const res = await axios.get("http://localhost:8080/secret-route", {
        headers: { authorization: searchParams.get("token") },
      });
      console.log(res.data.message);
      if (res.data.message) {
        setMessage(res.data.message);
      }
  };

  return (
    <div>
      <h2>Here is the Dashboard</h2>

      <button onClick={getMessage}>Verify User</button>
      {message === "" ? (
        <></>
      ) : message === "verified" ? (
        <>
          <p style={{ color: "green" }}>
            You are authorized to click this button
          </p>
          <p>
            Your Token: <br /> `${token}`
          </p>
        </>
      ) : (
        <p>You are not authorized to click this button</p>
      )}
    </div>
  );
};

export default Dashboard;
