import React, { useState, useEffect } from 'react';

const UpdateMessageModal = ({ onUpdate, onClose, selectedMessage, setSelectedMessage }) => {
  const [updatedText, setUpdatedText] = useState('');

  useEffect(() => {
    setUpdatedText(selectedMessage.message_text);
  }, [selectedMessage]);

  const handleUpdateClick = () => {
    onUpdate(updatedText);
    onClose();
    setSelectedMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="bg-white p-8 rounded-md shadow-md z-10">
        <h2 className="text-2xl font-semibold mb-4">Update Message</h2>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
          value={updatedText}
          onChange={(e) => setUpdatedText(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className=" px-4 py-2 mr-2 rounded-md"
            onClick={handleUpdateClick}
          >
            Update
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMessageModal;
