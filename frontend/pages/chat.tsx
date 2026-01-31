'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../services/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call the chat API endpoint
      const response = await fetch(`/api/${user?.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          conversationId: localStorage.getItem('conversationId') || null,
        }),
      });

      const data = await response.json();

      if (data.conversationId) {
        localStorage.setItem('conversationId', data.conversationId);
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading || !isAuthenticated) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>AI Todo Chatbot</h1>
        <div>
          <span>Welcome, {user?.email}</span>
        </div>
      </header>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '2rem' }}>
            Hello! I'm your AI assistant for managing tasks. You can ask me to add, update, complete, or delete tasks using natural language. For example: "Add a task to buy groceries" or "What tasks do I have?"
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '1rem',
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: message.role === 'user' ? '#007bff' : '#e9ecef',
                  color: message.role === 'user' ? 'white' : 'black',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                }}
              >
                {message.content}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#888',
                  marginTop: '0.25rem',
                  textAlign: message.role === 'user' ? 'right' : 'left'
                }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '60px',
            resize: 'vertical',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isLoading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}