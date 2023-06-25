/**
 * Created on 2020-10-08 12:48
 * @summary: 
 * @author: Steven cabrera Londoño
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity ^0.8.17;

contract MensajeContract{

     struct Mensaje {
       string mensaje;
       address remitente;
     }

     mapping(uint256=>address)identificador;
     mapping(address=>bytes32[])misChats;
     mapping(bytes32=>Mensaje[])chats;
     mapping(bytes32=>bool)chatActivos;
     mapping(bytes32=>address[])lista;

     function isListing(address _user, bytes32 _chat) public view returns(bool permiso){
          permiso = true;
          if(lista[_chat].length>=1){
               permiso = false;
               for (uint256 index = 0; index < lista[_chat].length; index++) {
               if(lista[_chat][index] == _user){
                    permiso = true;
               }
          }
        }
     }

     function joinChat(bytes32 _chat) public {
          require(chatActivos[_chat]); 
          misChats[msg.sender].push(_chat);

     }

     function createChat(bool _privado, address[] memory _lista)public  returns(bytes32) {

        bytes32 chatName = keccak256(abi.encodePacked(msg.sender,block.timestamp));
        chatActivos[chatName] = true;
        if(_privado){
            lista[chatName] = _lista;
        }
        return chatName;

     }

     function sendMsg(string memory _mensaje,bytes32 _chat) public {
        require(chatActivos[_chat]); 
        require(isListing(msg.sender,_chat));

        chats[_chat].push(Mensaje(_mensaje,msg.sender));
        
     }
   
     function getChats(bytes32 _chat) public view returns (Mensaje[] memory mss){
       require(chatActivos[_chat]); 
       require(isListing(msg.sender,_chat));

       return chats[_chat];

     }

}