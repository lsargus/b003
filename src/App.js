import React, {Component} from 'react'
import { Menubar } from "primereact/menubar";

class App extends Component {
  render() {
    const menuitems = [
      {
        label: "Home",
        icon: "pi pi-fw pi-home",
        command: (event) => {
          window.location = "/Home";
        }
      },
      {
        label: "Posenet",
        icon: "pi pi-fw pi-user",
        command: (event) => {
          window.location = "/Posenet";
        }
      },
    ];

    return <Menubar model={menuitems} />;
  }
}

export default App;
