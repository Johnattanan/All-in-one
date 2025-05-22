import { useState } from 'react';
import { FaSave as SaveIcon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const buttonHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};

const buttonTap = {
  scale: 0.95,
};

export default function Notes() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/notes/', form, {
        headers: { 'Content-Type': 'application/json' },
      });
      setForm({ title: '', content: '' });
      setEditing(false);
      alert('La note a été ajoutée avec succès !');
      navigate('/notes/lists');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          alert('Erreur lors de la soumission : ' + JSON.stringify(error.response.data));
        } else {
          alert('Erreur réseau : ' + error.message);
        }
      } else if (error instanceof Error) {
        alert('Erreur : ' + error.message);
      } else {
        alert('Erreur inconnue');
      }
    }
  };

  return (
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
        🗒️ Bloc-Notes
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
          {editing ? (
            <>
              <SaveIcon className="inline" /> Mettre à jour
            </>
          ) : (
            'Ajouter la note'
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}