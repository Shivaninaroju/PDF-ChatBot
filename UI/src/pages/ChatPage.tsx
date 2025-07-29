import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Upload, File, MessageSquare, Loader2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/6 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 p-4 relative z-10">
        <div className="container mx-auto flex items-center justify-between">
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

         

          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        {messages.length === 0 && !isUploading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8 animate-fade-in-up">
              <div className="bg-gradient-to-r from-cyan-500 to-violet-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow hover:scale-110 transition-all duration-500">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready for Intelligence!</h2>
              <p className="text-gray-400 mb-6">Upload your PDF document to unlock intelligent, contextual conversations.</p>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 hover:scale-110 hover:-translate-y-1 transition-all duration-500 shadow-lg hover:shadow-cyan-500/30">
                <Upload className="w-4 h-4 mr-2" /> Select Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isUploading && <LoadingSpinner message="Analyzing document with AI intelligence..." />}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <Card className={`max-w-xs md:max-w-md lg:max-w-lg ${message.type === 'user' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20' : 'bg-black/80 border-gray-700/50 hover:bg-black/90 transition-all duration-300'} hover:scale-105 transition-all duration-300`}>
                  <CardContent className="p-4">
                    <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-200'}`}>{message.content}</p>
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
        )}

        {uploadedFile && (
          <div className="border-t border-gray-800/50 p-4 bg-black/60 backdrop-blur-xl relative z-10">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask intelligent questions about your document..." disabled={isLoading} className="flex-1 bg-black/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-gray-600/70 transition-all duration-300" />
              <Button type="submit" disabled={isLoading || !inputMessage.trim()} className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 hover:scale-110 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-cyan-500/30">
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
