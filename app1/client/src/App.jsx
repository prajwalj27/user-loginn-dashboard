import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import Login from "./Login";

const App = () => {
  const [token, setToken] = useState("");
  return (
    <div className="App">
      <h1>App 1</h1>

      <Routes>
        <Route path="/" element={<Login token={token} setToken={setToken} />} />
        <Route
          path="/dashboard/*"
          element={<Dashboard token={token} setToken={setToken} />}
        />
      </Routes>
    </div>
  );
};

export default App;
