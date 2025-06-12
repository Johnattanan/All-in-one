import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';  // <-- import toast

type Note = {
  id: number;
  title: string;
  content: string;
};

const buttonHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};

const buttonTap = {
  scale: 0.95,
};

export default function NoteEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Note>(`http://localhost:8000/api/notes/${id}/`)
      .then(res => setForm(res.data))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    try {
      await axios.put<Note>(`http://localhost:8000/api/notes/${id}/`, form, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Note modifiée avec succès !');  // <-- toast succès
      navigate('/notes/lists');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        toast.error('Erreur lors de la modification : ' + JSON.stringify(error.response.data)); // <-- toast erreur
      } else if (error instanceof Error) {
        toast.error('Erreur : ' + error.message);
      } else {
        toast.error('Erreur inconnue');
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-yellow-500 text-center">Chargement...</div>;
  }

  if (!form) {
    return <div className="p-6 text-red-500 text-center">Note introuvable.</div>;
  }

  return (
    <>
      {/* Toaster à placer ici ou dans App.tsx si tu préfères global */}
      <Toaster position="top-right" />

      <motion.div
        className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 p-6 flex flex-col justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold text-yellow-700 mb-8 text-center select-none"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          🗒️ Modifier la note
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm border border-yellow-300 rounded-3xl shadow-lg p-6 max-w-lg w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            name="title"
            placeholder="Titre de la note"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-5 border border-yellow-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 placeholder-yellow-600 transition"
            required
          />
          <textarea
            name="content"
            placeholder="Contenu de la note"
            value={form.content}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-5 border border-yellow-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 placeholder-yellow-600 transition"
            rows={4}
          />
          <motion.button
            type="submit"
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="bg-yellow-500 text-white font-semibold px-5 py-2 rounded-2xl shadow-md hover:bg-yellow-600 transition-all w-full flex items-center justify-center gap-2 select-none"
          >
            <FaSave className="inline" /> Enregistrer les modifications
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}
