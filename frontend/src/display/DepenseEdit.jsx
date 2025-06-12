import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';  // <-- Import toast

const categories = [
  { value: 'food', label: 'Nourriture' },
  { value: 'transport', label: 'Transport' },
  { value: 'health', label: 'Santé' },
  { value: 'other', label: 'Autre' },
];

export default function DepenseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8000/api/depenses/${id}/`)
      .then(res => setForm(res.data))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm(prev =>
      prev
        ? {
            ...prev,
            [name]: name === 'montant' ? Number(value) : value,
          }
        : prev
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form || !id) return;
    try {
      await axios.put(`http://localhost:8000/api/depenses/${id}/`, form, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Dépense modifiée avec succès !');  // <-- toast success
      navigate('/depenses/lists');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error('Erreur lors de la modification : ' + JSON.stringify(error.response.data));  // <-- toast error
      } else if (error instanceof Error) {
        toast.error('Erreur : ' + error.message);  // <-- toast error
      } else {
        toast.error('Erreur inconnue');  // <-- toast error
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-green-500 text-center">Chargement...</div>;
  }

  if (!form) {
    return <div className="p-6 text-red-500 text-center">Dépense introuvable.</div>;
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md space-y-4 border border-green-200 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-center text-green-800 mb-2">✏️ Modifier la dépense</h1>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Titre</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Courses"
            className="p-1.5 rounded border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
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
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 text-sm mb-1">Catégorie</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-1.5 rounded border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
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
            required
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-sm"
        >
          <FaSave className="inline mr-1" /> Enregistrer les modifications
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
