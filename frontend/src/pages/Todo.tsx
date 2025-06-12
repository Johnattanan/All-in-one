import { useState } from 'react';
import { FaSave as SaveIcon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

type TodoForm = {
  title: string;
  description: string;
  date_for: string;
  time_for: string;
  completed: boolean;
};

export default function Todo() {
  const [form, setForm] = useState<TodoForm>({
    title: '',
    description: '',
    date_for: '',
    time_for: '',
    completed: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    const loadingToast = toast.loading('Envoi en cours...');

    try {
      await axios.post('http://localhost:8000/api/todos/', form, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}` // Ajoute cette ligne
      },
      });

      toast.success('✅ Tâche enregistrée avec succès !', { id: loadingToast });

      setForm({ title: '', description: '', date_for: '', time_for: '', completed: false });

      setTimeout(() => {
        navigate('/todos/lists');
      }, 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error('❌ Erreur API : ' + JSON.stringify(error.response.data), { id: loadingToast });
        } else {
          toast.error('📡 Problème réseau : ' + error.message, { id: loadingToast });
        }
      } else if (error instanceof Error) {
        toast.error('❗ Erreur : ' + error.message, { id: loadingToast });
      } else {
        toast.error('🚨 Erreur inconnue', { id: loadingToast });
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-blue-700 mb-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        📝 Gestion des Tâches
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg space-y-4 border border-blue-300 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Champ titre */}
        <div className="flex flex-col">
          <label className="text-indigo-500 font-semibold mb-1 text-sm">Titre</label>
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={form.title}
            onChange={handleChange}
            required
            className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
          />
        </div>

        {/* Champ description */}
        <div className="flex flex-col">
          <label className="text-indigo-500 font-semibold mb-1 text-sm">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none text-sm"
          />
        </div>

        {/* Champ date + heure */}
        <div className="flex gap-2">
          <div className="flex flex-col flex-1">
            <label className="text-indigo-500 font-semibold mb-1 text-sm">Date</label>
            <input
              type="date"
              name="date_for"
              value={form.date_for}
              onChange={handleChange}
              className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-indigo-500 font-semibold mb-1 text-sm">Heure</label>
            <input
              type="time"
              name="time_for"
              value={form.time_for}
              onChange={handleChange}
              className="p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            />
          </div>
        </div>

        {/* Checkbox */}
        <label className="inline-flex items-center gap-2 text-blue-700 text-sm">
          <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
            className="h-4 w-4 rounded border-blue-300 focus:ring-blue-400"
          />
          Terminer
        </label>

        {/* Bouton */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition font-semibold shadow-md text-sm flex items-center justify-center gap-2"
        >
          <SaveIcon /> Enregistrer
        </motion.button>
      </motion.form>
    </motion.div>
  );
}