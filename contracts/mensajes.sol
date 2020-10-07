pragma solidity ^0.4.25;

contract MensajeContract{

   struct Ms {
       string mensaje;
       address remitente;
       address destinatario;
   }

   Ms[] Mss;
   mapping(address => uint) ownerToMs;

   function addMs(string _mensaje,address _destinatario) public returns (bool){
       
        address owner = _destinatario;
        address destino = msg.sender;
        uint id = Mss.push(Ms(_mensaje, destino, _destinatario));

       ownerToMs[owner]=id;
       bool hecho = true;
       return hecho;
   }
   
   function getMsMensaje(uint x) public view returns (string, uint, address, address){
       address owner = msg.sender;
       uint id = ownerToMs[owner];
       if (Mss[id-x].destinatario == owner){
            return (Mss[id-x].mensaje , id, Mss[id-x].remitente, Mss[id-x].destinatario);
       }else{
           return ("nada por aqui" , id, owner, owner);
       }

   }

}