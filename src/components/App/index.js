import React, { Component } from "react";

import ECommerce from "../ECommerce"; 
import TronLinkGuide from "../TronLinkGuide";

import abiContract from "../../abi/contract-abi.json";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountAddress:"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
      tronWeb: {
        installed: false,
        loggedIn: false,
        web3: null
      },
      contrato: {
        MSG: null,
        
      }
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.conectar();
    }, 3 * 1000);
    
  }

  async conectar() {

    var {tronWeb, wallet, contrato} = this.state;
    var conexion = 0;

    if ( typeof window.tronWeb !== 'undefined' && typeof window.tronLink !== 'undefined' ) {

      tronWeb['installed'] = true;

      if(window.tronWeb.ready || window.tronLink.ready){

        try {
          conexion = (await window.tronLink.request({ method: 'tron_requestAccounts' })).code;
        } catch(e) {
          conexion = 0
        }

        if(conexion === 200){
          tronWeb['loggedIn'] = true;
          wallet = window.tronLink.tronWeb.defaultAddress.base58

        }else{
          tronWeb['loggedIn'] = false;
          wallet = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";

        }



        tronWeb['web3'] = window.tronWeb;


        if(this.state.contrato.MSG == null){

        //window.tronWeb.setHeader({"TRON-PRO-API-KEY": process.env.REACT_APP_TG_TOKEN});

          contrato = {};

          //contrato.MSG = await window.tronWeb.contract().at("TCtMyNKi7HfgcPCSRXMXUqWpndcgzGAt7w");

          contrato.MSG = await window.tronWeb.contract(abiContract,"TAsoCRZcrQmqjPvMF6YgcLUaMVp7BpiiCc");

          this.setState({
            contrato: contrato
  
          });

        }
        
        
        this.setState({
          accountAddress: wallet,
          tronWeb: tronWeb,

        });
      }else{

        this.setState({
          tronWeb: tronWeb,

        });

      }


    } else {

      console.log("se salio")

      tronWeb['installed'] = false;
      tronWeb['loggedIn'] = false;

      this.setState({
        tronWeb: tronWeb

      });
    }

  }

  render() {
    if (!this.state.tronWeb.installed) return <TronLinkGuide />;

    if (!this.state.tronWeb.loggedIn) return <TronLinkGuide installed />;

    return (
      <div>
          <ECommerce contrato={this.state.contrato} accountAddress={this.state.accountAddress}/>
      </div>
    );
  }
}
export default App;

// {tWeb()}

