import React, { Component } from "react";
import Utils from "../../utils";

export default class MensajeContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMs: []
    };

    this.addMs = this.addMs.bind(this);
    this.getMsMensaje = this.getMsMensaje.bind(this);
    this.adress = this.adress.bind(this);
    this.fetchAccountAddress = this.fetchAccountAddress.bind(this);
  }

  async componentDidMount() {
    setTimeout(() => {
      this.getMsMensaje();
    }, 4 * 1000);
    this.fetchAccountAddress();
  };

  adress(valor) {
    document.getElementById('direccion').value = valor;
    document.getElementById('mensaje').focus();
  };

  async getMsMensaje() {

    function sinjQuery()
{
  
    var objDiv = document.getElementById("divu");
    objDiv.scrollTop = objDiv.scrollHeight;
}

    let ms = await this.props.contrato.MSG.getMsMensaje(0).call();
    let totalMs = parseInt(ms[1]._hex);

    let allMs = []

    for (let i = 0; i < totalMs; i++) {
      let ms2 = await this.props.contrato.MSG.getMsMensaje(i).call();

      if (ms2[0] !== "nada por aqui") {
        if (window.tronWeb.address.fromHex(ms2[2]) === this.props.accountAddress) {
          allMs.push (
            <div className="media w-50 ml-auto mb-3" key={"unechat-"+i}>
                  <div className="media-body">
                    <div className="bg-primary rounded py-2 px-3 mb-2">
                      <p className="text-small mb-0 text-white">{ms2[0]}</p>
                    </div>
                  </div>
                </div>
          );
        } else {
          allMs.push (
            <div className="media w-50 mb-3" key={"unechatAns-"+i}><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width="50" className="rounded-circle" />
                  <div className="media-body ml-3">
                    <p className="small text-muted">{window.tronWeb.address.fromHex(ms2[2])}</p>
                    <div className="bg-light rounded py-2 px-3 mb-2">
                      <p className="text-small mb-0 text-muted">{ms2[0]}</p>
                    </div>
                  </div>
                </div>
          );
        }

      }

      await this.setState({
        allMs: allMs
      })

      var objDiv = document.getElementById("divu");
      objDiv.scrollTop = objDiv.scrollHeight;
      
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
    allMs.splice(0, 0, notif);
    document.getElementById("mensaje").value = "";
    document.getElementById("direccion").value = "";
    return this.props.contrato.MSG.addMs(mensaje, destinatario).send();

  };

  async fetchAccountAddress() {
    const account = await window.tronWeb.trx.getAccount();
    const accountAddress = account.address; // HexString(Ascii)
     const accountAddressInBase58 = window.tronWeb.address.fromHex(
       accountAddress
     ); // Base58

    this.setState({
      accountAddress: accountAddressInBase58
    });
  }

  render() {
    const { allMs } = this.state;
    return (
      <>
        <div className="container py-5 px-4">

          <header className="text-center">
            <h1 className="display-4 text-white">TRON Chat</h1>
            <p className="text-white lead mb-0">Chatea de forma descentralizada</p>
            <p className="text-white lead mb-4">by
              <a href="https://brutus.finance" className="text-white">
                <u>brutus.finance</u></a>
            </p>
          </header>

          <div className="row rounded-lg overflow-hidden shadow">

            <div className="col-5 px-0">
              <div className="bg-white">

                <div className="bg-gray px-4 py-2 bg-light">
                  <p className="h5 mb-0 py-1">{this.state.accountAddress}</p>
                </div>

                <div className="messages-box">
                  <div className="list-group rounded-0">
                    <a className="list-group-item list-group-item-action active text-white rounded-0">
                      <div className="media"><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width="50" className="rounded-circle" />
                        <div className="media-body ml-4">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <h6 className="mb-0">Jason Doe</h6><small className="small font-weight-bold">25 Dec</small>
                          </div>
                          <p className="font-italic mb-0 text-small">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
                        </div>
                      </div>
                    </a>



                  </div>
                </div>
              </div>
            </div>


            <div className="col-7 px-0">
              <div id="divu" className="px-4 py-5 chat-box bg-white">

                {allMs}

              </div>


              <form action="#" className="bg-light">
                <div className="input-group">
                  <input type="text" placeholder="Type a message"  id="mensaje" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" />
                  <div className="input-group-append">
                    <button id="button-addon2" type="submit" className="btn btn-link" onClick={() => this.addMs()}> <i className="fa fa-paper-plane"></i></button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => this.getMsMensaje()}>Ver mis Mensajes</button>

        <div className="eCommerce-component-container">

          <form action="" className="alert alert-success">
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">Dirección</label>
              <textarea className="form-control" id="direccion" rows="1" placeholder="TB7.......r4XvF"></textarea>
            </div>
            <div className="form-group">
              <button className="btn btn-success" type="button" onClick={() => this.addMs()}>Enviar</button>
              Costo aproximado: 106420 Energía + 412 Ancho de Banda
            </div>
          </form>


        </div>
      </>
    );
  }
}

