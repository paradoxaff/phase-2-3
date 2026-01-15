import { Task } from '../types/task';

interface TaskDetailProps {
  task: Task;
}

export default function TaskDetail({ task }: TaskDetailProps) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '1rem',
      backgroundColor: task.completed ? '#f8f9fa' : 'white'
    }}>
      <h2 style={{
        margin: '0 0 0.5rem 0',
        textDecoration: task.completed ? 'line-through' : 'none'
      }}>
        {task.title}
      </h2>

      {task.description && (
        <p style={{ margin: '0.5rem 0', color: '#666' }}>
          {task.description}
        </p>
      )}

      <div style={{ marginTop: '1rem' }}>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}