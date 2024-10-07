import './App.css';
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/waitingroom';
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {
  const[conn, setConnection] = useState(null);
  const[messages, setMessages] = useState([]);
  
  
  const joinChatRoom = async (username, chatroom) => {
    try {

      const conn = new HubConnectionBuilder()
                    .withUrl("https://localhost:7193/chat")
                    .configureLogging(LogLevel.Information)
                    .build();

     conn.on("JoinSpecificChatRoom", (username, msg) => {
      console.log("msg:", msg);
      setMessages(prevMessages => [...prevMessages, { username, msg }]);
     });

     conn.on("RecivedSpecificMessage", (username, msg) => {
      console.log("msg:" + msg + "Từ:" + username );
      setMessages(prevMessages => [...prevMessages, {username, msg}])

     });

     await conn.start();
     console.log("Connection started successfully");

     await conn.invoke("SpecificChatRoom", {username, chatroom});
     console.log(username + " Đã tham gia phòng chat " + chatroom);

     setConnection(conn);
    } catch (error) {
      console.log(error);
    }
  }

const sendMessage = async(message) => {
  if (conn) {
    try {
      await conn.invoke("SendMessage", message);
      console.log("Tin nhắn đã được gửi");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  } else {
    console.log("Không có kết nối SignalR");
  }
}

console.log("Messages trong App.js:", messages);
  return (
    <div>
     <main>
      <Container>
        <Row class='px-5 my-5'>
          <Col sm='12'>
          <h1 className='font-weight-light'> Welcome to the F1 ChatApp
          </h1>
          </Col> 

        </Row>
        { !conn 
        ? <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
        : <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
        }
      </Container>
     </main>
    </div>
  );
}

export default App;
