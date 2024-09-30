import React, { Component } from "react";
import "./clima15d.css";
import { FaArrowDown, FaArrowUp, FaThermometerHalf } from "react-icons/fa";
import { BiDroplet } from "react-icons/bi";

export default class Clima5d extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cidadeNome: "",
      previsao5d: [],
      erro: null,
      diasExpandido: [],
    };

    this.token = '4d0054ae2de00b7cc66c50e704c82d2f'; // Substitua pelo seu token da API
  }

  componentDidMount() {
    if (this.props.cityId) {
      this.fetchPrevisao5d(this.props.cityId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cityId !== this.props.cityId && this.props.cityId) {
      this.fetchPrevisao5d(this.props.cityId);
    }
  }

  formatarData = (data) => {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano} ${mes} ${dia}`;
  };

  agruparPrevisoesPorDia = (previsoes) => {
    const agrupadas = [];
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
  
    previsoes.forEach((previsao) => {
      const dataPrevisao = new Date(previsao.dt * 1000);
      const dataFormatada = this.formatarData(dataPrevisao);
      const hora = dataPrevisao.getHours();
  
      // Verificar se a previsão é para amanhã ou depois
      if (dataFormatada >= this.formatarData(amanha)) {
        if (agrupadas.length > 0 && this.formatarData(new Date(agrupadas[agrupadas.length - 1][0].dt * 1000)) === dataFormatada) {
          agrupadas[agrupadas.length - 1].push(previsao);
        
        } else {
          agrupadas.push([previsao]);
        }
      }
    });
  
    console.log("Previsão agrupada por dia:", agrupadas);

    return agrupadas.map(dia => dia.filter(previsao => {
      const hora = new Date(previsao.dt * 1000).getHours();
      return hora === 0 || hora === 3 || hora === 6 || hora === 9 || hora === 12 || hora === 15 || hora === 18 || hora === 21;
    }));
  };  
  
  calcularMediaETemperaturasExtremas = (dia) => {
    let totalMax = 0;
    let totalMin = 0;
    let maiorMax = -Infinity;
    let menorMin = Infinity;
    let totalPrecipitacao = 0; // Variável para acumular a precipitação do dia
    const precipitationData = [];
  
    dia.forEach((previsao) => {
      const tempMax = previsao.main.temp_max;
      const tempMin = previsao.main.temp_min;
      totalMax += tempMax;
      totalMin += tempMin;
  
      if (tempMax > maiorMax) {
        maiorMax = tempMax;
      }
      if (tempMin < menorMin) {
        menorMin = tempMin;
      }
  
      const chuva = previsao.rain?.['3h'] || 0;
      const neve = previsao.snow?.['3h'] || 0;
  
      // Adiciona a precipitação (chuva ou neve) ao total
      totalPrecipitacao += chuva + neve;
      precipitationData.push(chuva + neve);
      //console.log(`Precipitação para ${new Date(previsao.dt * 1000)}: Chuva: ${chuva}, Neve: ${neve}, Total Precipitação: ${totalPrecipitacao}`);
    });
  
    const mediaMax = totalMax / dia.length;
    const mediaMin = totalMin / dia.length;
  
    return { mediaMax, mediaMin, maiorMax, menorMin, totalPrecipitacao };
  }; 

  toggleExpandirDia = (index) => {
    this.setState((prevState) => {
      const diasExpandido = [...prevState.diasExpandido];
      if (diasExpandido.includes(index)) {
        return { diasExpandido: diasExpandido.filter((i) => i !== index) };
      } else {
        return { diasExpandido: [...diasExpandido, index] };
      }
    });
  };

  fetchPrevisao5d = async (cityId) => {
    try {
      const responseCity = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${this.token}`
      );
      const cityData = await responseCity.json();

      if (cityData.cod !== 200) {
        this.setState({ erro: cityData.message });
        return;
      }

      const cidadeNome = cityData.name;

      const responseForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${this.token}&units=metric`
      );
      const data = await responseForecast.json();
      console.log(data);
      if (data.cod !== "200") {
        this.setState({ erro: data.message });
        return;
      }

      this.setState({
        cidadeNome,
        previsao5d: this.agruparPrevisoesPorDia(data.list),
        erro: null,
      });
    } catch (error) {
      console.error("Erro ao buscar os dados do clima", error);
      this.setState({ erro: "Erro ao buscar os dados do clima" });
    }
  };

  render() {
    const { previsao5d, cidadeNome, erro, diasExpandido } = this.state;
  
    if (erro) {
      return <p>{erro}</p>;
    }
  
    if (previsao5d.length === 0) {
      return <p>Carregando dados do clima para os próximos 5 dias...</p>;
    }
  
    return (
      <section id="clima15" className="clima15">
        <h2 className="tituloprev5d">Previsão de 5 dias em {cidadeNome}:</h2>
        {previsao5d.map((dia, index) => {
          const { mediaMax, mediaMin, maiorMax, menorMin, totalPrecipitacao } =
            this.calcularMediaETemperaturasExtremas(dia);
          const isExpandido = diasExpandido.includes(index);
  
          return (
            <div key={index} className={`index`}>
              <div
                className={`dia-previsao ${isExpandido ? "expandido" : ""}`}
                onClick={() => this.toggleExpandirDia(index)}
                style={{ cursor: "pointer" }}
              >
                <h3 className="datadia">
                  Previsão de {new Date(dia[0].dt * 1000).toLocaleDateString()} em {cidadeNome}:
                </h3>
                <div className="temperatura15">
                  <p className="max">
                    <FaArrowUp /> {maiorMax.toFixed(0)}°C
                  </p>
                  <p className="min">
                    <FaArrowDown /> {menorMin.toFixed(0)}°C
                  </p>
                  {!isExpandido && (
                    <div className="precipitacao">
                      <BiDroplet /> {totalPrecipitacao} mm 
                    </div>
                  )}
                </div>
  
                {isExpandido && (
                  <ul>
                    {dia.map((previsao, subIndex) => {
                      const diadata = new Date(previsao.dt * 1000).toLocaleTimeString().substring(0, 5);
                      const temp = previsao.main.temp;
                      const estado = previsao.weather?.[0]?.description || "Sem informação";
                      const icone = `http://openweathermap.org/img/wn/${previsao.weather?.[0]?.icon || '01d'}@2x.png`;
  
                      return (
                        <li key={subIndex}>
                          <div className="data">
                            <div>{diadata}</div>
                          </div>
                          <div className="imgbox">
                            <div className="imagem">
                              <img src={icone} alt={estado} />
                            </div>
                          </div>
                          <div className="temperaturaexpandido">
                            <p className="temp">
                              <FaThermometerHalf /> {temp.toFixed(0)}°C
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </section>
    );
  }
}  
