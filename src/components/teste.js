import React from 'react';
import AsyncSelect from "react"
export default function valvulasEStado() {
  const mapResponseToValuesAndLabels = (data) => ({
    v1: data.v1,
    v2: data.v2,
  });

  async function callApi(value) {
    const data = await fetch(`http://127.0.0.1:5000/estadoVavula`)
      .then((response) => response.json())
      .then((response) => response.map(mapResponseToValuesAndLabels))
      .then((final) =>
        final.filter((i) => i.label.toLowerCase().includes(value.toLowerCase()))
      );

    return data;
  }

  return (
    <div>
      <p>Exemplo de Async Select com api</p>
      <AsyncSelect
        cacheOptions
        loadOptions={callApi}
        onInputChange={(data) => {
          console.log(data);
        }}
        onChange={(data) => {
          console.log(data);
        }}
        defaultOptions
      />
    </div>
  );
}