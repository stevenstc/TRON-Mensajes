/**
 * Created on 2020-10-08 12:48
 * @summary: 
 * @author: Steven cabrera Londoño
 */
pragma solidity ^0.4.25;

/**
 * @title: Des Mensajes
 */
contract MensajeContract{

   struct Ms {
       string mensaje;
       address remitente;
       address destinatario;
   }

   Ms[] Mss;

   function addMs(string _mensaje,address _destinatario) public {
       
        address destino = msg.sender;
        Mss.push(Ms(_mensaje, destino, _destinatario));

   }
   
   function getMsMensaje(uint x) public view returns (string, uint, address, address){
       
       uint id = Mss.length;
       if (Mss[x].destinatario == msg.sender || Mss[x].remitente == msg.sender){
            return (Mss[x].mensaje , id, Mss[x].remitente, Mss[x].destinatario);
       }else{
            return ("nada por aqui" , id, msg.sender, msg.sender);
       }

   }

}