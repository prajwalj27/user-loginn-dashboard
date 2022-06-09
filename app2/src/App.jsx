import React, { useState } from "react";
import axios from "axios";

const App = () => {
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
        "http://localhost:8080/login",
        formData
      );
      console.log(response.data);
      if (response.data.message === "Login Successful") {
        console.log("Let's navigate to the dashboard");
        // navigate("/dashboard");
        window.open("http://localhost:3000/dashboard", '_blank').focus();
      }
    } catch (err) {
      alert(err.response.data.message )
      console.log(err.response.data);
    }
  };

  return (
    <div className="App">
      <h1>App 2</h1>
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

export default App;
