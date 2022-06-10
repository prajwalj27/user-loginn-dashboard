import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({token, setToken}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const onChange = (value) => {
    setFormData((prev) => {
      return { ...prev, ...value };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/login1",
        formData
      );
      console.log(response.data);
      setToken(response.data.token)
      if (response.data.message === "Login Successful") {
        console.log("Let's navigate to the dashboard");
        navigate(`/dashboard/?token=${response.data.token}`);
      }
    } catch (err) {
      // alert(err.response.data.message);
      console.log(err.response.data);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          placeholder="Enter Username"
          value={formData.username}
          onChange={(e) => onChange({ username: e.target.value })}
        />

        <label htmlFor="password">Password: </label>
        <input
          type="text"
          placeholder="Enter Password"
          value={formData.password}
          onChange={(e) => onChange({ password: e.target.value })}
        />

        <br />
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;
