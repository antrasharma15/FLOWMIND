import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoContext = createContext();

const initialTasks = [
  { id: '1', title: 'Deploy Flask Backend', desc: 'Finalize server production config.', priority: 'HIGH PRIORITY', status: 'COMPLETED', due: '2024-05-10', tags: 'Backend, DevOps', effort: '4h' },
  { id: '2', title: 'Complete Dashboard UI', desc: 'Implement glassmorphic charts.', priority: 'HIGH PRIORITY', status: 'IN PROGRESS', due: '2024-05-15', tags: 'Frontend, Design', effort: '6h' },
  { id: '3', title: 'Research Gemini API', desc: 'Analyze multi-modal capabilities.', priority: 'MEDIUM', status: 'PENDING', due: '2024-05-18', tags: 'AI, R&D', effort: '2h' },
  { id: '4', title: 'Team Sprint Review', desc: 'Weekly sync with engineering team.', priority: 'LOW', status: 'PENDING', due: '2024-05-14', tags: 'Meeting', effort: '1h' },
  { id: '5', title: 'Optimize Analytics Charts', desc: 'Reduce rendering latency.', priority: 'MEDIUM', status: 'COMPLETED', due: '2024-05-08', tags: 'Performance', effort: '3h' },
  { id: '6', title: 'Fix Auth Middleware', desc: 'Resolve token expiration bug.', priority: 'HIGH PRIORITY', status: 'PENDING', due: '2024-05-13', tags: 'Security', effort: '2h' },
];

export const DemoProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [aiMode, setAiMode] = useState('Balanced');
  const [uiDensity, setUiDensity] = useState('Spacious');
  const [avatar, setAvatar] = useState('https://ui-avatars.com/api/?name=Demo+User&background=7d8dff&color=fff');

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    highPriority: tasks.filter(t => t.priority === 'HIGH PRIORITY').length,
    productivityScore: Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100),
  };

  const addTask = (task) => setTasks([...tasks, { ...task, id: Date.now().toString() }]);
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const updateTask = (id, updates) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));

  return (
    <DemoContext.Provider value={{ tasks, stats, aiMode, setAiMode, uiDensity, setUiDensity, avatar, addTask, deleteTask, updateTask }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => useContext(DemoContext);
