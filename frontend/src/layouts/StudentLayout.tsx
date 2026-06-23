import { Outlet, Navigate } from 'react-router-dom';
import { useStudentStore } from '../store/useStudentStore';
import { Star, User } from 'lucide-react';
import InteractiveDecorations from '../components/InteractiveDecorations';

export default function StudentLayout() {
  const { studentName, points } = useStudentStore();

  if (!studentName) {
    return <Navigate to="/student/welcome" replace />;
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans selection:bg-yellow-200 relative">
      <InteractiveDecorations />
      
      {/* Navbar Anak */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-sky-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-sky-100 p-2 rounded-full border-2 border-sky-200">
                <User className="w-5 h-5 text-sky-600" />
              </div>
              <span className="font-extrabold text-gray-800 text-lg">Hai, {studentName}!</span>
            </div>
            
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full border-2 border-yellow-300 shadow-sm transition-transform hover:scale-105">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-extrabold text-yellow-700">{points} Point</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
