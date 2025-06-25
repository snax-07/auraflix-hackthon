'use client'

import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

const Home = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const url = 'wss://broker.emqx.io:8084/mqtt';
    const options = {
      keepalive: 30,
      reconnectPeriod: 1000,
      clientId: 'nextjs_mqtt_' + Math.random().toString(16).substr(2, 8),
    };

    const mqttClient: MqttClient = mqtt.connect(url, options);

    mqttClient.on('connect', () => {
      console.log('Connect ho gaya bhai');
      setIsConnected(true);

      mqttClient.subscribe('demo/hai', (err) => {
        if (!err) {
          mqttClient.publish('demo/hai' , "Kya haal hai bhai");
        } else {
          console.error('Subscription error:', err.message);
        }
      });
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      const msg = message.toString();
      console.log(` Received message: ${msg}`);
      setMessages((prev) => [...prev, msg]);
    });

    mqttClient.on('error', (err: Error) => {
      console.error('❌Connection error:', err.message);
      mqttClient.end();
    });

    mqttClient.on('close', () => {
      console.log(' Disconnected means kay gaya bhai');
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📡 MQTT with Next.js + TypeScript</h1>
      <p>Status: {isConnected ? 'Connected ✅' : 'Disconnected ❌'}</p>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;