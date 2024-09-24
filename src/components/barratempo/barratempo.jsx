import React, { Component } from "react";
import ClimaHoje from "../climahoje/climahoje";
import ClimaAmanha from "../climaamanha/climaamanha";
import Clima5d from "../clima15d/clima15d";
import SearchBar from "../searchbar/searchbar";
import "./barratempo.css";

export default class BarraTempo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componenteAtual: null, // Estado para controlar qual componente será exibido
      selectedCityId: null,  // Armazena o ID da cidade selecionada
    };
  }

  // Função para alterar o estado e renderizar o componente selecionado
  handleClick = (componente) => {
    this.setState({ componenteAtual: componente });
  };

  // Atualiza o estado com a cidade selecionada do SearchBar
  handleCitySelect = (cityId) => {
    this.setState({ selectedCityId: cityId });
  };

  render() {
    const { componenteAtual, selectedCityId } = this.state;

    return (
      <div>
        <SearchBar onCitySelect={this.handleCitySelect} />

        <ul className="barratempo">
          <li onClick={() => this.handleClick(<ClimaHoje cityId={selectedCityId} />)}>Hoje</li>
          <li onClick={() => this.handleClick(<ClimaAmanha cityId={selectedCityId} />)}>Amanhã</li>
          <li onClick={() => this.handleClick(<Clima5d cityId={selectedCityId} />)}>5 dias</li>
        </ul>

        <div className="conteudo-previsao">
          {componenteAtual}
        </div>
      </div>
    );
  }
}
