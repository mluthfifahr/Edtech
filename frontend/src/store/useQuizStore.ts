import { create } from 'zustand';
import { api } from '../api/axios';

interface Choice {
  id: string | number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  image: string;
  choices: Choice[];
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isLoading: boolean;
  error: string | null;
  fetchQuestions: (moduleId: number) => Promise<void>;
  submitAnswer: (questionId: number, isCorrect: boolean) => Promise<void>;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  isLoading: false,
  error: null,

  fetchQuestions: async (moduleId: number) => {
    set({ isLoading: true, error: null });
    try {
      // CONTOH NYATA PENGGUNAAN API:
      // const response = await api.get(`/student/questions/${moduleId}`);
      // set({ questions: response.data.data, isLoading: false });
      
      // Simulasi karena DB Backend saat ini masih kosong:
      setTimeout(() => {
        set({
          questions: [
            {
              id: 1,
              text: "Hewan apa yang memiliki belalai panjang?",
              image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=400&h=300",
              choices: [
                { id: 'A', text: "Jerapah", isCorrect: false },
                { id: 'B', text: "Gajah", isCorrect: true },
                { id: 'C', text: "Kucing", isCorrect: false },
                { id: 'D', text: "Sapi", isCorrect: false },
              ]
            }
          ],
          isLoading: false
        });
      }, 500);

    } catch (err: any) {
      set({ error: err.message || 'Gagal memuat soal', isLoading: false });
    }
  },

  submitAnswer: async (questionId: number, isCorrect: boolean) => {
    try {
      // PENGGUNAAN API: Mengirim laporan bahwa user berhasil/gagal menjawab
      // await api.post('/student/submit-answer', { question_id: questionId, is_correct: isCorrect });
      
      if (isCorrect) {
        set((state) => ({ score: state.score + 10 }));
      }
    } catch (err) {
      console.error("Gagal mengirim jawaban", err);
    }
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1
    }));
  },

  resetQuiz: () => {
    set({ currentQuestionIndex: 0, score: 0 });
  }
}));
