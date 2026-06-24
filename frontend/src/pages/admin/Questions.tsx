import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/axios';
import { Plus, Trash2, Image as ImageIcon, CheckCircle, X, ArrowLeft, List, Edit2 } from 'lucide-react';

const STORAGE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '/storage') 
  : 'http://localhost:8000/storage';

interface Subject {
  id: number;
  name: string;
}

interface Choice {
  id?: number;
  choice_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  subject_id: number;
  type: 'quiz' | 'tebak_gambar';
  question_text: string | null;
  image_path: string | null;
  subject: Subject;
  choices: Choice[];
}

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('');
  
  // State untuk memisahkan view (null = Pilih Mode, 'quiz' = Kuis, 'tebak_gambar' = Tebak Gambar)
  const [selectedType, setSelectedType] = useState<'quiz' | 'tebak_gambar' | null>(null);
  
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [subjectId, setSubjectId] = useState<string>('');
  const [type, setType] = useState<'quiz' | 'tebak_gambar'>('quiz');
  const [questionText, setQuestionText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [choices, setChoices] = useState<Choice[]>([
    { choice_text: '', is_correct: true },
    { choice_text: '', is_correct: false },
    { choice_text: '', is_correct: false },
    { choice_text: '', is_correct: false },
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, sRes] = await Promise.all([
        api.get(`/admin/questions${selectedSubjectFilter ? `?subject_id=${selectedSubjectFilter}` : ''}`),
        api.get('/admin/subjects')
      ]);
      setQuestions(qRes.data);
      setSubjects(sRes.data);
      if (!subjectId && sRes.data.length > 0) setSubjectId(String(sRes.data[0].id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSubjectFilter]);

  const openModal = (question: Question | null = null) => {
    setEditingQuestion(question);
    if (question) {
      setType(question.type);
      setSubjectId(String(question.subject_id));
      setQuestionText(question.question_text || '');
      setImageFile(null);
      
      if (question.choices && question.choices.length > 0) {
        setChoices(question.choices);
      } else {
        setChoices([
          { choice_text: '', is_correct: true },
          { choice_text: '', is_correct: false },
          { choice_text: '', is_correct: false },
          { choice_text: '', is_correct: false },
        ]);
      }
    } else {
      // Set default form type sesuai dengan mode yang sedang dibuka
      setType(selectedType || 'quiz');
      setSubjectId('');
      setQuestionText('');
      setImageFile(null);
      setChoices([
        { choice_text: '', is_correct: true },
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
      ]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChoiceChange = (index: number, field: keyof Choice, value: any) => {
    const newChoices = [...choices];
    if (field === 'is_correct') {
      newChoices.forEach(c => c.is_correct = false);
      newChoices[index].is_correct = true;
    } else {
      newChoices[index].choice_text = value;
    }
    setChoices(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return alert('Pilih mata pelajaran dulu');

    const formData = new FormData();
    formData.append('subject_id', subjectId);
    formData.append('type', type);
    if (questionText) formData.append('question_text', questionText);
    if (imageFile) formData.append('image', imageFile);

    choices.forEach((choice, index) => {
      formData.append(`choices[${index}][choice_text]`, choice.choice_text);
      formData.append(`choices[${index}][is_correct]`, String(choice.is_correct));
    });

    try {
      if (editingQuestion) {
        formData.append('_method', 'PUT');
        await api.post(`/admin/questions/${editingQuestion.id}`, formData);
      } else {
        await api.post('/admin/questions', formData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan soal');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin hapus soal ini?')) {
      await api.delete(`/admin/questions/${id}`);
      fetchData();
    }
  };

  // UI Modal (Selalu tersedia)
  const Modal = isModalOpen && (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative my-8">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingQuestion ? 'Edit Soal' : 'Buat Soal Baru'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
              <select 
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value="" disabled>Pilih Mapel...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Soal</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value="quiz">Kuis Pilihan Ganda</option>
                <option value="tebak_gambar">Tebak Gambar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pertanyaan {type === 'tebak_gambar' && '(Opsional)'}
            </label>
            <textarea
              required={type === 'quiz'}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none outline-none"
              rows={3}
              placeholder={type === 'tebak_gambar' ? "Biarkan kosong jika ingin pakai default..." : "Tuliskan pertanyaan kuis di sini..."}
            />
          </div>

          {type === 'tebak_gambar' && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Upload Gambar Ilustrasi</label>
              <input
                type="file"
                required={!editingQuestion && type === 'tebak_gambar'}
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Pilihan Jawaban (Tandai yang benar)</label>
            <div className="space-y-3">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={choice.is_correct}
                    onChange={() => handleChoiceChange(index, 'is_correct', true)}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={choice.choice_text}
                    onChange={(e) => handleChoiceChange(index, 'choice_text', e.target.value)}
                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Batal
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors">
              Simpan Soal
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Jika belum memilih mode
  if (selectedType === null) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bank Soal</h2>
            <p className="mt-1 text-sm text-gray-500">Pilih tipe soal yang ingin Anda kelola.</p>
          </div>
          <button onClick={() => openModal(null)} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 shadow-sm">
            <Plus className="w-5 h-5 mr-2" /> Buat Soal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => setSelectedType('quiz')}
            className="bg-white rounded-2xl p-8 border-2 border-purple-50 hover:border-purple-300 cursor-pointer shadow-sm hover:shadow-lg transition-all flex items-center gap-6 group"
          >
            <div className="bg-purple-50 p-4 rounded-xl group-hover:bg-purple-100 transition-colors">
              <List className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Kuis Pilihan Ganda</h3>
              <p className="text-gray-500 text-sm mt-1">Kelola soal berbasis teks.</p>
            </div>
          </div>

          <div 
            onClick={() => setSelectedType('tebak_gambar')}
            className="bg-white rounded-2xl p-8 border-2 border-fuchsia-50 hover:border-fuchsia-300 cursor-pointer shadow-sm hover:shadow-lg transition-all flex items-center gap-6 group"
          >
            <div className="bg-fuchsia-50 p-4 rounded-xl group-hover:bg-fuchsia-100 transition-colors">
              <ImageIcon className="w-8 h-8 text-fuchsia-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fuchsia-700 transition-colors">Tebak Gambar</h3>
              <p className="text-gray-500 text-sm mt-1">Kelola soal berbasis ilustrasi.</p>
            </div>
          </div>
        </div>

        {Modal}
      </div>
    );
  }

  // Jika sudah memilih mode, tampilkan daftar yang ukurannya lebih kecil/compact
  const filteredQuestions = questions.filter(q => q.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedType(null)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedType === 'quiz' ? 'Kuis Pilihan Ganda' : 'Tebak Gambar'}
            </h2>
          </div>
        </div>
        <button onClick={() => openModal(null)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 shadow-sm text-sm">
          <Plus className="w-4 h-4 mr-2" /> Buat Soal
        </button>
      </div>

      <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-fit">
        <label className="text-sm font-medium text-gray-700 mr-3">Filter Mapel:</label>
        <select 
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border bg-gray-50"
        >
          <option value="">Semua Mapel</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {q.image_path && (
                <div className="h-32 bg-gray-100 relative">
                  <img src={`${STORAGE_URL}/${q.image_path}`} alt="Soal" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {q.subject?.name}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(q)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 leading-snug">
                  {q.question_text || 'Tebak Gambar Ini!'}
                </h4>
                
                <div className="space-y-1.5 mt-auto">
                  {q.choices.map((c, i) => (
                    <div key={i} className={`flex items-center text-xs p-1.5 rounded-md border ${c.is_correct ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                      {c.is_correct && <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-1.5 flex-shrink-0" />}
                      <span className={c.is_correct ? 'text-green-700 font-semibold' : 'text-gray-500 font-medium ml-5 line-clamp-1'}>
                        {c.choice_text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filteredQuestions.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-400 text-sm mb-2">Belum ada soal untuk mode ini.</p>
              <button onClick={() => openModal()} className="text-purple-600 font-medium text-sm hover:underline">Tambahkan sekarang</button>
            </div>
          )}
        </div>
      )}
      
      {Modal}
    </div>
  );
}
