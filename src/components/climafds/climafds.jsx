import React, { Component } from "react";
import "./climafds.css";

export default class ClimaFds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cidadeNome: "",
      dadosSabado: [],
      dadosDomingo: [],
      erro: null,
    };

    this.token = '8u8Z9w1bPRFM89BhTSQzeYOjxmLnzHNW';
  }

  componentDidMount() {
    if (this.props.cityId) {
      this.fetchWeekendWeather(this.props.cityId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cityId !== this.props.cityId && this.props.cityId) {
      this.fetchWeekendWeather(this.props.cityId);
    }
  }

  fetchWeekendWeather = async (cityId) => {
    try {
      const responseForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${this.token}`
      );
      const data = await responseForecast.json();
  
      if (data.cod !== "200") {
        this.setState({ erro: data.message });
        return;
      }
  
      const previsoes = data.list.map((item) => ({
        data: new Date(item.dt_txt),
        ...item,
      }));
  
      // Filtra previsões até sábado
      const sabado = previsoes.filter((item) => item.data.getDay() === 6);
      const domingo = previsoes.filter((item) => item.data.getDay() === 0);
  
      if (sabado.length === 0) {
        this.setState({ erro: "Previsões para o final de semana não disponíveis." });
        return;
      }
  
      this.setState({
        cidadeNome: data.city.name,
        dadosSabado: sabado,
        dadosDomingo: domingo.length > 0 ? domingo : [],
        erro: domingo.length === 0 ? "Previsão para domingo não disponível." : null,
      });
    } catch (error) {
      console.error("Erro ao buscar os dados do clima", error);
      this.setState({ erro: "Erro ao buscar os dados do clima" });
    }
  };

  calcularPrecipitacaoTotal = (dia) => {
    let totalPrecipitation = 0;
    dia.forEach((entry) => {
      totalPrecipitation += entry.rain?.['3h'] || entry.snow?.['3h'] || 0;
    });
    return totalPrecipitation;
  };

  render() {
    const { dadosSabado, dadosDomingo, cidadeNome, erro } = this.state;

    if (erro) {
      return <p>{erro}</p>;
    }

    if (dadosSabado.length === 0 || dadosDomingo.length === 0) {
      return <p>Carregando dados do clima para o final de semana...</p>;
    }

    // Pegue as informações relevantes para o sábado
    const temperaturaMaxSabado = Math.max(...dadosSabado.map((item) => item.main.temp_max));
    const temperaturaMinSabado = Math.min(...dadosSabado.map((item) => item.main.temp_min));
    const estadoSabado = dadosSabado[0].weather[0].description;
    const dataSabado = new Date(dadosSabado[0].dt_txt).toLocaleDateString();
    const precipitacaoSabado = this.calcularPrecipitacaoTotal(dadosSabado);

    // Pegue as informações relevantes para o domingo
    const temperaturaMaxDomingo = Math.max(...dadosDomingo.map((item) => item.main.temp_max));
    const temperaturaMinDomingo = Math.min(...dadosDomingo.map((item) => item.main.temp_min));
    const estadoDomingo = dadosDomingo[0].weather[0].description;
    const dataDomingo = new Date(dadosDomingo[0].dt_txt).toLocaleDateString();
    const precipitacaoDomingo = this.calcularPrecipitacaoTotal(dadosDomingo);

    return (
      <section id="climafds" className="climafds">
        <div className="climafdsli">
          {/* Previsão de sábado */}
          <div className="climasabado">
            <h2 className="tituloclima">Previsão de sábado, {dataSabado} em {cidadeNome}:</h2>
            <div className="climasabado-imagem">
              <div className="imagemsabado">
                <img
                  src={`http://openweathermap.org/img/wn/${dadosSabado[0].weather[0].icon}@2x.png`}
                  alt={estadoSabado}
                />
              </div>
            </div>
            <div className="climasabado-content">
              <div className="temperatura-max-min">
                <div className="temperatura-max">Máxima: {temperaturaMaxSabado}°C</div>
                <div className="temperatura-min">Mínima: {temperaturaMinSabado}°C</div>
              </div>
              <div className="precipitacao">Precipitação: {precipitacaoSabado.toFixed(2)} mm</div>
            </div>
            <h3 className="estado">{estadoSabado}</h3>
          </div>

          {/* Previsão de domingo */}
          <div className="climadomingo">
            <h2 className="tituloclima">Previsão de domingo, {dataDomingo} em {cidadeNome}:</h2>
            <div className="climadomingo-imagem">
              <div className="imagemdomingo">
                <img
                  src={`http://openweathermap.org/img/wn/${dadosDomingo[0].weather[0].icon}@2x.png`}
                  alt={estadoDomingo}
                />
              </div>
            </div>
            <div className="climadomingo-content">
              <div className="temperatura-max-min">
                <div className="temperatura-max">Máxima: {temperaturaMaxDomingo}°C</div>
                <div className="temperatura-min">Mínima: {temperaturaMinDomingo}°C</div>
              </div>
              <div className="precipitacao">Precipitação: {precipitacaoDomingo.toFixed(2)} mm</div>
            </div>
            <h3 className="estado">{estadoDomingo}</h3>
          </div>
        </div>
      </section>
    );
  }
}
