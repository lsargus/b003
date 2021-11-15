import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Posenet from "./components/posenet/Posenet";
import Home from "./components/home/Home";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/Home" element={<Home/>} />
      <Route path="/Posenet" element={<Posenet/>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
