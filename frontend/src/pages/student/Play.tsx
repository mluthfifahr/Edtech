import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { useStudentStore } from '../../store/useStudentStore';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const STORAGE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '/storage') 
  : 'http://localhost:8000/storage';

export default function Play() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'quiz';
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const { updateGameplayStats, resetGameplayStats } = useStudentStore();

  useEffect(() => {
    resetGameplayStats();
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/student/questions/${subjectId}?type=${type}`);
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectId, type]);

  const handleAnswer = (choice: any) => {
    if (selectedChoiceId !== null) return; // Prevent double clicking
    
    setSelectedChoiceId(choice.id);
    const isCorrect = choice.is_correct;
    
    if (isCorrect) {
      setFeedback('correct');
      updateGameplayStats(10, true); // +10 points per correct answer
    } else {
      setFeedback('wrong');
      updateGameplayStats(0, false);
    }

    // Delay move to next question or result
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedChoiceId(null);
        setFeedback(null);
      } else {
        navigate('/student/result', { replace: true, state: { subjectId, type } });
      }
    }, 1500);
  };

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
      <p className="text-sky-600 font-bold text-lg">Menyiapkan Soal...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="text-center py-20 space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-800">Yah, belum ada soal di sini! 🥺</h2>
      <button onClick={() => navigate('/student/home')} className="px-6 py-3 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 shadow-md">
        Kembali ke Beranda
      </button>
    </div>
  );

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="relative min-h-[80vh]">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -left-20 text-yellow-400 opacity-50"
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 -right-20 text-sky-300 opacity-60"
        >
          <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.177 10.2039 17.8546 10.0152C17.3878 6.64371 14.4984 4 11 4C7.13401 4 4 7.13401 4 11C4 11.1396 4.00411 11.2783 4.01217 11.4158C1.76106 12.062 0 14.1537 0 16.5C0 19.5376 2.46243 22 5.5 22H17.5C18.6045 22 19.5 21.1046 19.5 20C19.5 18.8954 18.6045 18 17.5 18H5.5C4.67157 18 4 17.3284 4 16.5C4 15.6716 4.67157 15 5.5 15H6.5V11C6.5 8.51472 8.51472 6.5 11 6.5C13.4853 6.5 15.5 8.51472 15.5 11V12.5H17.5C18.6045 12.5 19.5 13.3954 19.5 14.5C19.5 15.6046 18.6045 16.5 17.5 16.5H16.5V19H17.5Z" /></svg>
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -left-10 text-pink-300 opacity-40 blur-[2px]"
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-full shadow-sm border-2 border-sky-100 flex items-center gap-4">
        <span className="font-extrabold text-sky-700 whitespace-nowrap">Soal {currentIndex + 1} / {questions.length}</span>
        <div className="w-full h-4 bg-sky-50 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(14,165,233,0.4)] border-4 border-white ring-8 ring-sky-100/50 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-sky-300 via-blue-300 to-sky-300 opacity-80"></div>
        {type === 'tebak_gambar' && currentQ.image_path && (
          <img 
            src={`${STORAGE_URL}/${currentQ.image_path}`} 
            alt="Tebak Gambar" 
            className="max-h-72 mx-auto rounded-xl object-contain mb-6 shadow-sm border-2 border-gray-100"
          />
        )}
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight leading-snug mt-4">
          {currentQ.question_text || "Tebak apa yang ada di gambar ini!"}
        </h2>
      </motion.div>

      {/* Choices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentQ.choices.map((choice: any) => {
          const isSelected = selectedChoiceId === choice.id;
          let bgColor = "bg-white hover:bg-sky-50 border-sky-100 text-gray-700 shadow-sm";
          let animation = {};

          if (selectedChoiceId !== null) {
            if (isSelected) {
              if (feedback === 'correct') {
                bgColor = "bg-green-100 border-green-500 text-green-800 scale-105 shadow-xl shadow-green-200/50";
                animation = { scale: [1, 1.1, 1.05] };
              } else {
                bgColor = "bg-red-100 border-red-500 text-red-800 shadow-xl shadow-red-200/50";
                animation = { x: [-10, 10, -10, 10, 0] };
              }
            } else if (choice.is_correct) {
              // Highlight correct answer if user got it wrong
              bgColor = "bg-green-50 border-green-300 text-green-700 opacity-90";
            } else {
              bgColor = "bg-gray-50 border-gray-200 text-gray-400 opacity-40";
            }
          }

          return (
            <motion.button
              key={choice.id}
              disabled={selectedChoiceId !== null}
              animate={animation}
              whileHover={selectedChoiceId === null ? { scale: 1.02, y: -2 } : {}}
              whileTap={selectedChoiceId === null ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(choice)}
              className={`p-6 rounded-[1.5rem] border-4 font-bold text-xl text-center transition-all duration-300 ${bgColor}`}
            >
              <div className="flex items-center justify-center gap-3">
                {isSelected && feedback === 'correct' && <CheckCircle className="w-8 h-8 text-green-500" />}
                {isSelected && feedback === 'wrong' && <XCircle className="w-8 h-8 text-red-500" />}
                {choice.choice_text}
              </div>
            </motion.button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
