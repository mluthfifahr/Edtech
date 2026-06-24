import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudentStore } from '../../store/useStudentStore';
import { api } from '../../api/axios';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Trophy, Home, RotateCcw } from 'lucide-react';

export default function Result() {
  const { studentName, studentClass, currentScore, correctAnswers, wrongAnswers, addPoints } = useStudentStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectId, type } = location.state || {};
  
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const hasAddedPoints = useRef(false);

  useEffect(() => {
    // Detect window resize for confetti
    const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    // Add points to global points only once when mounted (React StrictMode fix)
    if (!hasAddedPoints.current) {
      addPoints(currentScore);
      hasAddedPoints.current = true;
      
      // Submit score ke backend (Guest Mode)
      if (studentName && subjectId) {
        api.post('/student/submit-score', {
          student_name: studentName,
          student_class: studentClass,
          subject_id: subjectId,
          type: type || 'quiz',
          score: currentScore,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers
        }).catch(err => console.error("Gagal mengirim skor", err));
      }
    }

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10">
      {/* Confetti effect if score is greater than 0 */}
      {currentScore > 0 && (
        <Confetti 
          width={windowDimension.width} 
          height={windowDimension.height} 
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}

      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-48 h-48 bg-yellow-100 rounded-full flex items-center justify-center border-8 border-yellow-300 shadow-2xl"
      >
        <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-md" />
      </motion.div>

      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-sky-800">Selesai! 🎉</h1>
        <p className="text-2xl text-sky-600 font-bold mt-4">
          Kamu mendapatkan <span className="text-yellow-600 text-4xl mx-2 drop-shadow-sm">{currentScore}</span> Poin!
        </p>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white px-10 py-8 rounded-[2.5rem] shadow-lg border-4 border-sky-100 flex gap-12 text-center"
      >
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Benar</p>
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center border-4 border-green-200">
            <p className="text-4xl font-black text-green-600">{correctAnswers}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Salah</p>
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center border-4 border-red-200">
            <p className="text-4xl font-black text-red-500">{wrongAnswers}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/home')}
          className="flex items-center px-8 py-4 bg-sky-100 text-sky-700 font-extrabold rounded-full hover:bg-sky-200 transition-colors border-2 border-sky-200"
        >
          <Home className="w-6 h-6 mr-3" /> Beranda
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)} 
          className="flex items-center px-8 py-4 bg-emerald-500 text-white font-extrabold rounded-full hover:bg-emerald-600 transition-colors shadow-xl shadow-emerald-500/30"
        >
          <RotateCcw className="w-6 h-6 mr-3" /> Main Lagi
        </motion.button>
      </div>
    </div>
  );
}
