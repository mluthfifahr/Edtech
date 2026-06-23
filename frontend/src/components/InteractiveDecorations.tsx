import { Star, Sparkles, Rocket, Compass, Music, Cloud, Sun, Trophy, Gamepad2, Smile, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InteractiveDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Kumpulan ikon-ikon interaktif yang bisa di drag (Diperbesar & Ditambah) */}
      
      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: 15 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute top-[10%] left-[5%] text-yellow-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Star className="w-24 h-24 fill-yellow-400 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: -15 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute top-[35%] right-[5%] text-purple-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Music className="w-20 h-20 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: 45 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute bottom-[15%] left-[5%] text-pink-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Sparkles className="w-24 h-24 fill-pink-400 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: 20 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute top-[25%] right-[15%] text-emerald-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Compass className="w-20 h-20 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: -10 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute bottom-[25%] right-[10%] text-sky-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Rocket className="w-24 h-24 fill-sky-200 drop-shadow-xl" />
      </motion.div>

      {/* Tambahan Baru */}
      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: 30 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute top-[50%] left-[10%] text-orange-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Sun className="w-20 h-20 fill-orange-300 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: -25 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute bottom-[40%] right-[18%] text-yellow-500 cursor-grab active:cursor-grabbing p-4"
      >
        <Trophy className="w-20 h-20 fill-yellow-300 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: 15 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute top-[15%] left-[25%] text-indigo-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Gamepad2 className="w-20 h-20 drop-shadow-xl" />
      </motion.div>

      <motion.div 
        drag 
        whileDrag={{ scale: 1.2, rotate: -15 }} 
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto absolute bottom-[10%] left-[25%] text-teal-400 cursor-grab active:cursor-grabbing p-4"
      >
        <Zap className="w-20 h-20 fill-teal-400 drop-shadow-xl" />
      </motion.div>

      {/* Awan melayang di latar yang tidak bisa didrag, murni animasi */}
      <motion.div 
        animate={{ x: [0, 60, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[10%] text-white/60 -z-10"
      >
        <Cloud className="w-40 h-40 fill-white" />
      </motion.div>
      <motion.div 
        animate={{ x: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[30%] text-white/60 -z-10"
      >
        <Cloud className="w-32 h-32 fill-white" />
      </motion.div>
    </div>
  );
}
