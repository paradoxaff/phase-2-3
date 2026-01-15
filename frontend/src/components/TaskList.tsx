'use client';

import { useState } from 'react';
import { apiClient } from '../services/api';
import { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  onTaskCompletedToggle: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted, onTaskCompletedToggle }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveTask = async (taskId: string) => {
    setLoadingStates(prev => ({ ...prev, [taskId]: true }));

    try {
      const response: any = await apiClient.put(`/tasks/${taskId}`, {
        title: editTitle,
        description: editDescription
      });

      onTaskUpdated(response.data.task);
      cancelEditing();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await apiClient.delete(`/tasks/${taskId}`);
      onTaskDeleted(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    setLoadingStates(prev => ({ ...prev, [taskId]: true }));

    try {
      const response: any = await apiClient.patch(`/tasks/${taskId}/complete`, {
        completed: !currentStatus
      });

      onTaskCompletedToggle(response.data.task);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: task.completed ? '#f8f9fa' : 'white',
            opacity: task.completed ? 0.8 : 1
          }}
        >
          {editingTaskId === task.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => saveTask(task.id)}
                  disabled={loadingStates[task.id]}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: loadingStates[task.id] ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loadingStates[task.id] ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loadingStates[task.id] ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#6c757d' : '#000'
                    }}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{ color: '#6c757d', marginBottom: '1rem' }}>{task.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                    disabled={loadingStates[task.id]}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: task.completed ? '#ffc107' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loadingStates[task.id] ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loadingStates[task.id] ? '...' : task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => startEditing(task)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6c757d' }}>
                Created: {new Date(task.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}