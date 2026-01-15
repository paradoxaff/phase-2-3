'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../services/auth';
import { apiClient } from '../../services/api';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { Task } from '../../types/task';

export default function TasksPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    } else if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated, loading, router]);

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await apiClient.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskCompletedToggle = (updatedTask) => {
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
    <div style={{ padding: '2rem' }}>
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
  );
}