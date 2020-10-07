import React, { Component } from "react";
//import Swal from "sweetalert2";

import Utils from "../../utils";
import "./ECommerce.scss";
//import TronLinkInfo from "../TronLinkInfo";

/// La direccion de su contrato acá ///////////////////////////////////
const contractAddress = "TPKBp42yMoudBof4g5ATm5XvC9mb9fkGe7";
// base85v = "TQaWQWLW8Nz8Nf9qnAxQZLMCNvPQEa81BT"
// hex = "41A03ED915BAAA7C556C0A9624B3130E74162453F4"
///////////////////////////////////////////////////////////////////////

export default class MensajeContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMs: [],
    };

    this.addMs = this.addMs.bind(this);
    this.getMsMensaje = this.getMsMensaje.bind(this);
  }


  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
  }


  async getMsMensaje() {
    const { allMs } = this.state;

    let ms = await Utils.contract.getMsMensaje(1).call();
    //console.log(ms);
    let totalMs = parseInt(ms[1]._hex);
    let i = 1;

    allMs.splice(0);

    while (i <= totalMs) {
      let ms2 = await Utils.contract.getMsMensaje(i).call();
      //console.log(totalMs);
       if (ms2[0] !== "nada por aqui") {
        allMs.push(
        <div className="alert alert-secondary" role="alert">
          <div className="font-weight-bold">{ms2[0]}</div>
          <hr></hr>
          <div className="mb-2 text-muted">Remitente: {window.tronWeb.address.fromHex(ms2[2])}</div>
        </div>
      );
       }
      
      i++;
    }


        
  };



  async addMs() {
    let mensaje = document.getElementById("mensaje").value;
    let destinatario = document.getElementById("direccion").value;
    //console.log(mensaje);
    return Utils.contract.addMs(mensaje, destinatario).send();
  }

  


  render() {
    const { allMs } = this.state;

    return (
      
      <div className="eCommerce-component-container">
        
          <form action="" className="alert alert-success">
            <input type="text" name="mensaje" id="mensaje" placeholder="Escribe tu mensaje"></input>
            <input type="text" name="direccion" id="direccion" placeholder="TB7RTxBPY4eMvKjceXj8SWjVnZCrWr4XvF"></input>
            <button type="button" onClick={() => this.addMs()}>Enviar</button>
          </form>
          
        
        <div className="eCommerce-item-container">
          {allMs}
          
        </div>
        <div className="eCommerce-item-container">
          <button className="btn btn-primary" onClick={() => this.getMsMensaje()}>Ver mis Mensajes</button>
        </div>
        
      </div> 

    );
  }
}

