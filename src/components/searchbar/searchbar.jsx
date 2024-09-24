import React, { Component } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import "./searchbar.css";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: "", // Armazena o nome da cidade digitada pelo usuário
      cidades: [], // Array de cidades -> arrays com informações
      selectedCityId: null, // Armazena o ID da cidade selecionada
      error: null,  // Estado para armazenar erros
      visible: false, // display da div das cidades -> searchbar
    };
    this.token = '4d0054ae2de00b7cc66c50e704c82d2f'; // Token da API da OpenWeather
    this.debounceTimeout = null; // Para armazenar o timer do debounce
    this.searchBarRef = React.createRef(); // Referência para o container da search bar
    this.cidadesContainerRef = React.createRef(); // Referência para o container de cidades
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const searchBar = this.searchBarRef.current;
    const cidadesContainer = this.cidadesContainerRef.current;

    if (
      searchBar &&
      !searchBar.contains(event.target) && 
      cidadesContainer &&
      !cidadesContainer.contains(event.target)
    ) {
      if (document.getElementById("cidades-encontradas").style.display === "flex") {  
        document.getElementById("cidades-encontradas").style.display = "none";
        this.setState({ cityName: "", cidades: [] });
        console.log("Cidades zeradas e input limpo");
      }
    } else {
      if (this.state.cidades.length > 0) {
        this.setState({ visible: true });
      } else {
        this.setState({ visible: false });
      }
    }
  };

  toggleVisibility = () => {
    this.setState(prevState => ({ visible: !prevState.visible }), () => {
      document.getElementById("cidades-encontradas").style.display = this.state.visible ? "flex" : "none";
    });
  };

  handleInputChange = (event) => {
    this.setState({ cityName: event.target.value });

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.handleSearch();
    }, 1000);
  };

  fetchCityData = async () => {
    const { cityName } = this.state;
    if (cityName.trim() === "") {
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${this.token}`
      );
      const data = await response.json();

      const resultContainer = document.getElementById("cidades-encontradas");
      resultContainer.innerHTML = "";
      this.toggleVisibility();

      if (data.list && data.list.length > 0) {
        data.list.forEach(cidade => {
          const cityDiv = document.createElement("div");
          cityDiv.classList.add("info-cidade");

          cityDiv.onclick = () => {
            this.setState({ selectedCityId: cidade.id });
            this.props.onCitySelect(cidade.id);
            if (document.getElementById("cidades-encontradas").style.display === "flex") {  
              document.getElementById("cidades-encontradas").style.display = "none";
              this.setState({ cityName: "", cidades: [] });
            }
          };

          cityDiv.innerHTML = `
            <p><strong>${cidade.sys.country}</strong> ${cidade.name}</p>
          `;

          resultContainer.appendChild(cityDiv);
        });
      } else {
        console.error("Cidade não encontrada");
        this.setState({ error: "Cidade não encontrada" });
      }
    } catch (err) {
      console.error("Erro ao buscar os dados da cidade", err);
      this.setState({ error: "Erro ao buscar os dados da cidade" });
    }
  };

  handleSearch = () => {
    this.fetchCityData();
  };

  render() {
    const { cityName, error } = this.state;

    return (
      <div className="searchbar" ref={this.searchBarRef}>
        <div className="LocAtual">
          <IoIosPin className="locatual" />
          <span className="tooltip">Ao lado, pesquise pela cidade desejada:</span>
        </div>
        <input
          id="local"
          placeholder="Busque por uma localização..."
          value={cityName}
          onChange={this.handleInputChange}
        />
        <button id="submit" className="submitpesquisa" onClick={this.handleSearch}>
          <FaSearchLocation />
        </button>
        {error && <p className="erro">{error}</p>}
        <div
          id="cidades-encontradas"
          ref={this.cidadesContainerRef}
          className={`cidades-encontradas ${this.state.visible ? 'visible' : 'hidden'}`}
        ></div>
      </div>
    );
  }
}
