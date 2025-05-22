import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaStickyNote, FaPlus, FaSearch, FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import axios from 'axios';

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/notes/');
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setNotes(data);
    } catch {
      setNotes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer cette note ?')) {
      await axios.delete(`http://localhost:8000/api/notes/${id}/`);
      setNotes(notes => notes.filter(note => note.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/notes/${id}`);
  };

  // Filtrage par mot clé
  const filteredNotes = notes.filter(note => {
    const keyword = search.trim().toLowerCase();
    return (
      keyword === '' ||
      note.title.toLowerCase().includes(keyword) ||
      note.content.toLowerCase().includes(keyword)
    );
  });

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Liste des notes', 10, 15);
    let y = 25;
    filteredNotes.forEach((note, idx) => {
      doc.setFontSize(13);
      doc.text(`${idx + 1}. ${note.title}`, 10, y);
      y += 7;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(note.content, 180);
      doc.text(lines, 12, y);
      y += lines.length * 6 + 4;
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });
    doc.save('notes.pdf');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-yellow-700 mb-2 flex items-center gap-2"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <FaStickyNote className="text-yellow-400" /> Mes Notes
      </motion.h1>

      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaSearch className="text-yellow-400" />
          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-yellow-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-48"
          />
        </div>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          <FaFilePdf className="text-white" /> Exporter PDF
        </button>
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlus className="text-white" /> Créer une note
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white/90 rounded-xl shadow-lg p-6 border border-yellow-200">
        {loading ? (
          <div className="text-yellow-500 text-center py-10">Chargement...</div>
        ) : (
          <AnimatePresence>
            {filteredNotes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-gray-400 text-center py-10"
              >
                Aucune note pour le moment.
              </motion.div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="py-2 text-left">Titre</th>
                    <th className="py-2 text-left">Contenu</th>
                    <th className="py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.map(note => (
                    <motion.tr
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-b border-yellow-100 hover:bg-yellow-50 transition"
                    >
                      <td className="py-2 font-semibold">{note.title}</td>
                      <td className="py-2 truncate max-w-[200px]">{note.content}</td>
                      <td className="py-2 flex gap-2">
                        <button
                          className="p-1 rounded hover:bg-yellow-100 text-yellow-600"
                          title="Éditer"
                          onClick={() => handleEdit(note.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                          onClick={() => handleDelete(note.id)}
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