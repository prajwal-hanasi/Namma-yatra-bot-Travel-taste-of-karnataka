import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, MessageRole } from './types';
import { createChatSession } from './services/geminiService';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSession = useMemo(() => createChatSession(), []);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (userInput: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: userInput,
    };

    const modelResponseId = (Date.now() + 1).toString();
    const modelPlaceholder: ChatMessage = {
      id: modelResponseId,
      role: MessageRole.MODEL,
      content: '...',
    };

    setMessages(prev => [...prev, userMessage, modelPlaceholder]);

    try {
      const stream = await chatSession.sendMessageStream({ message: userInput });
      
      let fullResponse = '';
      setMessages(prev => prev.map(msg => msg.id === modelResponseId ? {...msg, content: ''} : msg));

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === modelResponseId ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    } catch (e: any) {
      const errorMessage = "Sorry, I couldn't get a response. Please try again.";
      setError(errorMessage);
       setMessages(prev => 
        prev.map(msg => 
          msg.id === modelResponseId ? { ...msg, content: errorMessage } : msg
        )
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-b from-yellow-200 to-red-200">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 p-4 text-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-amber-700 tracking-wide">Namma Yatra Bot</h1>
        <p className="text-sm text-gray-600">Travel & Taste of Karnataka</p>
      </header>

      <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">Welcome!</p>
            <p>Ask me anything about travel in Karnataka.</p>
            <p className="text-sm mt-4">e.g., "What are the best places to visit in Karnataka?"</p>
          </div>
        )}
        {messages.map(msg => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
      </main>

      <footer className="sticky bottom-0">
        {error && <div className="text-center text-red-500 bg-red-100 p-2">{error}</div>}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;