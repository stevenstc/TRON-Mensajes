import React, { Component } from "react";

export default class MensajeContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMs: [],
      allChats: [],
      selectedChat: ""
    };

    this.addMs = this.addMs.bind(this);
    this.getMsMensaje = this.getMsMensaje.bind(this);
    this.fetchAccountAddress = this.fetchAccountAddress.bind(this);
  }

  async componentDidMount() {
    setTimeout(() => {
      this.getMsMensaje();
    }, 4 * 1000);
    this.fetchAccountAddress();
  };

  async getMsMensaje() {

    let ms = await this.props.contrato.MSG.misChats(this.props.accountAddress).call();

    let allChats = []

    allChats.push(
      <a href={"#createChat"} className="list-group-item list-group-item-action rounded-0">
        <div className="media"><img src="https://picsum.photos/50?random=999" alt="user" width="50" className="rounded-circle" />
          <div className="media-body ml-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="mb-0">Create Chat</h6>
            </div>
            <p className="font-italic mb-0 text-small">{'["adress","adress"]'}</p>
          </div>
        </div>
      </a>
    )

    for (let index = 0; index < ms.length; index++) {
      allChats.push(
        <a href={"#"+ms[index]} className="list-group-item list-group-item-action active text-white rounded-0">
          <div className="media"><img src={"https://picsum.photos/50?random="+index} alt="user" width="50" className="rounded-circle" />
            <div className="media-body ml-4">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <h6 className="mb-0">Chat name</h6>
              </div>
              <p className="font-italic mb-0 text-small">{ms[index]}</p>
            </div>
          </div>
        </a>
      )

    }

    await this.setState({
      allChats: allChats
    })

    let array = []
    if(ms.length>=1){
      array = await this.props.contrato.MSG.getMsgChats(ms[0]).call();

    }

    let allMs = []

    for (let i = 0; i < array.length; i++) {

      if (window.tronWeb.address.fromHex(array[i][1]) === this.props.accountAddress) {
        allMs.push(
          <div className="media w-50 ml-auto mb-3" key={"unechat-" + i}>
            <div className="media-body">
              <div className="bg-primary rounded py-2 px-3 mb-2">
                <p className="text-small mb-0 text-white">{array[i][0]}</p>
              </div>
            </div>
          </div>
        );
      } else {
        allMs.push(
          <div className="media w-50 mb-3" key={"unechatAns-" + i}><img src={"https://picsum.photos/50?random="+i} alt="user" width="50" className="rounded-circle" />
            <div className="media-body ml-3">
              <p className="small text-muted">{window.tronWeb.address.fromHex(array[i][1])}</p>
              <div className="bg-light rounded py-2 px-3 mb-2">
                <p className="text-small mb-0 text-muted">{array[i][0]}</p>
              </div>
            </div>
          </div>
        );
      }


      await this.setState({
        allMs: allMs
      })

      var objDiv = document.getElementById("divu");
      objDiv.scrollTop = objDiv.scrollHeight;

    }

    

  };


  async addMs() {
    var { allMs } = this.state;

    let destinatario = "0xfbbe913a5064d5b75607665b7df404ee81fc38147a27ea975da4e07ae73da932";
    let mensaje = document.getElementById('mensaje').value;

    if (mensaje === "") return;

    allMs.push(
      <div className="media w-50 ml-auto mb-3" key={"unechat-" + mensaje}>
        <div className="media-body">
          <div className="bg-primary rounded py-2 px-3 mb-2">
            <p className="text-small mb-0 text-white">{mensaje}</p>
          </div>
        </div>
      </div>
    );


    await this.props.contrato.MSG.sendMsg(mensaje, destinatario).send();

    document.getElementById('mensaje').value = "";

    await this.setState({
      allMs: allMs,
    })

    var objDiv = document.getElementById("divu");
    objDiv.scrollTop = objDiv.scrollHeight;

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
            <p className="text-white lead mb-4">
              by <a href="https://brutus.finance" className="text-white"> <u> brutus.finance</u></a>
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

                    {this.state.allChats}





                  </div>
                </div>
              </div>
            </div>


            <div className="col-7 px-0">
              <div id="divu" className="px-4 py-5 chat-box bg-white">

                {allMs}

              </div>


              <div className="bg-light">
                <div className="input-group">
                  <input type="text" placeholder="Type a message" id="mensaje" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" />
                  <div className="input-group-append">
                    <button id="button-addon2" className="btn btn-link" onClick={() => this.addMs()}> <i className="fa fa-paper-plane"></i></button>
                  </div>
                </div>
              </div>

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

