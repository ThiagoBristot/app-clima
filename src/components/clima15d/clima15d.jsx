import React, { Component } from "react";
import "./clima15d.css";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaThermometerHalf } from "react-icons/fa";

export default class Clima5d extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cidadeNome: "",
      previsao5d: [],
      erro: null,
      diasExpandido: [], // Para armazenar os dias que foram expandidos ao clicar
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

  // Função para formatar a data no formato "yyyy mm dd" e ignorar o horário
  formatarData = (data) => {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const dia = data.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário

    return `${ano} ${mes} ${dia}`; // Retorna no formato "yyyy mm dd"
  };

  // Função para agrupar previsões por dia, ignorando o horário
  agruparPrevisoesPorDia = (previsoes) => {
    const agrupadas = [];
    const hoje = new Date(); // Obtém a data de hoje
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1); // Incrementa um dia para obter o próximo dia

    previsoes.forEach(previsao => {
      // Converte a previsão atual para um objeto Date
      const dataPrevisao = new Date(previsao.dt * 1000); // Convertendo timestamp para data

      // Formata a data para o formato "yyyy mm dd"
      const dataFormatada = this.formatarData(dataPrevisao);
      const dataAmanhaFormatada = this.formatarData(amanha);

      // Verifica se a previsão é do dia seguinte ou posterior
      if (dataFormatada >= dataAmanhaFormatada) {
        // Se o último array criado for do mesmo dia, adiciona a previsão a esse array
        if (
          agrupadas.length > 0 &&
          this.formatarData(new Date(agrupadas[agrupadas.length - 1][0].dt * 1000)) === dataFormatada
        ) {
          agrupadas[agrupadas.length - 1].push(previsao);
        } else {
          // Caso contrário, cria um novo array para o novo dia
          agrupadas.push([previsao]);
        }
      }
    });

    return agrupadas;
  };

  // Função para calcular a média das temperaturas máximas e mínimas do dia, além da maior máxima e menor mínima
  calcularMediaETemperaturasExtremas = (dia) => {
    let totalMax = 0;
    let totalMin = 0;
    let maiorMax = -Infinity; // Inicializando com um valor muito baixo
    let menorMin = Infinity;  // Inicializando com um valor muito alto

    dia.forEach(previsao => {
      const tempMax = previsao.main.temp_max;
      const tempMin = previsao.main.temp_min;

      // Acumula os valores para o cálculo das médias
      totalMax += tempMax;
      totalMin += tempMin;

      // Compara para encontrar a maior temperatura máxima e a menor temperatura mínima
      if (tempMax > maiorMax) {
        maiorMax = tempMax;
      }
      if (tempMin < menorMin) {
        menorMin = tempMin;
      }
    });

    // Calcula as médias
    const mediaMax = totalMax / dia.length;
    const mediaMin = totalMin / dia.length;

    // Retorna as médias e as temperaturas extremas
    return { mediaMax, mediaMin, maiorMax, menorMin };
  };

  // Função para lidar com o clique e expandir/recolher o dia
  toggleExpandirDia = (index) => {
    this.setState((prevState) => {
      const diasExpandido = [...prevState.diasExpandido];
      if (diasExpandido.includes(index)) {
        // Se o dia já está expandido, remove-o
        return { diasExpandido: diasExpandido.filter((i) => i !== index) };
      } else {
        // Caso contrário, adiciona-o
        return { diasExpandido: [...diasExpandido, index] };
      }
    });
  };

  fetchPrevisao5d = async (cityId) => {
    try {
      // Busca o nome da cidade com base no cityId
      const responseCity = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${this.token}`
      );
      const cityData = await responseCity.json();

      if (cityData.cod !== 200) {
        this.setState({ erro: cityData.message });
        return;
      }

      const cidadeNome = cityData.name; // Obtém o nome da cidade

      // Faz a requisição para o forecast de 5 dias usando o cityId
      const responseForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${this.token}&units=metric`
      );
      const data = await responseForecast.json();

      if (data.cod !== "200") {
        this.setState({ erro: data.message });
        return;
      }
      console.log(data)
      // Agrupa as previsões por dia, começando a partir do dia seguinte
      const previsaoAgrupada = this.agruparPrevisoesPorDia(data.list);

      this.setState({
        cidadeNome, // Salva o nome da cidade no estado
        previsao5d: previsaoAgrupada, // Atualiza a previsão agrupada
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
          const { mediaMax, mediaMin, maiorMax, menorMin } = this.calcularMediaETemperaturasExtremas(dia);
          const isExpandido = diasExpandido.includes(index); // Verifica se o dia está expandido
  
          return (
            <div key={index} className={`index`}>
              <div
                className={`dia-previsao ${isExpandido ? "expandido" : ""}`} // Adiciona a classe "expandido"
                onClick={() => this.toggleExpandirDia(index)}
                style={{ cursor: "pointer" }}
              >
                <h3 className="datadia">Previsão de {new Date(dia[0].dt * 1000).toLocaleDateString()} em {cidadeNome}:</h3>
                <div className="temperatura15">
                  <p className="max">
                    <FaArrowUp /> {maiorMax.toFixed(1)}°C
                  </p>
                  <p className="min">
                    <FaArrowDown /> {menorMin.toFixed(1)}°C
                  </p>
                </div>
  
                {/* Detalhes expandidos ao clicar */}
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
                              <FaThermometerHalf /> {temp}°C
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
