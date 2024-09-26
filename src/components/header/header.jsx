import React, { Component } from "react";
import { FiSun } from "react-icons/fi";
import { FaRegMoon } from "react-icons/fa";
import "./header.css";
import DashBoard from "../dashboard_lateral/dashboard";
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false, // Corrigido o nome do estado para controlar o modo escuro
    };
  }

  // Função para alternar entre modo claro e escuro
  toggleDarkmode = () => {
    this.setState(prevState => ({ darkMode: !prevState.darkMode }), () => {
      document.body.style.backgroundColor = this.state.darkMode ? "#021526" : "#7FA1C3";
      document.body.style.color = this.state.darkMode ? "#D1D1D1" : "#000";
      document.getElementById("header").style.backgroundColor = this.state.darkMode ? "#03346E" : "#6482AD"
      document.getElementById("submit").style.color = this.state.darkMode ? "#D1D1D1" : "#000";
    });

  };

  render() {
    return (
        <header id="header">
            <h1 className="nomeapp">PrincipClima</h1>
            <button
                style={{backgroundColor: 'transparent'}}
                className="settings"
                onClick={this.toggleDarkmode}>
                {this.state.darkMode ? <FiSun style={{fontSize: 'larger', backgroundColor: '#1E1E1E', color: '#FFF'}}/> : <FaRegMoon />}
            </button>
        </header>

    );
  }
}