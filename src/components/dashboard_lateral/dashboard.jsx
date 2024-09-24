import React, { Component } from "react";
import "./dashboard.css"
import { CgClose } from "react-icons/cg";
import { FiMenu } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { FiDisc } from "react-icons/fi";

export default class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,        // Estado para controlar se a dashboard está aberta ou fechada
      pesquisasRecentes: [], // Estado para armazenar as pesquisas recentes
    };
  }

  // Função para adicionar uma nova pesquisa ao histórico
  adicionarPesquisa = (cidadeNome, cityId) => {
    const novaPesquisa = { cidadeNome, cityId };
    console.log(novaPesquisa)
    this.setState(prevState => ({
      pesquisasRecentes: [novaPesquisa, ...prevState.pesquisasRecentes].slice(0, 5) // Limita a 5 pesquisas
    }));
  }

  // Verifica se houve uma nova cidade adicionada via props e atualiza o histórico
  componentDidUpdate(prevProps) {
    if (
      this.props.cidadeNome !== prevProps.cidadeNome || 
      this.props.cityId !== prevProps.cityId
    ) {
      // Adiciona a nova pesquisa ao histórico
      this.adicionarPesquisa(this.props.cidadeNome, this.props.cityId);
    } else {
      console.log("nao caiu no if")
    }
  }

  toggleSidebar = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { darkMode } = this.props;
    const { pesquisasRecentes, isOpen } = this.state;

    return (
      <section className='dashboard'>
        <button 
          id="toggleBtn" 
          className="toggle-btn" 
          onClick={this.toggleSidebar}>
          {isOpen ? <CgClose /> : <FiMenu />}
        </button>
        <div 
          id="sidebar" 
          className="sidebar" 
          style={{ width: isOpen ? '200px' : '60px' }}
        >
          <h2>{isOpen ? "Pesquisas Recentes" : <MdHistory />}</h2>

          {/* Renderiza as pesquisas recentes */}
          <ul className="pesquisas-recentes">
            {pesquisasRecentes.map((pesquisa, index) => (
              <li key={index} className="pesquisa-item">
                {isOpen 
                  ? `${pesquisa.cidadeNome} (ID: ${pesquisa.cityId})` 
                  : <FiDisc />}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}
