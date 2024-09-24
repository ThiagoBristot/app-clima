import React, { useState } from "react";
import Header from "./components/header/header";
import DashBoard from "./components/dashboard_lateral/dashboard.jsx";
import BarraTempo from "./components/barratempo/barratempo.jsx";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <BarraTempo/>
    </div>
  );
}

export default App;
