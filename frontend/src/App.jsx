import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TaskDetails from './pages/TaskDetails.jsx'
import Tasks from './pages/Tasks.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import Insights from './pages/Insights.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'

// Demo Components
import DemoLayout from './demo/DemoLayout.jsx'
import DemoDashboard from './demo/DemoDashboard.jsx'
import DemoTasks from './demo/DemoTasks.jsx'
import DemoInsights from './demo/DemoInsights.jsx'
import DemoAnalytics from './demo/DemoAnalytics.jsx'
import DemoSettings from './demo/DemoSettings.jsx'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Persistent SaaS Layout */}
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Demo Workspace Routes (Unprotected) */}
      <Route path="/demo" element={<DemoLayout />}>
        <Route index element={<Navigate to="/demo/dashboard" replace />} />
        <Route path="dashboard" element={<DemoDashboard />} />
        <Route path="tasks" element={<DemoTasks />} />
        <Route path="insights" element={<DemoInsights />} />
        <Route path="analytics" element={<DemoAnalytics />} />
        <Route path="settings" element={<DemoSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
