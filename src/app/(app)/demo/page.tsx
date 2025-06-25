"use client";

import React, {
    useState,
    useEffect,
    useRef,
    ChangeEvent,
    KeyboardEvent,
  } from 'react';
  
  type Message =
    | { type: 'text'; text: string }
    | { type: 'file'; url: string; filename: string; sender: string };
  
  interface ChatRoomProps {
    roomId: string;
    userId: string;
  }
  
  const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, userId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const pendingFileName = useRef<string | null>(null);
  
    // Load previous messages from MongoDB
    useEffect(() => {
      fetch(`http://127.0.0.1:8000/messages/${roomId}`)
        .then(res => res.json())
        .then(data => {
          const history = data.map((msg: any) =>
            msg.type === 'text'
              ? { type: 'text', text: `[${msg.user_id}]: ${msg.content}` }
              : {
                  type: 'file',
                  filename: msg.filename,
                  url: `http://127.0.0.1:8000${msg.file_url}`,
                  sender: msg.user_id,
                }
          );
          setMessages(history);
        });
    }, [roomId]);
  
    // WebSocket setup
    useEffect(() => {
      const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/${userId}`);
      ws.current = socket;
  
      socket.onopen = () => {
        console.log(`[WebSocket OPEN] User: ${userId}`);
      };
  
      socket.onmessage = async (event: MessageEvent) => {
        if (event.data instanceof Blob) {
          const blob = event.data;
          const url = URL.createObjectURL(blob);
          const filename = pendingFileName.current || 'file';
  
          setMessages(prev => [
            ...prev,
            { type: 'file', url, filename, sender: 'Other' },
          ]);
  
          pendingFileName.current = null;
        } else {
          try {
            const meta = JSON.parse(event.data);
            if (meta.type === 'file') {
              pendingFileName.current = meta.filename;
            }
          } catch {
            setMessages(prev => [...prev, { type: 'text', text: event.data }]);
          }
        }
      };
  
      socket.onerror = (err) => console.error('[WebSocket ERROR]', err);
      socket.onclose = () => console.log(`[WebSocket CLOSED]`);
  
    //   return () => {
    //     socket.close();
    //   };
    }, [roomId, userId]);
  
    const sendMessage = () => {
      if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(input);
        setMessages(prev => [...prev, { type: 'text', text: `[You]: ${input}` }]);
        setInput('');
      }
    };
  
    const sendFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || ws.current?.readyState !== WebSocket.OPEN) return;
  
      // Send metadata
      const metadata = {
        type: 'file',
        filename: file.name,
      };
      ws.current.send(JSON.stringify(metadata));
  
      // Send actual file
      const arrayBuffer = await file.arrayBuffer();
      ws.current.send(arrayBuffer);
  
      // Show in UI immediately
      setMessages(prev => [
        ...prev,
        {
          type: 'file',
          filename: file.name,
          url: URL.createObjectURL(file),
          sender: 'You',
        },
      ]);
    };
  
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') sendMessage();
    };
  
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
        <h2>Room: {roomId} | User: {userId}</h2>
  
        <div
          style={{
            height: 300,
            overflowY: 'scroll',
            border: '1px solid gray',
            padding: 10,
            marginBottom: 10,
          }}
        >
          {messages.map((msg, index) =>
            msg.type === 'text' ? (
              <div key={index}>{msg.text}</div>
            ) : (
              <div key={index}>
                📎 <strong>{msg.sender}:</strong>{' '}
                <a href={msg.url} download={msg.filename}>
                  {msg.filename}
                </a>
                {msg.filename.match(/\.(jpg|jpeg|png|gif)$/i) && (
                  <div>
                    <img
                      src={msg.url}
                      alt={msg.filename}
                      style={{ maxWidth: '100%', marginTop: 5 }}
                    />
                  </div>
                )}
              </div>
            )
          )}
        </div>
  
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: '70%', marginRight: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
  
        <div style={{ marginTop: 10 }}>
          <input type="file" onChange={sendFile} />
        </div>
      </div>
    );
  };
  
  export default ChatRoom;
  