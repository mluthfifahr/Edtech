import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  description: string;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openModal = (subject: Subject | null = null) => {
    if (subject) {
      setEditingSubject(subject);
      setName(subject.name);
      setDescription(subject.description || '');
    } else {
      setEditingSubject(null);
      setName('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await api.put(`/admin/subjects/${editingSubject.id}`, { name, description });
      } else {
        await api.post('/admin/subjects', { name, description });
      }
      closeModal();
      fetchSubjects();
    } catch (err) {
      console.error('Failed to save subject', err);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus mata pelajaran ini? Semua modul dan soal di dalamnya akan ikut terhapus!')) {
      try {
        await api.delete(`/admin/subjects/${id}`);
        fetchSubjects();
      } catch (err) {
        console.error('Failed to delete', err);
        alert('Gagal menghapus data');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mata Pelajaran</h2>
          <p className="mt-1 text-sm text-gray-500">Kelola daftar mata pelajaran untuk platform EdTech.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Mata Pelajaran
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{subject.name}</td>
                  <td className="px-6 py-4 text-gray-500">{subject.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(subject)} className="text-purple-600 hover:text-purple-900 mr-4 p-2 hover:bg-purple-50 rounded-full transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <p className="text-gray-500 mb-2">Belum ada mata pelajaran.</p>
                    <button onClick={() => openModal()} className="text-purple-600 font-medium hover:underline">Buat yang pertama</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-gray-100">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-5">{editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-shadow outline-none"
                  placeholder="Contoh: Ilmu Pengetahuan Alam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-shadow outline-none resize-none"
                  rows={3}
                  placeholder="Penjelasan singkat mengenai materi..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
