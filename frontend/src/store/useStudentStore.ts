import { create } from 'zustand';

interface StudentState {
  studentName: string;
  studentClass: string;
  points: number;
  currentScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  setStudentName: (name: string) => void;
  setStudentClass: (className: string) => void;
  addPoints: (amount: number) => void;
  updateGameplayStats: (score: number, correct: boolean) => void;
  resetGameplayStats: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  studentName: '',
  studentClass: '',
  points: 0,
  currentScore: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  
  setStudentName: (name) => set({ studentName: name }),
  setStudentClass: (className) => set({ studentClass: className }),
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
  updateGameplayStats: (score, correct) => set((state) => ({
    currentScore: state.currentScore + score,
    correctAnswers: state.correctAnswers + (correct ? 1 : 0),
    wrongAnswers: state.wrongAnswers + (!correct ? 1 : 0)
  })),
  resetGameplayStats: () => set({ currentScore: 0, correctAnswers: 0, wrongAnswers: 0 })
}));
