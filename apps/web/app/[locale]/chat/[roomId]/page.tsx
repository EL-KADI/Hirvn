'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';

let socket;

export default function ChatPage() {
  const t = useTranslations('Chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

    socket = io({
      auth: {
        token,
      },
    });

    socket.emit('joinRoom', roomId);

    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      socket.emit('chatMessage', message, roomId);
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="border rounded p-4 h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full mt-2 p-2 bg-blue-500 text-white rounded">
          {t('send')}
        </button>
      </form>
    </div>
  );
}
