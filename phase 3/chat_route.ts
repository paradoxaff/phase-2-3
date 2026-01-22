// This is a standalone utility file for chat processing
// For Next.js API routes, use the file in frontend/src/app/api/chat/route.ts

// Server-side functions to interact with the backend API directly
const BACKEND_BASE_URL = typeof process !== 'undefined' ? (process.env.BACKEND_API_URL || 'http://localhost:8000') : 'http://localhost:8000';

// Default MCP tools that call the backend API directly (without auth - will be overridden in POST handler)
const mcpTools = {
  add_task: async (params: { user_id: string; title: string; description?: string }) => {
    return { success: false, error: 'Authentication required' };
  },
  list_tasks: async (params: { user_id: string; status?: 'all' | 'pending' | 'completed' }) => {
    return { success: false, error: 'Authentication required' };
  },
  complete_task: async (params: { user_id: string; task_id: string }) => {
    return { success: false, error: 'Authentication required' };
  },
  delete_task: async (params: { user_id: string; task_id: string }) => {
    return { success: false, error: 'Authentication required' };
  },
  update_task: async (params: { user_id: string; task_id: string; title?: string; description?: string }) => {
    return { success: false, error: 'Authentication required' };
  }
};

// Enhanced NLU (Natural Language Understanding) function with better intent recognition
const processNaturalLanguage = async (userMessage: string, userId: string | null, mcpToolsInstance: any = mcpTools) => {
  if (!userId) {
    return "User ID is required to process this request.";
  }
  const lowerMsg = userMessage.toLowerCase().trim();

  // List tasks intent first (highest priority)
  if (lowerMsg.includes('list') || lowerMsg.includes('show') || lowerMsg.includes('what') || (lowerMsg.includes('my ') && lowerMsg.includes('task')) || lowerMsg.includes('all')) {
    let status: 'all' | 'pending' | 'completed' = 'all';
    if (lowerMsg.includes('pending') || lowerMsg.includes('not done') || lowerMsg.includes('incomplete') || lowerMsg.includes('todo') || lowerMsg.includes('to do')) {
      status = 'pending';
    } else if (lowerMsg.includes('done') || lowerMsg.includes('completed') || lowerMsg.includes('finished')) {
      status = 'completed';
    }

    const result = await mcpToolsInstance.list_tasks({ user_id: userId, status });
    if (result.success) {
      if (result.tasks.length === 0) {
        return `You don't have any ${status === 'all' ? 'tasks' : status} tasks right now.`;
      }

      const taskList = result.tasks.map((task: any, index: number) =>
        `${index + 1}. ${task.title} ${task.completed ? '(completed)' : '(pending)'}`
      ).join('\n');

      return `Here are your ${status === 'all' ? 'tasks' : status}:\n${taskList}`;
    }
    return "I couldn't retrieve your tasks. Please try again.";
  }

  // Complete task intent
  if (lowerMsg.includes('complete') || lowerMsg.includes('finish') || lowerMsg.includes('done') || lowerMsg.includes('mark as done') || lowerMsg.includes('check off')) {
    // Try to identify which task to complete based on index or description
    const allTasks = (await mcpToolsInstance.list_tasks({ user_id: userId })).tasks;
    if (allTasks.length === 0) {
      return "You don't have any tasks to complete. Try adding a task first!";
    }

    // Look for task by index (e.g., "complete task 1")
    const indexMatch = userMessage.match(/(?:task|number|no\.?)\s*(\d+)/i);
    if (indexMatch) {
      const index = parseInt(indexMatch[1]) - 1;
      if (index >= 0 && index < allTasks.length) {
        const taskToComplete = allTasks[index];
        const result = await mcpToolsInstance.complete_task({ user_id: userId, task_id: taskToComplete.id });
        if (result.success) {
          return `I've marked "${result.task.title}" as completed. Great job!`;
        }
      }
    }

    // Look for task by keyword in title/description
    const nonCompletedTasks = allTasks.filter((task: any) => !task.completed);
    if (nonCompletedTasks.length > 0) {
      // Try to match based on keywords in the user message
      const messageKeywords = lowerMsg.split(/\s+/).filter(word => word.length > 2);
      for (const task of nonCompletedTasks) {
        const taskTitleLower = task.title.toLowerCase();
        if (messageKeywords.some(keyword => taskTitleLower.includes(keyword))) {
          const result = await mcpToolsInstance.complete_task({ user_id: userId, task_id: task.id });
          if (result.success) {
            return `I've marked "${result.task.title}" as completed. Nice work!`;
          }
        }
      }
    }

    // If no specific task matched, offer to list pending tasks
    const pendingTasks = allTasks.filter((task: any) => !task.completed);
    if (pendingTasks.length > 0) {
      const taskList = pendingTasks.slice(0, 5).map((task: any, index: number) =>
        `${index + 1}. ${task.title}`
      ).join('\n');
      return `I couldn't determine which task to complete. Here are your pending tasks:\n${taskList}\nPlease specify which one you want to mark as complete.`;
    }

    return "All your tasks are already completed! Nothing to complete.";
  }

  // Delete task intent
  if (lowerMsg.includes('delete') || lowerMsg.includes('remove') || lowerMsg.includes('cancel') || lowerMsg.includes('get rid of')) {
    const allTasks = (await mcpToolsInstance.list_tasks({ user_id: userId })).tasks;
    if (allTasks.length === 0) {
      return "You don't have any tasks to delete.";
    }

    // Look for task by index
    const indexMatch = userMessage.match(/(?:task|number|no\.?)\s*(\d+)/i);
    if (indexMatch) {
      const index = parseInt(indexMatch[1]) - 1;
      if (index >= 0 && index < allTasks.length) {
        const taskToDelete = allTasks[index];
        const result = await mcpToolsInstance.delete_task({ user_id: userId, task_id: taskToDelete.id });
        if (result.success) {
          return `I've deleted "${taskToDelete.title}" from your task list.`;
        }
      }
    }

    // Look for task by keyword in title/description
    const messageKeywords = lowerMsg.split(/\s+/).filter(word => word.length > 2);
    for (const task of allTasks) {
      const taskTitleLower = task.title.toLowerCase();
      if (messageKeywords.some(keyword => taskTitleLower.includes(keyword))) {
        const result = await mcpToolsInstance.delete_task({ user_id: userId, task_id: task.id });
        if (result.success) {
          return `I've deleted "${task.title}" from your task list.`;
        }
      }
    }

    // If no specific task matched, offer to list tasks
    const taskList = allTasks.slice(0, 5).map((task: any, index: number) =>
      `${index + 1}. ${task.title}`
    ).join('\n');
    return `I couldn't determine which task to delete. Here are your tasks:\n${taskList}\nPlease specify which one you want to remove.`;
  }

  // Update task intent
  if (lowerMsg.includes('update') || lowerMsg.includes('change') || lowerMsg.includes('modify') || lowerMsg.includes('edit')) {
    const allTasks = (await mcpToolsInstance.list_tasks({ user_id: userId })).tasks;
    if (allTasks.length === 0) {
      return "You don't have any tasks to update. Try adding a task first!";
    }

    // Look for task by index
    const indexMatch = userMessage.match(/(?:task|number|no\.?)\s*(\d+)/i);
    if (indexMatch) {
      const index = parseInt(indexMatch[1]) - 1;
      if (index >= 0 && index < allTasks.length) {
        // Extract new title from message
        const titleMatch = userMessage.match(/(?:update|change|modify|edit)\s+(?:task\s+\d+\s+to|task\s+\d+\s+as|to|as)\s+(.+)/i);
        if (titleMatch && titleMatch[1]) {
          const newTitle = titleMatch[1].trim();
          const result = await mcpToolsInstance.update_task({
            user_id: userId,
            task_id: allTasks[index].id,
            title: newTitle
          });
          if (result.success) {
            return `I've updated the task to "${result.task.title}".`;
          }
        }
      }
    }

    // Look for task by keyword and extract new content
    const messageKeywords = lowerMsg.split(/\s+/).filter(word => word.length > 2);
    for (const task of allTasks) {
      const taskTitleLower = task.title.toLowerCase();
      if (messageKeywords.some(keyword => taskTitleLower.includes(keyword))) {
        // Extract new title from message
        const titleMatch = userMessage.match(/(?:update|change|modify|edit)\s+(?:task|to|as)\s+(.+)/i);
        if (titleMatch && titleMatch[1]) {
          const newTitle = titleMatch[1].trim();
          const result = await mcpToolsInstance.update_task({
            user_id: userId,
            task_id: task.id,
            title: newTitle
          });
          if (result.success) {
            return `I've updated the task to "${result.task.title}".`;
          }
        }
      }
    }

    // If no specific task matched, offer to list tasks
    const taskList = allTasks.slice(0, 5).map((task: any, index: number) =>
      `${index + 1}. ${task.title}`
    ).join('\n');
    return `I couldn't determine which task to update. Here are your tasks:\n${taskList}\nTo update a task, say something like "Update task 1 to 'new title'" or "Change the grocery task to 'buy fruits and vegetables'"`;
  }

  // For any request that seems like a potential task creation, just create it directly
  // This makes the bot extremely permissive for task creation
  const cleanedMessage = userMessage
    .replace(/(please|kindly|could you|would you|i need|i want|i should|get me|buy me)\s*/gi, '')
    .replace(/^\s+|\s+$/g, '');

  if (cleanedMessage && cleanedMessage.length > 1) {
    // Check if it's not a generic request or question
    const isGeneric = ['hello', 'hi', 'hey', 'help', 'test', 'ok', 'yes', 'no', 'thanks', 'thank you'].includes(lowerMsg);

    if (!isGeneric) {
      const result = await mcpToolsInstance.add_task({ user_id: userId, title: cleanedMessage });
      if (result.success) {
        return `Great! I've added "${result.task.title}" to your task list. You can now see it in your task manager.`;
      }
    }
  }

  // Default response
  return `Hello! I'm your AI assistant for managing tasks. You can ask me to:\n  - Add tasks: "Add a task to buy groceries"\n  - List tasks: "Show my tasks" or "What do I have to do?"\n  - Complete tasks: "Complete task 1" or "Mark the meeting as done"\n  - Delete tasks: "Delete the old task" or "Remove task 2"\n  - Update tasks: "Update task 1 to 'call mom'" or "Change the doctor appointment to next week"\n\nWhat would you like to do?`;
};

// Export the main functionality
export { processNaturalLanguage, mcpTools, BACKEND_BASE_URL };
