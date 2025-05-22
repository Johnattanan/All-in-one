import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle, FaFilter, FaPlus, FaSearch, FaFileExcel } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import axios from 'axios';

type Todo = {
  id: number;
  title: string;
  description: string;
  date_for: string | null;
  time_for: string | null;
  completed: boolean;
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const buttonVariants = {
  hover: { scale: 1.08 },
  tap: { scale: 0.95 },
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/todos/');
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setTodos(data);
    } catch {
      setTodos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Filtrage selon le status sélectionné et le mot clé
  const filteredTodos = todos.filter(todo => {
    const matchStatus =
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed);

    const keyword = search.trim().toLowerCase();
    const matchSearch =
      keyword === '' ||
      todo.title.toLowerCase().includes(keyword) ||
      (todo.description && todo.description.toLowerCase().includes(keyword));

    return matchStatus && matchSearch;
  });

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredTodos.map(todo => ({
      Titre: todo.title,
      Description: todo.description,
      'Date pour': todo.date_for ?? '',
      Heure: todo.time_for ?? '',
      Statut: todo.completed ? 'Terminée' : 'En cours',
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tâches');
    XLSX.writeFile(workbook, 'taches.xlsx');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer cette tâche ?')) {
      await axios.delete(`http://localhost:8000/api/todos/${id}/`);
      setTodos(todos => todos.filter(todo => todo.id !== id));
    }
  };

  const handleToggle = async (todo: Todo) => {
    await axios.patch(`http://localhost:8000/api/todos/${todo.id}/`, {
      completed: !todo.completed,
    });
    setTodos(todos =>
      todos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleEdit = (id: number) => {
    navigate(`/todos/${id}`);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <FaCheckCircle className="text-blue-400" /> Mes Tâches
      </motion.h1>

      {/* Filtres */}
      <motion.div
        className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-2 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <FaFilter className="text-blue-400" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
            className="border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">Toutes</option>
            <option value="completed">Terminées</option>
            <option value="pending">En cours</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaSearch className="text-blue-400" />
          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-48"
          />
        </div>
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          <FaFileExcel className="text-white" /> Exporter Excel
        </button>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/todos"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FaPlus className="text-white" /> Créer une tâche
          </Link>
        </motion.div>
      </motion.div>

      <div className="w-full max-w-2xl bg-white/90 rounded-xl shadow-lg p-6 border border-blue-200">
        {loading ? (
          <motion.div
            className="text-blue-500 text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Chargement...
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredTodos.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-gray-400 text-center py-10"
              >
                Aucune tâche pour le moment.
              </motion.div>
            ) : (
              <motion.table
                className="w-full text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <thead>
                  <tr>
                    <th className="py-2 text-left">Statut</th>
                    <th className="py-2 text-left">Titre</th>
                    <th className="py-2 text-left">Date Pour</th>
                    <th className="py-2 text-left">Heure</th>
                    <th className="py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredTodos.map(todo => (
                      <motion.tr
                        key={todo.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="border-b border-blue-100 hover:bg-blue-50 transition"
                      >
                        <td className="py-2">
                          <motion.button
                            onClick={() => handleToggle(todo)}
                            className="focus:outline-none"
                            title={todo.completed ? "Marquer comme non terminée" : "Marquer comme terminée"}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            {todo.completed ? (
                              <FaCheckCircle className="text-green-500 text-lg" />
                            ) : (
                              <FaRegCircle className="text-gray-400 text-lg" />
                            )}
                          </motion.button>
                        </td>
                        <td className={`py-2 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                          <span className="font-semibold">{todo.title}</span>
                          <div className="text-xs text-gray-500">{todo.description}</div>
                        </td>
                        <td className="py-2">
                          {todo.date_for ? (
                            <span>
                              {todo.date_for}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="py-2">
                          {todo.time_for ? (
                            <span>
                              {todo.time_for.slice(0, 5)}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="py-2 flex gap-2">
                          <motion.button
                            className="p-1 rounded hover:bg-blue-100 text-blue-600"
                            title="Éditer"
                            onClick={() => handleEdit(todo.id)}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            className="p-1 rounded hover:bg-red-100 text-red-600"
                            onClick={() => handleDelete(todo.id)}
                            title="Supprimer"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}