import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = import.meta.env.SERVER_URL || 'http://localhost:3500'
const socket: Socket = io(SERVER_URL);

interface MessageData {
  sender?: string;
  message: string;
}

function App() {
  const currentUserID = socket?.id?.slice(0, 5);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [msgs, setMsgs] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState<string>('');


  useEffect(() => {
    socket.on('welcome', (message: string) => {
      setMsgs((prev) => [message, ...prev]);
    });

    socket.on('user_joined', (message: string) => {
      setMsgs((prev) => [message, ...prev]);
    });

    socket.on('user_disconnected', (message: string) => {
      setMsgs((prev) => [message, ...prev]);
    });

    socket.on('newMsg', (data: MessageData) => {
      setMsgs((prev) => [`(${data.sender}): ${data.message}`, ...prev]);
    });

    socket.on('activity', (data: string) => {
      setNotification(data);

      const newTimer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(newTimer);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMsg(e.target.value);
    socket.emit('activity', {});
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (newMsg.trim() !== '' && e.key === 'Enter') {
      socket.emit('newMsg', { message: newMsg });
      setNewMsg('');
    }
  };

  const handleSend = () => {
    if (newMsg.trim() !== '') {
      socket.emit('newMsg', { message: newMsg });
      setNewMsg('');
    }
  };

  const reversedMsgs = msgs.slice().reverse();

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [msgs]);

  return (
    <main className="main">
      <div className="chat-window" ref={chatWindowRef}>
        {reversedMsgs.map((msg, i) => (
          <div key={i} className={`message ${msg.startsWith(`(${currentUserID}):`) ? 'current-user-message' : 'other-user-message'}`}>
            {msg}
          </div>
        ))}
      </div>
      {notification?.length ? <p>{notification}</p> : null}

      <div className="chat-controls">
        <input
          type="text"
          value={newMsg}
          onChange={handleChange}
          onKeyDown={handleSubmit}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </main>
  );
}

export default App;
