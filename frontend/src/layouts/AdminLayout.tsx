import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Trophy, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout() {
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Mata Pelajaran', href: '/admin/subjects', icon: BookOpen },
    { name: 'Bank Soal', href: '/admin/questions', icon: HelpCircle },
    { name: 'Daftar Nilai', href: '/admin/scores', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-fuchsia-50/50 flex font-sans selection:bg-fuchsia-200">
      {/* Sidebar - Vibrant Purple Gradient */}
      <aside className="w-64 bg-gradient-to-b from-purple-800 to-fuchsia-900 border-r border-purple-800/50 flex flex-col hidden md:flex shadow-2xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10 backdrop-blur-sm">
          <div className="bg-white/20 p-1.5 rounded-lg mr-3 shadow-inner">
            <Trophy className="w-6 h-6 text-fuchsia-300" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-wide shadow-sm">EdTech Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            // Strict exact match for dashboard
            const isExactActive = item.href === '/admin' ? location.pathname === '/admin' : isActive;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  isExactActive 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/20 translate-x-1' 
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${isExactActive ? 'text-fuchsia-300' : 'text-purple-300/70'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 backdrop-blur-sm">
          <button onClick={logout} className="flex items-center w-full px-4 py-3 text-sm font-bold text-fuchsia-200 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all">
            <LogOut className="mr-3 h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-fuchsia-100 flex items-center justify-end px-8 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-sm font-extrabold text-gray-700">Admin User</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
