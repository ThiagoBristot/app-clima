import React, { useState } from "react";
import Header from "./components/header/header";
import SearchBar from "./components/searchbar/searchbar";
import DashBoard from "./components/dashboard_lateral/dashboard.jsx";
import BarraTempo from "./components/barratempo/barratempo.jsx";
import ClimaHoje from "./components/climahoje/climahoje.jsx";
//import WeatherApp from "./components/chamaApi/chamaapi.jsx";
function App() {
  return (
    <div className="App">
      <Header></Header>
      <DashBoard/>
      <BarraTempo/>
    </div>
  );
}

export default App;
