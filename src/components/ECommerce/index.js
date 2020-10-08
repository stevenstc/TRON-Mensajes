import React, { Component } from "react";
import Utils from "../../utils";
import "./ECommerce.scss";
//import TronLinkInfo from "../TronLinkInfo";

/// La direccion de su contrato acá ///////////////////////////////////
const contractAddress = "TE2Yndwa6HBeqoPscrYfyZnV3gQEdhRLeq";
// base85v = "TE2Yndwa6HBeqoPscrYfyZnV3gQEdhRLeq"
///////////////////////////////////////////////////////////////////////

export default class MensajeContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMs: []
    };

    this.addMs = this.addMs.bind(this);
    this.getMsMensaje = this.getMsMensaje.bind(this);
  }


  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
  }

  async getMsMensaje() {
    const { allMs } = this.state;

    let ms = await Utils.contract.getMsMensaje(0).call();
    let totalMs = parseInt(ms[1]._hex);
    let i = 0;

    allMs.splice(0);

    while (i <= totalMs) {
      let ms2 = await Utils.contract.getMsMensaje(i).call();
      let account = await window.tronWeb.trx.getAccount();
      let accountAddress = account.address;
      accountAddress = window.tronWeb.address.fromHex(accountAddress);

       if (ms2[0] !== "nada por aqui") {
        if (window.tronWeb.address.fromHex(ms2[2]) === accountAddress) {
            let notif = (
              <div className="alert alert-primary" role="alert">
                <div className="mb-2 text-muted">Para: {window.tronWeb.address.fromHex(ms2[3])}</div>
                <hr></hr>
                <div className="font-weight-bold">{ms2[0]}</div>
              </div>
            );
            allMs.splice(0,0,notif);
          }else{
            let notif = (
              <div className="alert alert-secondary" role="alert">
                <div className="mb-2 text-muted">Responder: {window.tronWeb.address.fromHex(ms2[2])}</div>
                <hr></hr>
                <div className="font-weight-bold">{ms2[0]}</div>
              </div>
            );
            allMs.splice(0,0,notif);
          }
          
         }
      
      i++;
    }    
  };


  async addMs() {
    const { allMs } = this.state;

    let mensaje = document.getElementById("mensaje").value;
    let destinatario = document.getElementById("direccion").value;
    let notif = (
            <div className="alert alert alert-success" role="alert">
              <div className="mb-2 text-muted">Para: {destinatario}</div>
              <hr></hr>
              <div className="font-weight-bold">{mensaje}</div>
            </div>
          );
    allMs.splice(0,0,notif);
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
          <button className="btn btn-primary" onClick={() => this.getMsMensaje()}>Ver mis Mensajes</button>
          <hr></hr>
          <hr></hr>
        </div>
        <div className="eCommerce-item-container">{allMs}</div>
        
        
      </div> 

    );
  }
}

