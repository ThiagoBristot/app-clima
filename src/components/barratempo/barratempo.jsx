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
      componenteAtual: null,   // Componente exibido
      selectedCityId: null,    // ID da cidade selecionada
      botaoAtivo: null,        // Botão que foi clicado por último
    };
  }

  // Função para alterar o estado e definir qual componente será exibido
  handleClick = (componente, botaoIndex) => {
    this.setState({ 
      componenteAtual: componente, 
      botaoAtivo: botaoIndex    // Atualiza o botão ativo
    });
  };

  // Atualiza o estado com a cidade selecionada do SearchBar
  handleCitySelect = (cityId) => {
    this.setState({ selectedCityId: cityId });
    
    // Atualiza o componente atual para ClimaHoje ao selecionar uma cidade
    this.handleClick(<ClimaHoje cityId={cityId} />, 0);
  };

  render() {
    const { componenteAtual, selectedCityId, botaoAtivo } = this.state;

    return (
      <div>
        <SearchBar onCitySelect={this.handleCitySelect} />
        <ul className="barratempo">
          <li 
            onClick={() => this.handleClick(<ClimaHoje cityId={selectedCityId} />, 0)}
            className={botaoAtivo === 0 ? "ativo" : ""}
          >
            Hoje
          </li>
          <li 
            onClick={() => this.handleClick(<ClimaAmanha cityId={selectedCityId} />, 1)}
            className={botaoAtivo === 1 ? "ativo" : ""}
          >
            Amanhã
          </li>
          <li 
            onClick={() => this.handleClick(<Clima5d cityId={selectedCityId} />, 2)}
            className={botaoAtivo === 2 ? "ativo" : ""}
          >
            5 dias
          </li>
        </ul>

        <div className="conteudo-previsao">
          {componenteAtual}
        </div>
      </div>
    );
  }
}
