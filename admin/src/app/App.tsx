import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Bug,
  BarChart3,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Leaf,
} from 'lucide-react';
import { Login } from './components/Login';
import { DashboardHome } from './components/DashboardHome';
import { UserManagement } from './components/UserManagement';
import { PestDatabase } from './components/PestDatabase';
import { Analytics } from './components/Analytics';
import { Feedback } from './components/Feedback';
import { Settings } from './components/Settings';

type Page = 'dashboard' | 'users' | 'pests' | 'analytics' | 'feedback' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('gg_token')
  );
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users' as Page, label: 'User Management', icon: Users },
    { id: 'pests' as Page, label: 'Pest Database', icon: Bug },
    { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3 },
    { id: 'feedback' as Page, label: 'Feedback', icon: MessageSquare },
    { id: 'settings' as Page, label: 'Settings', icon: SettingsIcon },
  ];

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    localStorage.removeItem('gg_token');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'users':
        return <UserManagement />;
      case 'pests':
        return <PestDatabase />;
      case 'analytics':
        return <Analytics />;
      case 'feedback':
        return <Feedback />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col" style={{ borderColor: '#E0E0E0' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: '#E0E0E0' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2E7D32' }}
            >
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium" style={{ color: '#263238' }}>
                Govi Guru
              </h1>
              <p className="text-xs text-gray-600">($GO_L$) Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: '#2E7D32' }
                        : {}
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t" style={{ borderColor: '#E0E0E0' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: '#2E7D32' }}
            >
              A
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: '#263238' }}>
                Admin
              </p>
              <p className="text-xs text-gray-600">admin@goviguru.lk</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
