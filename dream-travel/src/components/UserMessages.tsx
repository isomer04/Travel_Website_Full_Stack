import  { useState } from 'react';
import axios from 'axios';
import Message from './Message';

const UserMessages = () => {
  const [accountId, setAccountId] = useState('');
  const [userMessages, setUserMessages] = useState([]);
  const [editedMessageId, setEditedMessageId] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState('');

  const handleGetMessagesByAccountId = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/accounts/${accountId}/messages`);
      setUserMessages(response.data);
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  };

  const handleEditMessage = (messageId, messageText) => {
    setEditedMessageId(messageId);
    setEditedMessageText(messageText);
  };

  const handleSaveEdit = async () => {
    if (editedMessageId && editedMessageText) {
      try {
        await axios.patch(`http://localhost:8080/messages/${editedMessageId}`, {
          message_text: editedMessageText,
        });
        // Update the edited message's text in the state
        setUserMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === editedMessageId ? { ...msg, message_text: editedMessageText } : msg
          )
        );
        setEditedMessageId(null);
        setEditedMessageText('');
      } catch (error) {
        console.error('Error editing message:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedMessageId(null);
    setEditedMessageText('');
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:8080/messages/${messageId}`);
      // Remove the deleted message from the state
      setUserMessages((prevMessages) => prevMessages.filter((msg) => msg.message_id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">Messages by User</h2>
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="p-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={handleGetMessagesByAccountId}
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Get Messages
        </button>
      </div>
      {userMessages.map((message) => (
        <div key={message.message_id} className="mb-2">
          {editedMessageId === message.message_id ? (
            <>
              <input
                type="text"
                value={editedMessageText}
                onChange={(e) => setEditedMessageText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button onClick={handleSaveEdit} className="mr-2 bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                Save
              </button>
              <button onClick={handleCancelEdit} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                Cancel
              </button>
            </>
          ) : (
            <>
              <Message message={message} />
              <button onClick={() => handleEditMessage(message.message_id, message.message_text)} className="mr-2 bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                Edit
              </button>
              <button onClick={() => handleDeleteMessage(message.message_id)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserMessages;
