'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/auth';
import { apiClient } from '@/services/api';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { Task } from '@/types/task';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function TasksPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. You can ask me to add, update, complete, or delete tasks using natural language. For example: "Add a task to buy groceries" or "What tasks do I have?"',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    } else if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await apiClient.get<{data: {tasks: Task[]}} >('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !user?.id) return;

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
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          userId: user?.id, // Pass userId in the body instead of URL
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

      // Refresh tasks after AI operation
      loadTasks();
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

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskCompletedToggle = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleLogout = () => {
    logout();
  };

  if (loading || loadingTasks) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Your Tasks</h1>
          <div>
            <span style={{ marginRight: '1rem' }}>Welcome, {user?.email}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <TaskForm onTaskCreated={handleTaskCreated} />

        <div style={{ marginTop: '2rem' }}>
          <h2>Task List</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet. Create your first task above!</p>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onTaskCompletedToggle={handleTaskCompletedToggle}
            />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
        <h2 style={{ marginBottom: '1rem' }}>AI Assistant</h2>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '1rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          maxHeight: '500px'
        }}>
          {messages.map((message) => (
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
                  maxWidth: '90%',
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
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to manage your tasks..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim() || !user?.id}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isLoading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (isLoading || !inputText.trim() || !user?.id) ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}