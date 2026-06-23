import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

// Dummy data
const mockQuestion = {
  id: 1,
  text: "Hewan apa yang memiliki belalai panjang?",
  image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=400&h=300",
  choices: [
    { id: 'A', text: "Jerapah", isCorrect: false },
    { id: 'B', text: "Gajah", isCorrect: true },
    { id: 'C', text: "Kucing", isCorrect: false },
    { id: 'D', text: "Sapi", isCorrect: false },
  ]
};

export default function Quiz() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (choice: { id: string; text: string; isCorrect: boolean }) => {
    if (isAnswered) return;
    
    setSelectedId(choice.id);
    setIsAnswered(true);
    setIsCorrect(choice.isCorrect);
  };

  return (
    <div className="w-full max-w-2xl">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white/80 backdrop-blur-sm"
      >
        <div className="p-8 text-center bg-blue-50/80">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 drop-shadow-sm">{mockQuestion.text}</h2>
          
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            src={mockQuestion.image} 
            alt="Question" 
            className="w-full h-64 object-cover rounded-3xl shadow-lg border-4 border-white mb-2"
          />
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 bg-white">
          {mockQuestion.choices.map((choice) => {
            const isSelected = selectedId === choice.id;
            const isWrongAnswer = isAnswered && isSelected && !choice.isCorrect;
            const isRightAnswer = isAnswered && choice.isCorrect;

            let bgColor = "bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100 hover:border-sky-300";
            if (isRightAnswer) bgColor = "bg-green-500 border-green-600 text-white shadow-green-200";
            else if (isWrongAnswer) bgColor = "bg-red-500 border-red-600 text-white shadow-red-200";

            return (
              <motion.button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                whileHover={!isAnswered ? { scale: 1.03 } : {}}
                whileTap={!isAnswered ? { scale: 0.95 } : {}}
                animate={isWrongAnswer ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`relative px-6 py-5 rounded-2xl border-b-[6px] font-bold text-xl transition-colors shadow-sm flex items-center justify-between outline-none ${bgColor}`}
                disabled={isAnswered}
              >
                <span>{choice.text}</span>
                <AnimatePresence>
                  {isRightAnswer && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-600 rounded-full p-1 shadow-inner">
                      <Check className="text-white w-6 h-6" strokeWidth={3} />
                    </motion.div>
                  )}
                  {isWrongAnswer && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-red-600 rounded-full p-1 shadow-inner">
                      <X className="text-white w-6 h-6" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback Section */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`p-8 text-center border-t-4 ${isCorrect ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}
            >
              <motion.h3 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="text-3xl font-extrabold mb-4"
              >
                {isCorrect ? "Hebat! Jawabanmu Benar! 🎉" : "Ups, Coba Lagi Nanti! 😢"}
              </motion.h3>
              <button 
                onClick={() => window.location.reload()}
                className={`mt-2 px-10 py-4 rounded-2xl font-bold text-xl text-white border-b-[6px] transition-transform hover:scale-105 active:scale-95 shadow-lg ${
                  isCorrect ? 'bg-green-500 border-green-700 hover:bg-green-400' : 'bg-orange-500 border-orange-700 hover:bg-orange-400'
                }`}
              >
                Lanjut Soal Berikutnya
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
