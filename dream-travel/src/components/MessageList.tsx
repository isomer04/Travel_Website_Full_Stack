import { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8080/allmessages'); 
        console.log('Response from backend:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">All Messages</h2>
      {messages.map((message) => (
        <Message key={message.message_id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
