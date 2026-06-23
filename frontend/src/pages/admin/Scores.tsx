import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Subject {
  id: number;
  name: string;
}

interface StudentScore {
  id: number;
  student_name: string;
  student_class: string;
  subject_id: number;
  type: string;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  created_at: string;
  subject: Subject;
}

export default function Scores() {
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await api.get('/admin/scores');
      setScores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Daftar Nilai Siswa</h2>
        <p className="mt-1 text-sm text-gray-500">Pantau perolehan poin dan hasil belajar anak-anak.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data nilai...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tanggal Main
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Siswa
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Mata Pelajaran
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Benar / Salah
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Poin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scores.map((score) => (
                  <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(score.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{score.student_name}</div>
                      <div className="text-sm text-gray-500">{score.student_class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{score.subject?.name || '-'}</div>
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                        score.type === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-fuchsia-100 text-fuchsia-800'
                      }`}>
                        {score.type === 'quiz' ? 'Kuis' : 'Tebak Gambar'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className="text-green-600 font-bold">{score.correct_answers}</span>
                      <span className="text-gray-300 mx-2">/</span>
                      <span className="text-red-500 font-bold">{score.wrong_answers}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-purple-600">
                      <div className="flex items-center justify-end gap-1.5">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        {score.score}
                      </div>
                    </td>
                  </tr>
                ))}
                {scores.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Belum ada siswa yang menyelesaikan kuis.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
