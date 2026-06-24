import { useState, useEffect } from 'react';
import { Users, BookOpen, FileQuestion } from 'lucide-react';
import { api } from '../../api/axios';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    total_students: 0,
    total_subjects: 0,
    total_questions: 0,
    recent_scores: [] as any[]
  });

  useEffect(() => {
    api.get('/admin/dashboard-stats')
      .then(res => setStatsData(res.data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { name: 'Total Murid', value: statsData.total_students, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Mata Pelajaran', value: statsData.total_subjects, icon: BookOpen, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
    { name: 'Total Soal', value: statsData.total_questions, icon: FileQuestion, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h2 className="text-3xl font-extrabold text-purple-900 tracking-tight">Dashboard Admin</h2>
        <p className="mt-2 text-purple-600 font-medium">Ringkasan aktivitas platform pembelajaran EdTech.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-6 flex items-center hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group`}>
              {/* Decorative blob inside card */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-5 shadow-inner relative z-10`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.name}</p>
                <p className="text-3xl font-black text-gray-800 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Graphic / Table for Recent Scores */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 min-h-[350px] relative overflow-hidden flex flex-col">
        <h3 className="text-xl font-bold text-purple-900 mb-6 relative z-10">10 Riwayat Nilai Terbaru</h3>
        
        {statsData.recent_scores.length === 0 ? (
          <div className="flex-1 flex items-center justify-center relative z-10 text-gray-500 font-medium">Belum ada data nilai</div>
        ) : (
          <div className="flex-1 flex items-end gap-3 justify-around relative z-10 pt-10">
            {statsData.recent_scores.slice().reverse().map((item: any) => {
              // Calculate height relative to max score in the array, or minimum 10% so it's visible
              const maxScore = Math.max(...statsData.recent_scores.map((s:any) => s.score), 10);
              const heightPercent = Math.max((item.score / maxScore) * 100, 10);
              
              return (
                <div key={item.id} className="w-full max-w-[48px] flex flex-col items-center group">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-fuchsia-400 rounded-t-lg shadow-md hover:brightness-110 transition-all cursor-pointer relative" 
                    style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-20 flex flex-col items-center">
                      <span className="font-bold text-fuchsia-300">{item.score} Poin</span>
                      <span className="text-[10px] text-gray-300">{item.student_name}</span>
                      {/* Arrow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold mt-2 truncate w-full text-center" title={item.student_name}>{item.student_name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Background grid lines */}
        <div className="absolute inset-x-8 inset-y-16 flex flex-col justify-between pointer-events-none opacity-10">
          {[1,2,3,4,5].map(n => <div key={n} className="border-b border-purple-900 w-full h-0"></div>)}
        </div>
      </div>
    </div>
  );
}
