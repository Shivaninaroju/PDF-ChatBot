import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Upload, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import LoadingSpinner from '../components/LoadingSpinner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPageProps {
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question', 'start');

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const systemMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: result.answer || `Document "${file.name}" uploaded and processed.`,
          timestamp: new Date()
        };
        setMessages([systemMessage]);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('question', inputMessage);

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Chat request failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssistantContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isBullet = /^[-*]\s+/.test(trimmed);
          if (trimmed === '') return null;
          return isBullet ? (
            <li key={idx}>{trimmed.replace(/^[-*]\s+/, '')}</li>
          ) : (
            <p key={idx}>{trimmed}</p>
          );
        })}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl border border-gray-700 rounded-2xl overflow-hidden shadow-lg bg-black relative">
        {/* Header with arrow */}
        <div className="bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 p-4 z-10">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
                Intelligent Document Chat
              </h1>
              <p className="text-sm text-gray-400">
                {uploadedFile ? `Analyzing: ${uploadedFile.name}` : 'Upload a document to begin intelligent conversation'}
              </p>
            </div>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto h-[65vh] p-4 space-y-4 bg-black">
          {isUploading && <LoadingSpinner message="Analyzing document with AI intelligence..." />}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-xs md:max-w-md lg:max-w-lg ${message.type === 'user' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20' : 'bg-black/80 border-gray-700/50 hover:bg-black/90 transition-all duration-300'} hover:scale-105 transition-all duration-300`}>
                <CardContent className="p-4">
                  {message.type === 'assistant' ? (
                    <div className="text-sm text-gray-200 space-y-1">
                      {renderAssistantContent(message.content)}
                    </div>
                  ) : (
                    <p className="text-sm text-white">{message.content}</p>
                  )}
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-cyan-100' : 'text-gray-400'}`}>{message.timestamp.toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-black/80 border-gray-700/50 max-w-xs animate-fade-in-up">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-gray-400 text-sm">AI is analyzing...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!uploadedFile && (
          <div className="border-t border-gray-800/50 p-4 bg-black/60 backdrop-blur-xl">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 hover:scale-110 hover:-translate-y-1 transition-all duration-500 shadow-lg hover:shadow-cyan-500/30"
            >
              <Upload className="w-4 h-4 mr-2" /> Select Document
            </Button>
          </div>
        )}

        {uploadedFile && (
          <div className="border-t border-gray-800/50 p-4 bg-black/60 backdrop-blur-xl">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask intelligent questions about your document..."
                disabled={isLoading}
                className="flex-1 bg-black/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-gray-600/70 transition-all duration-300"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 hover:scale-110 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-cyan-500/30"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
