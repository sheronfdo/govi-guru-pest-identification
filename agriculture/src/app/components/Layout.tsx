import { Outlet, Link, useLocation } from 'react-router';
import { Home, CheckSquare, MessageSquare, BookOpen, Users, LogOut, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';

interface LayoutProps {
  officerData: {
    name: string;
    region: string;
    officerId: string;
  };
  onLogout: () => void;
}

export default function Layout({ officerData, onLogout }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/verification', icon: CheckSquare, label: 'Verification' },
    { path: '/inbox', icon: MessageSquare, label: 'Inbox' },
    { path: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
    { path: '/farmers', icon: Users, label: 'Farmers' },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => mobile && setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#1976D2] text-white'
                : 'text-[#455A64] hover:bg-gray-100'
            }`}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl text-[#1976D2]">Govi Guru</h1>
          <p className="text-sm text-[#455A64] mt-1">Officer Portal</p>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm">{officerData.name}</p>
          <p className="text-xs text-[#455A64]">{officerData.region}</p>
          <p className="text-xs text-[#455A64] mt-1">{officerData.officerId}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="size-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg text-[#1976D2]">Govi Guru</h1>
          <p className="text-xs text-[#455A64]">{officerData.name}</p>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl text-[#1976D2]">Govi Guru</h1>
              <p className="text-sm text-[#455A64] mt-1">Officer Portal</p>
            </div>
            
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <p className="text-sm">{officerData.name}</p>
              <p className="text-xs text-[#455A64]">{officerData.region}</p>
              <p className="text-xs text-[#455A64] mt-1">{officerData.officerId}</p>
            </div>

            <nav className="p-4 space-y-2">
              <NavLinks mobile />
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
              >
                <LogOut className="size-5 mr-3" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}