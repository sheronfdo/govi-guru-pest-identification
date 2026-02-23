import { Camera, History, MessageCircle, MessageSquare, User, Home, Bell, Sun, CloudRain, BookOpen } from 'lucide-react';

interface HomeDashboardProps {
  farmerName: string;
  onNavigate: (screen: string) => void;
  activeTab: string;
}

export function HomeDashboard({ farmerName, onNavigate, activeTab }: HomeDashboardProps) {
  const weather = 'sunny'; // Mock weather data

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div className="px-6 py-6" style={{ backgroundColor: '#4CAF50' }}>
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-90">Ayubowan,</p>
            <h2 className="text-2xl font-bold">Farmer {farmerName}</h2>
          </div>
          <div className="flex items-center gap-2">
            {weather === 'sunny' ? (
              <Sun className="w-10 h-10" />
            ) : (
              <CloudRain className="w-10 h-10" />
            )}
            <div>
              <p className="text-sm">28°C</p>
              <p className="text-xs opacity-90">Sunny</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Hero - Identify Pest Button */}
        <div className="flex flex-col items-center mb-10">
          <button
            onClick={() => onNavigate('camera')}
            className="w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95"
            style={{ backgroundColor: '#4CAF50' }}
          >
            <Camera className="w-20 h-20 text-white mb-3" />
            <span className="text-white text-xl font-bold">Identify Pest</span>
            <span className="text-white text-sm opacity-90 mt-1">Scan Now</span>
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('history')}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ border: '2px solid #e0e0e0' }}
          >
            <History className="w-10 h-10" style={{ color: '#795548' }} />
            <span className="font-semibold text-lg" style={{ color: '#333' }}>My History</span>
          </button>

          <button
            onClick={() => onNavigate('expert')}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ border: '2px solid #e0e0e0' }}
          >
            <MessageCircle className="w-10 h-10" style={{ color: '#795548' }} />
            <span className="font-semibold text-lg" style={{ color: '#333' }}>Ask Expert</span>
          </button>

          <button
            onClick={() => onNavigate('consultations')}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ border: '2px solid #e0e0e0' }}
          >
            <MessageSquare className="w-10 h-10" style={{ color: '#795548' }} />
            <span className="font-semibold text-lg" style={{ color: '#333' }}>My Consultations</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ border: '2px solid #e0e0e0' }}
          >
            <User className="w-10 h-10" style={{ color: '#795548' }} />
            <span className="font-semibold text-lg" style={{ color: '#333' }}>Profile</span>
          </button>

          <button
            onClick={() => onNavigate('knowledge-base')}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ border: '2px solid #e0e0e0' }}
          >
            <BookOpen className="w-10 h-10" style={{ color: '#4CAF50' }} />
            <span className="font-semibold text-lg" style={{ color: '#333' }}>Knowledge Base</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t-2 px-4 py-3" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex justify-around">
          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 py-2 px-6"
          >
            <Home
              className="w-7 h-7"
              style={{ color: activeTab === 'home' ? '#4CAF50' : '#999' }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: activeTab === 'home' ? '#4CAF50' : '#999' }}
            >
              Home
            </span>
          </button>

          <button
            onClick={() => onNavigate('camera')}
            className="flex flex-col items-center gap-1 py-2 px-6"
          >
            <Camera
              className="w-7 h-7"
              style={{ color: activeTab === 'camera' ? '#4CAF50' : '#999' }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: activeTab === 'camera' ? '#4CAF50' : '#999' }}
            >
              Scan
            </span>
          </button>

          <button
            className="flex flex-col items-center gap-1 py-2 px-6"
          >
            <Bell className="w-7 h-7" style={{ color: '#999' }} />
            <span className="text-xs font-semibold" style={{ color: '#999' }}>
              Alerts
            </span>
          </button>

          <button
            className="flex flex-col items-center gap-1 py-2 px-6"
            onClick={() => onNavigate('profile')}
          >
            <User className="w-7 h-7" style={{ color: '#999' }} />
            <span className="text-xs font-semibold" style={{ color: '#999' }}>
              Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
