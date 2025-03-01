import { useEffect, useState } from "react";
import "./App.css";

function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socketInstance = new WebSocket("ws://localhost:8080");
    socketInstance.onopen = () => {
      console.log("Connection established");
      setSocket(socketInstance);
    };
    return () => {
      socketInstance.close();
    };
  }, []);

  return socket;
}

function App() {
  const socket = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!socket) return; // Ensure socket is not null before setting listeners

    socket.onmessage = (message) => {
      console.log("Message Received from server ", message.data);
      setMessages((prev) => [...prev, message.data]);
    };
  }, [socket]); // Add socket as a dependency

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <input type="text" onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => socket.send(message)}>send message</button>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </>
  );
}

export default App;