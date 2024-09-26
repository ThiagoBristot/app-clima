import React, { Component } from "react";
import Chart from "chart.js/auto";
import "./climahoje.css";

export default class ClimaHoje extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherData: null, // Estado para armazenar os dados do clima
      error: null, // Estado para armazenar erros
    };
    this.token = '4d0054ae2de00b7cc66c50e704c82d2f'; // Token da API da OpenWeather
  }

  componentDidMount() {
    if (this.props.cityId) {
      this.fetchWeatherData(this.props.cityId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cityId !== this.props.cityId && this.props.cityId) {
      this.fetchWeatherData(this.props.cityId);
    }
  }

  fetchWeatherData = async (cityId) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${this.token}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        console.error("Erro ao buscar os dados do clima:", data.message);
        this.setState({ error: data.message });
      } else {
        this.setState({ weatherData: data });
        console.log(data);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do clima", error);
      this.setState({ error: "Erro ao buscar os dados do clima" });
    }
  };

  render() {
    const { weatherData, error } = this.state;

    if (error) {
      return <p className="erro">{error}</p>;
    }

    // Verifica se os dados do clima estão disponíveis
    if (!weatherData) {
      return <p className="loading">Carregando dados do clima...</p>;
    }

    // Obtém o ícone do clima a partir da resposta da API
    const iconCode = weatherData.weather[0].icon; // Código do ícone fornecido pela API
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    return (
      <section id="climahoje" className="climahoje">
        <h2 className="tituloclima">Clima em {weatherData.name} agora:</h2>
        
        {/* Exibe o ícone do clima */}
        <div className="climahoje-imagem">
          <img src={iconUrl} alt="Ícone do Clima" className="imagem" />
        </div>
        
        {/* Exibe os dados do clima */}
        <div className="climahoje-content">
          <div className="temperaturahoje">{weatherData.main.temp}°C</div>
          <div className="feelslikehoje">Sensação térmica: {weatherData.main.feels_like}°C</div>
        </div>
      </section>
    );
  }
}
