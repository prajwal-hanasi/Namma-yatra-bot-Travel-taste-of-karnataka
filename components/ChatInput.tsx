import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about travel & food in Karnataka..."
          className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-amber-500 text-white rounded-full p-3 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isLoading ? (
             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;