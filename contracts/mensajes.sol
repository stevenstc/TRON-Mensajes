/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity ^0.8.17;

contract MensajeContract{

     struct Mensaje {
       string mensaje;
       address remitente;
     }

     mapping(uint256=>address)public identificador;
     mapping(address=>bytes32[])_misChats;
     mapping(address=>bytes32[])_solicitudes;
     mapping(bytes32=>Mensaje[])chats;
     mapping(bytes32=>string) public chatName;
     mapping(bytes32=>bool)public chatActivo;
     mapping(bytes32=>address[])public lista;
     
     function misChats(address _user)public view returns(bytes32[] memory){
         return _misChats[_user];
     }
     
     function solicitudes(address _user)public view returns(bytes32[] memory){
         return _solicitudes[_user];
     }

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
          require(chatActivo[_chat]); 
          require(isListing(msg.sender,_chat));
          _misChats[msg.sender].push(_chat);

     }

     function inviteUserChat(address _user,bytes32 _chat) public{
          require(chatActivo[_chat]); 
          require(lista[_chat][0] == msg.sender);
          lista[_chat].push(_user);
          _solicitudes[_user].push(_chat);
     }
     
     function deleteChat(uint256 _index) public {
          delete _misChats[msg.sender][_index];

     }

     function deleteSolicitud(uint256 _index) public {
          delete _solicitudes[msg.sender][_index];

     }

     function createChat(address[] memory _lista)public  returns(bytes32) {

        bytes32 chatN = keccak256(abi.encodePacked(msg.sender,block.timestamp));
        chatActivo[chatN] = true;
        lista[chatN].push(msg.sender);

        for (uint256 index = 0; index < _lista.length; index++) {
            lista[chatN].push(_lista[index]);
            _solicitudes[_lista[index]].push(chatN);
        }
        
        _misChats[msg.sender].push(chatN);
        return chatN;

     }
     
     function deactiveChat(bytes32 _chat)public {
        require(lista[_chat][0] == msg.sender);
        chatActivo[_chat] = false;
        
     }

     function updateChatName(string memory _nombre,bytes32 _chat) public{
          require(chatActivo[_chat]); 
          require(lista[_chat][0] == msg.sender);
          chatName[_chat] = _nombre;
     }

     function sendMsg(string memory _mensaje,bytes32 _chat) public {
        require(chatActivo[_chat]); 
        require(isListing(msg.sender,_chat));

        chats[_chat].push(Mensaje(_mensaje,msg.sender));
        
     }
   
     function getMsgChats(bytes32 _chat) public view returns (Mensaje[] memory){
       require(chatActivo[_chat]); 
       require(isListing(msg.sender,_chat));

       return chats[_chat];

     }

}