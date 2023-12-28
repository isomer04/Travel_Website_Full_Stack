import { useState, useContext } from 'react';
import axios from 'axios';
import {useAuth} from '../AuthContext.jsx';


const MessageForm = ({ userId, onCreateMessage  }) => {
  const [messageText, setMessageText] = useState('');
  // const { user } = useAuth();

  const handleCreateMessage = async () => {
    const trimmedMessageText = messageText.trim();

    try {
      const response = await axios.post('http://localhost:8080/messages', {
        message_text: trimmedMessageText,
        posted_by: userId,
        time_posted_epoch: Math.floor(Date.now() / 1000)
      });
      console.log('Message created:', response.data);

      onCreateMessage(response.data);
      setMessageText(''); 
    } catch (error) {
      console.error('Message creation failed:', error.response.data);
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded shadow mb-4">
      <h2 className="text-xl mb-2">Post a New Message</h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button
        className=" text-white py-2 px-4 mt-2 rounded hover:bg-blue-600"
        onClick={handleCreateMessage}
      >
        Post
      </button>
    </div>
  );
};

export default MessageForm;
