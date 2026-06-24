import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  description: string;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/student/subjects');
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 tracking-tight">Mau Belajar Apa Hari Ini? 🚀</h1>
        <p className="text-lg md:text-xl text-sky-600 font-bold">Pilih mata pelajaran kesukaanmu dan kumpulkan point!</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-bounce bg-sky-200 p-5 rounded-full shadow-lg">
            <BookOpen className="w-10 h-10 text-sky-600" />
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {subjects.map((subject) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/student/subject/${subject.id}`)}
              className="bg-white rounded-[2rem] p-6 shadow-md border-4 border-sky-100 cursor-pointer hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors shadow-inner">
                <BookOpen className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="mt-2">
                <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{subject.name}</h3>
                <p className="text-gray-500 font-semibold line-clamp-2">{subject.description || 'Ayo mulai belajar dan bermain!'}</p>
              </div>
              <button className="mt-4 w-full py-3 bg-sky-100 text-sky-700 font-extrabold text-lg rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-sm">
                Mulai Main!
              </button>
            </motion.div>
          ))}

          {subjects.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white/60 rounded-[2rem] border-4 border-dashed border-sky-200 backdrop-blur-sm">
              <p className="text-sky-600 font-bold text-xl">Wah, belum ada pelajaran nih. Tanya gurumu ya! 🥺</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
