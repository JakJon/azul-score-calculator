import React, { useState } from "react";
import "./App.scss";
import Board from "./components/board/board";

function App() {
  return (
    <div className="App">
      <h1>Azul Score Calculator</h1>
      <Board />
    </div>
  );
}

export default App;
