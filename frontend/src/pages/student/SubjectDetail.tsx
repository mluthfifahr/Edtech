import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { motion } from 'framer-motion';
import { Gamepad2, Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await api.get(`/student/subjects/${id}`);
        setSubject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
      <p className="text-sky-600 font-bold text-lg">Mempersiapkan Arena Bermain...</p>
    </div>
  );

  if (!subject) return <div className="text-center py-20 text-red-500 font-bold text-xl">Mata Pelajaran Tidak Ditemukan! 🥺</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sky-600 hover:text-sky-800 font-bold bg-white px-5 py-2.5 rounded-full shadow-sm w-fit transition-transform hover:-translate-x-1 border-2 border-sky-100"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
      </button>

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 tracking-tight">{subject.name}</h1>
        <p className="text-lg md:text-xl text-sky-600 font-bold">Pilih mode permainan yang kamu inginkan!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/student/play/${id}?type=quiz`)}
          className="bg-white rounded-[2rem] p-8 shadow-md border-4 border-orange-100 cursor-pointer hover:border-orange-400 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors shadow-inner mb-6">
            <Gamepad2 className="w-16 h-16 text-orange-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 mb-3">Kuis Teks</h3>
          <p className="text-gray-500 font-medium mb-8 text-lg">Uji pengetahuanmu dengan menjawab pertanyaan seru!</p>
          <button className="mt-auto w-full py-4 bg-orange-100 text-orange-700 font-extrabold text-xl rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
            Main Kuis!
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/student/play/${id}?type=tebak_gambar`)}
          className="bg-white rounded-[2rem] p-8 shadow-md border-4 border-fuchsia-100 cursor-pointer hover:border-fuchsia-400 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="w-32 h-32 bg-fuchsia-100 rounded-full flex items-center justify-center group-hover:bg-fuchsia-200 transition-colors shadow-inner mb-6">
            <ImageIcon className="w-16 h-16 text-fuchsia-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 mb-3">Tebak Gambar</h3>
          <p className="text-gray-500 font-medium mb-8 text-lg">Lihat gambarnya dan tebak jawaban yang paling tepat!</p>
          <button className="mt-auto w-full py-4 bg-fuchsia-100 text-fuchsia-700 font-extrabold text-xl rounded-2xl group-hover:bg-fuchsia-500 group-hover:text-white transition-colors shadow-sm">
            Main Tebak Gambar!
          </button>
        </motion.div>
      </div>
    </div>
  );
}
