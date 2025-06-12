import { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const categories = [
  { value: 'food', label: 'Nourriture' },
  { value: 'transport', label: 'Transport' },
  { value: 'health', label: 'Santé' },
  { value: 'other', label: 'Autre' },
];

export default function Depense() {
  const [form, setForm] = useState({
    title: '',
    montant: 0,
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'montant' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/depenses/', form, {
        headers: { 'Content-Type': 'application/json' },
      });
      setForm({
        title: '',
        montant: 0,
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      toast.success('✅ Dépense enregistrée avec succès !');
      setTimeout(() => navigate('/depenses/lists'), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          toast.error('❌ Erreur : ' + JSON.stringify(error.response.data));
        } else {
          toast.error('❌ Erreur réseau : ' + error.message);
        }
      } else if (error instanceof Error) {
        toast.error('❌ Erreur : ' + error.message);
      } else {
        toast.error('❌ Erreur inconnue');
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-right" />
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md space-y-4 border border-green-200 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-center text-green-800 mb-2">💰 Dépenses</h1>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Titre</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Courses"
            className="p-1.5 rounded border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Montant (Ariary)</label>
          <input
            type="number"
            name="montant"
            value={form.montant}
            onChange={handleChange}
            className="p-1.5 rounded border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            min="0"
            step="100"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Catégorie</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-1.5 rounded border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="Ex: Achats au marché"
            className="p-1.5 rounded border border-green-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-1.5 rounded border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-sm"
        >
          <FaSave className="inline mr-1" /> Enregistrer
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
