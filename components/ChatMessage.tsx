
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';

interface ChatMessageProps {
  message: ChatMessage;
}

const renderTextWithFormatting = (text: string) => {
  const segments = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return segments.map((segment, i) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return <strong key={i}>{segment.slice(2, -2)}</strong>;
    } else {
      return <span key={i}>{segment}</span>;
    }
  });
};

const renderContent = (content: string) => {
  // Regex to split the content by the image markdown, keeping the delimiter
  const imageSplitRegex = /(\*\*Image:\s?\*.*?\*\s?\[https?:\/\/[^\s\]]+\])/g;
  const parts = content.split(imageSplitRegex).filter(p => p);

  return parts.map((part, index) => {
    // Regex to extract caption and URL from an image markdown part
    const imageDetailsRegex = /\*\*Image:\s?\*(.*?)\*\s?\[(https?:\/\/[^\s\]]+)\]/;
    const match = part.match(imageDetailsRegex);

    if (match) {
      const caption = match[1];
      const imageUrl = match[2];
      return (
        <figure key={`image-${index}`} className="my-4 max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-sm">
          <img
            src={imageUrl}
            alt={caption}
            className="w-full object-cover"
          />
          <figcaption className="text-center text-sm italic text-gray-600 p-2">{caption}</figcaption>
        </figure>
      );
    } else {
      // It's a text part, render with existing formatting
      return <div key={`text-${index}`} className="whitespace-pre-wrap">{renderTextWithFormatting(part)}</div>;
    }
  });
};


const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === MessageRole.MODEL;

  const bubbleClasses = isUserModel
    ? 'bg-white text-gray-800'
    : 'bg-amber-500 text-white';

  const alignmentClasses = isUserModel ? 'items-start' : 'items-end';
  const avatar = isUserModel 
    ? <BotIcon className="w-8 h-8 text-amber-600" /> 
    : <UserIcon className="w-8 h-8 text-gray-500" />;

  const messageContainerOrder = isUserModel ? 'flex-row' : 'flex-row-reverse';

  return (
    <div className={`flex flex-col px-4 py-2 ${alignmentClasses}`}>
      <div className={`flex items-start space-x-3 space-x-reverse ${messageContainerOrder}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mt-1">
          {avatar}
        </div>
        <div className={`max-w-xl lg:max-w-2xl p-4 rounded-2xl shadow-md ${bubbleClasses}`}>
          <div className="prose prose-sm max-w-none">
            {renderContent(message.content)}
          </div>
          {message.content === '...' && (
            <div className="flex items-center space-x-1 mt-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;