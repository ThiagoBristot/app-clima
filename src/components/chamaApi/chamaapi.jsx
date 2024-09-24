import React, { useState } from "react";
import SearchBar from "../searchbar/searchbar";

const WeatherApp = () => {
    const [error, setError] = useState(null);
    const token = 'c4e13206d4438728de00ca9536fff21b';

    const fetchCityData = async (cityName) => {
        try {
            const response = await fetch(
                `https://apiadvisor.climatempo.com.br/api/v1/locale/city?name=${cityName}&token=${token}`
            );
            const data = await response.json();

            if (data.length > 0) {
                console.log("Dados da cidade:", data[0]); // Exibe os dados no console
                setError(null);
            } else {
                console.error("Cidade não encontrada");
                setError("Cidade não encontrada");
            }
        } catch (err) {
            console.error("Erro ao buscar os dados da cidade", err);
            setError("Erro ao buscar os dados da cidade");
        }
    };

    return (
        <div>
            {/* Passa fetchCityData como onSearch para o componente SearchBar */}
            <SearchBar onSearch={fetchCityData} />
            {error && <p>{error}</p>} {/* Exibe mensagens de erro, se houver */}
        </div>
    );
};

export default WeatherApp;
