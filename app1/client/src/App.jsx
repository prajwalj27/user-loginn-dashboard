import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import Login from "./Login";

const App = () => {
  return (
    <div className="App">
      <h1>App 1</h1>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
