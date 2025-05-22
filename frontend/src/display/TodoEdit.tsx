import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

type Todo = {
  id: number;
  title: string;
  description: string;
  date_for: string | null;
  time_for: string | null;
  completed: boolean;
};

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.97 },
};

export default function TodoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Todo>(`http://localhost:8000/api/todos/${id}/`)
      .then(res => setForm(res.data))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value, type } = e.target;
    setForm(prev =>
      prev
        ? {
            ...prev,
            [name]: type === 'checkbox'
              ? (e.target as HTMLInputElement).checked
              : value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    try {
      await axios.put<Todo>(`http://localhost:8000/api/todos/${id}/`, form, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Tâche modifiée avec succès !');
      navigate('/todo/lists');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        alert('Erreur lors de la modification : ' + JSON.stringify(error.response.data));
      } else if (error instanceof Error) {
        alert('Erreur : ' + error.message);
      } else {
        alert('Erreur inconnue');
      }
    }
  };

  if (loading) {
    return <motion.div className="p-6 text-blue-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Chargement...</motion.div>;
  }

  if (!form) {
    return <motion.div className="p-6 text-red-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Tâche introuvable.</motion.div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg space-y-4 border border-blue-300 max-w-md w-full"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
      >
        <motion.h2
          className="text-2xl font-bold text-blue-700 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Modifier la tâche
        </motion.h2>
        <div className="flex flex-col">
          <label className="text-indigo-500 font-semibold mb-1 text-sm">Titre</label>
          <motion.input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-indigo-500 font-semibold mb-1 text-sm">Description</label>
          <motion.textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col flex-1">
            <label className="text-indigo-500 font-semibold mb-1 text-sm">Date</label>
            <motion.input
              type="date"
              name="date_for"
              value={form.date_for ?? ''}
              onChange={handleChange}
              className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.21 }}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-indigo-500 font-semibold mb-1 text-sm">Heure</label>
            <motion.input
              type="time"
              name="time_for"
              value={form.time_for ?? ''}
              onChange={handleChange}
              className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.23 }}
            />
          </div>
        </div>
        <motion.label
          className="inline-flex items-center gap-2 text-blue-700 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
            className="h-4 w-4 rounded border-blue-300 focus:ring-blue-400"
          />
          Terminer
        </motion.label>
        <motion.button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition font-semibold shadow-md text-sm"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Enregistrer les modifications
        </motion.button>
      </motion.form>
    </div>
  );
}