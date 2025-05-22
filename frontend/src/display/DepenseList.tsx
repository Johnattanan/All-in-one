import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaMoneyBillWave, FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import axios from 'axios';

type Depense = {
  id: number;
  title: string;
  montant: number;
  category: string;
  description: string;
  date: string;
};

const categories: Record<string, string> = {
  food: 'Nourriture',
  transport: 'Transport',
  health: 'Santé',
  other: 'Autre',
};

export default function DepenseList() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const fetchDepenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/depenses/');
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDepenses(data);
    } catch {
      setDepenses([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepenses();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer cette dépense ?')) {
      await axios.delete(`http://localhost:8000/api/depenses/${id}/`);
      setDepenses(depenses => depenses.filter(dep => dep.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/depenses/${id}`);
  };

  // Filtrage par catégorie et recherche par mot clé
  const filteredDepenses = depenses.filter(dep => {
    const matchCategory = categoryFilter === 'all' || dep.category === categoryFilter;
    const keyword = search.trim().toLowerCase();
    const matchSearch =
      dep.title.toLowerCase().includes(keyword) ||
      dep.description.toLowerCase().includes(keyword) ||
      categories[dep.category]?.toLowerCase().includes(keyword) ||
      dep.montant.toString().includes(keyword);
    return matchCategory && (keyword === '' || matchSearch);
  });

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredDepenses.map(dep => ({
      Titre: dep.title,
      Montant: dep.montant + ' Ariary',
      Catégorie: categories[dep.category] || dep.category,
      Description: dep.description,
      Date: dep.date,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dépenses');
    XLSX.writeFile(workbook, 'depenses.xlsx');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-green-700 mb-2 flex items-center gap-2"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <FaMoneyBillWave className="text-green-400" /> Mes Dépenses
      </motion.h1>

      {/* Filtres */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-green-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-green-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">Toutes les catégories</option>
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaSearch className="text-green-400" />
          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-green-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full sm:w-48"
          />
        </div>
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Exporter Excel
        </button>
        <Link
          to="/depenses"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlus className="text-white" /> Nouvelle dépense
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white/90 rounded-xl shadow-lg p-6 border border-green-200">
        {loading ? (
          <div className="text-green-500 text-center py-10">Chargement...</div>
        ) : (
          <AnimatePresence>
            {filteredDepenses.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-gray-400 text-center py-10"
              >
                Aucune dépense pour le moment.
              </motion.div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="py-2 text-left">Titre</th>
                    <th className="py-2 text-left">Montant</th>
                    <th className="py-2 text-left">Catégorie</th>
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepenses.map(dep => (
                    <motion.tr
                      key={dep.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-b border-green-100 hover:bg-green-50 transition"
                    >
                      <td className="py-2 font-semibold">{dep.title}</td>
                      <td className="py-2">{dep.montant} <strong>Ariary</strong> </td>
                      <td className="py-2">{categories[dep.category] || dep.category}</td>
                      <td className="py-2">{dep.date}</td>
                      <td className="py-2 flex gap-2">
                        <button
                          className="p-1 rounded hover:bg-green-100 text-green-600"
                          title="Éditer"
                          onClick={() => handleEdit(dep.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                          onClick={() => handleDelete(dep.id)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}