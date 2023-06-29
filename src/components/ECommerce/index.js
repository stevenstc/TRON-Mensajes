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
    this.getChats = this.getChats.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.fetchAccountAddress = this.fetchAccountAddress.bind(this);
    this.createChat = this.createChat.bind(this);
    this.copy = this.copy.bind(this);
    this.joinChat = this.joinChat.bind(this);

  }

  async componentDidMount() {
    setTimeout(() => {
      this.getChats();
    }, 4 * 1000);
    this.fetchAccountAddress();
  };

  async copy(data){
    document.getElementById("myInput").value = data;
    navigator.clipboard.writeText(document.getElementById("myInput").value);
    alert("Copied!"); 

  }

  async joinChat() {
    var chat = prompt("Hash to conect");
    await this.props.contrato.MSG.joinChat(chat).send();
    this.getChats();
  }

  async getChats() {

    let ms = await this.props.contrato.MSG.misChats(this.props.accountAddress).call();

    let allChats = []

    allChats.push(
      <div key={"ear-0"} style={{cursor:"pointer"}} onClick={()=>{this.createChat()}} className="list-group-item list-group-item-action rounded-0">
        <div className="media"><img src="https://picsum.photos/50?random=9999" alt="user" width="50" className="rounded-circle" />
          <div className="media-body ml-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="mb-0">Create Chat</h6>
            </div>
            <p className="font-italic mb-0 text-small">adress,adress</p>
          </div>
        </div>
      </div>
    )

    allChats.push(
      <div key={"ear-1"} style={{cursor:"pointer"}} onClick={()=>{this.joinChat()}} className="list-group-item list-group-item-action rounded-0">
        <div className="media"><img src="https://picsum.photos/50?random=999" alt="user" width="50" className="rounded-circle" />
          <div className="media-body ml-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="mb-0">Join Chat</h6>
            </div>
            <p className="font-italic mb-0 text-small">0x235795c75...382b667ad4</p>
          </div>
        </div>
      </div>
    )

    for (let index = 0; index < ms.length; index++) {

      let chatName = await this.props.contrato.MSG.chatName(ms[index]).call();

      if(chatName===""){chatName = (<div onClick={()=>{alert("updating name")}}>{(ms[index]).slice(0,7)+"..."+(ms[index]).slice(-5)}</div>)}
      allChats.push(
        <div key={"mensajes-"+(index+1)} style={{cursor:"pointer"}} onClick={()=>{ this.loadMessages(ms[index]) }} className="list-group-item list-group-item-action active text-white rounded-0">
          <div className="media"><img src={"https://picsum.photos/50?random="+index} alt="user" width="50" className="rounded-circle" />
            <div className="media-body ml-4">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <h6 className="mb-0">{chatName}</h6><small className="small font-weight-bold"><button onClick={()=>{this.copy(ms[index])}} className="btn btn-success">Link hash</button></small>
              </div>
              <p className="font-italic mb-0 text-small"></p>
            </div>
          </div>
        </div>
      )

    }

    this.setState({
      allChats: allChats
    })

  };

  async loadMessages(selectedChat){

    if(selectedChat === "" ) return;

    this.setState({selectedChat: selectedChat})

    let array = []

    if(selectedChat !== ""){
      array = await this.props.contrato.MSG.getMsgChats(selectedChat).call();

    }

    let allMs = []

    let lastMs = "";

    for (let i = 0; i < array.length; i++) {

      let user = window.tronWeb.address.fromHex(array[i][1]);

      
      if (user === this.props.accountAddress) {
        if( lastMs === user ){
          allMs.push(
            <div className="media w-50 ml-auto" key={"unechat-" + i}>
              <div className="media-body">
                <div className="bg-primary rounded py-2 px-3 mb-2">
                  <p className="text-small mb-0 text-white">{array[i][0]}</p>
                </div>
              </div>
            </div>
          );
        }else{
          allMs.push(
            <div className="media w-50 ml-auto mt-3" key={"unechat-" + i}>
              <div className="media-body">
                <div className="bg-primary rounded py-2 px-3 mb-2">
                  <p className="text-small mb-0 text-white">{array[i][0]}</p>
                </div>
              </div>
            </div>
          );
        }
      } else {
        if( lastMs === user ){
          allMs.push(
            <div className="media w-50" key={"unechatAns-" + i}>
              <div className="media-body ml-3">
                <div className="bg-light rounded py-2 px-3 mb-2">
                  <p className="text-small mb-0 text-muted">{array[i][0]}</p>
                </div>
              </div>
            </div>
          );
        }else{
          allMs.push(
            <div className="media w-50 mt-3" key={"unechatAns-" + i}><img src={"https://picsum.photos/50?random="+i} alt="user" width="50" className="rounded-circle" />
              <div className="media-body ml-3">
                <p className="small text-muted">{window.tronWeb.address.fromHex(array[i][1])}</p>
                <div className="bg-light rounded py-2 px-3 mb-2">
                  <p className="text-small mb-0 text-muted">{array[i][0]}</p>
                </div>
              </div>
            </div>
          );

        }
      }
      

      lastMs = user

      this.setState({
        allMs: allMs
      })

      var objDiv = document.getElementById("divu");
      objDiv.scrollTop = objDiv.scrollHeight;

    }

    this.setState({
      allMs: allMs
    })
    
  }


  async addMs() {

    let destinatario = this.state.selectedChat;
    let mensaje = document.getElementById('mensaje').value;

    if (mensaje === "") return;
    if (destinatario === ""){ alert("selecct a chat");return}

    await this.props.contrato.MSG.sendMsg(mensaje, destinatario).send();

    document.getElementById('mensaje').value = "";

    this.loadMessages(destinatario);

  };

  async createChat(){
    var destinatario = prompt("Adress from other user")

    await this.props.contrato.MSG.createChat([destinatario]).send();

  }

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

        <button className="btn btn-primary" onClick={() => this.loadMessages(this.state.selectedChat)}>Cargar Mensajes</button>
        <input type="text" value="Hello World" id="myInput" hidden />

      </>
    );
  }
}

