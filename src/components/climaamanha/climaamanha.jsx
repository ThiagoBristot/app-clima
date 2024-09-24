import React, { Component } from "react";
import Chart from "chart.js/auto";
import "./climaamanha.css";

export default class ClimaAmanha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
      showTempChart: true,
    };

    this.token = '4d0054ae2de00b7cc66c50e704c82d2f';
    this.tempChartRef = React.createRef();
    this.precipitationChartRef = React.createRef();
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
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${this.token}&units=metric`
      );
      const data = await response.json();
  
      console.log('Dados da API:', data);
  
      if (data.cod !== "200") {
        console.error("Erro ao buscar os dados do clima:", data.message);
        this.setState({ error: data.message });
      } else {
        let totalPrecipitation = 0;
        const temperatures = [];
        const precipitationData = [];
        const timeLabels = [];
        console.log(data.list[0].weather[0])
        const weathericon = data.list[0].weather[0].icon;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // Define "amanhã"
        const tomorrowDateStr = tomorrow.toISOString().split('T')[0]; // Obtém a string no formato YYYY-MM-DD
  
        data.list.forEach((entry) => {
          // Verifica se a data da entrada é "amanhã"
          if (entry.dt_txt.startsWith(tomorrowDateStr)) {
            totalPrecipitation += entry.rain?.['3h'] || entry.snow?.['3h'] || 0;
            temperatures.push(entry.main.temp);
            precipitationData.push(entry.rain?.['3h'] || entry.snow?.['3h'] || 0);
            timeLabels.push(entry.dt_txt.substring(11, 16)); // Pega apenas 'hh:mm'
          }
        });
  
        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);
  
        this.setState({
          data: {
            cityName: data.city.name,
            maxTemp,
            minTemp,
            totalPrecipitation,
            temperatures,
            precipitationData,
            timeLabels,
            weathericon,
          },
        }, this.renderCharts); // Renderiza os gráficos após definir o estado
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do clima", error);
      this.setState({ error: "Erro ao buscar os dados do clima" });
    }
  };
  


  renderCharts = () => {
    const { temperatures, timeLabels, precipitationData } = this.state.data;

    // Verifique as referências dos canvas
    const tempCanvas = this.tempChartRef.current;
    const precipCanvas = this.precipitationChartRef.current;

    console.log('Temp Canvas:', tempCanvas);

    // Apenas renderiza gráficos se os canvas estiverem disponíveis
    if (!tempCanvas && !precipCanvas) {
      console.error('Canvas references are not available.');
      return;
    }

    // Destrói gráficos antigos apenas se existirem
    if (this.tempChart) {
      this.tempChart.destroy();
    }
    if (this.precipitationChart) {
      this.precipitationChart.destroy();
    }

    const ctxTemp = tempCanvas ? tempCanvas.getContext("2d") : null;
    const ctxPrecipitation = precipCanvas ? precipCanvas.getContext("2d") : null;

    if (ctxTemp && this.state.showTempChart) {
      // Gráfico de Temperatura
      this.tempChart = new Chart(ctxTemp, {
        type: 'bar',
        data: {
          labels: timeLabels,
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: temperatures,
              fill: false,
              backgroundColor: 'blue',
              borderColor: 'blue',
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Hora',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperatura (°C)',
              },
            },
          },
        },
      });
    }
  };

  render() {
    const { data, error, showTempChart } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (!data) {
      return <p>Carregando dados do clima para amanhã...</p>;
    }

    return (
      <section id="climaamanha" className="climaamanha">
        <h2 className="tituloclima">Clima em {data.cityName} amanhã:</h2>
        
        <div className="climaamanha-content">
          <div className="temperaturaminamanha">Máx: {data.maxTemp}°C</div>
          <div className="temperaturamaxamanha">Mín: {data.minTemp}°C</div>
        </div>
          <div className="imagemamanha">
            {/* Adicionar ícone do clima */}
            <img
              src={`http://openweathermap.org/img/wn/${data.weathericon}.png`}
            />
          </div>
        <div>
          <canvas ref={this.tempChartRef} id="tempChart" width="400" height="200"/>
        </div>
      </section>
    );
  }
}
