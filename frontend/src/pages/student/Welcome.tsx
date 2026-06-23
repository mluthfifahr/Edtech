import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/useStudentStore';
import { motion } from 'framer-motion';
import { Gamepad2, Rocket } from 'lucide-react';
import InteractiveDecorations from '../../components/InteractiveDecorations';

export default function Welcome() {
  const navigate = useNavigate();
  const { setStudentName, setStudentClass } = useStudentStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !grade.trim()) return;
    
    setStudentName(name.trim());
    setStudentClass(grade.trim());
    navigate('/student/home');
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <InteractiveDecorations />
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-sky-100 p-4 rounded-full border-4 border-sky-200">
            <Gamepad2 className="w-16 h-16 text-sky-600" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-sky-800 mb-2">Mulai Bermain!</h1>
        <p className="text-center text-sky-600 font-medium mb-8">Siapa namamu jagoan?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Nama Panggilan</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik namamu di sini..."
              className="w-full px-5 py-4 rounded-2xl bg-sky-50 border-2 border-sky-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 text-lg font-bold text-gray-800 outline-none transition-all placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Kelas Berapa?</label>
            <input
              type="text"
              required
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Contoh: 1A, 6 Merpati..."
              className="w-full px-5 py-4 rounded-2xl bg-sky-50 border-2 border-sky-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 text-lg font-bold text-gray-800 outline-none transition-all placeholder-gray-400"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-extrabold text-xl py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 hover:from-sky-500 hover:to-blue-600 transition-all border-b-4 border-blue-600 mt-8"
          >
            Gasss Bermain! <Rocket className="w-6 h-6" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
