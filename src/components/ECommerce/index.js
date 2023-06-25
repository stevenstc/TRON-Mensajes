import React, { Component } from "react";
import Utils from "../../utils";


/// La direccion de su contrato acá ///////////////////////////////////
const contractAddress = "TE2Yndwa6HBeqoPscrYfyZnV3gQEdhRLeq"; //shashta
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
    this.adress = this.adress.bind(this);
  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
  };

  adress(valor) {
    document.getElementById('direccion').value = valor;
    document.getElementById('mensaje').focus();
  };

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
            <div class="media w-50 ml-auto mb-3">
                  <div class="media-body">
                    <div class="bg-primary rounded py-2 px-3 mb-2">
                      <p class="text-small mb-0 text-white">{ms2[0]}</p>
                    </div>
                  </div>
                </div>
          );
          allMs.splice(0, 0, notif);
        } else {
          let notif = (
            <div class="media w-50 mb-3"><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width="50" class="rounded-circle" />
                  <div class="media-body ml-3">
                    <p class="small text-muted">{window.tronWeb.address.fromHex(ms2[2])}</p>
                    <div class="bg-light rounded py-2 px-3 mb-2">
                      <p class="text-small mb-0 text-muted">{ms2[0]}</p>
                    </div>
                  </div>
                </div>
          );
          allMs.splice(0, 0, notif);
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
    allMs.splice(0, 0, notif);
    document.getElementById("mensaje").value = "";
    document.getElementById("direccion").value = "";
    return Utils.contract.addMs(mensaje, destinatario).send();

  };

  render() {
    const { allMs } = this.state;
    return (
      <>
        <div class="container py-5 px-4">

          <header class="text-center">
            <h1 class="display-4 text-white">TRON Chat</h1>
            <p class="text-white lead mb-0">Chatea de forma descentralizada</p>
            <p class="text-white lead mb-4">Snippet by
              <a href="https://bootstrapious.com" class="text-white">
                <u>Bootstrapious</u></a>
            </p>
          </header>

          <div class="row rounded-lg overflow-hidden shadow">

            <div class="col-5 px-0">
              <div class="bg-white">

                <div class="bg-gray px-4 py-2 bg-light">
                  <p class="h5 mb-0 py-1">Recent</p>
                </div>

                <div class="messages-box">
                  <div class="list-group rounded-0">
                    <a class="list-group-item list-group-item-action active text-white rounded-0">
                      <div class="media"><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width="50" class="rounded-circle" />
                        <div class="media-body ml-4">
                          <div class="d-flex align-items-center justify-content-between mb-1">
                            <h6 class="mb-0">Jason Doe</h6><small class="small font-weight-bold">25 Dec</small>
                          </div>
                          <p class="font-italic mb-0 text-small">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
                        </div>
                      </div>
                    </a>



                  </div>
                </div>
              </div>
            </div>


            <div class="col-7 px-0">
              <div class="px-4 py-5 chat-box bg-white">

                {allMs}

              </div>


              <form action="#" class="bg-light">
                <div class="input-group">
                  <input type="text" placeholder="Type a message"  id="mensaje" aria-describedby="button-addon2" class="form-control rounded-0 border-0 py-4 bg-light" />
                  <div class="input-group-append">
                    <button id="button-addon2" type="submit" class="btn btn-link" onClick={() => this.addMs()}> <i class="fa fa-paper-plane"></i></button>
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
              <label for="exampleFormControlTextarea1">Dirección</label>
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

