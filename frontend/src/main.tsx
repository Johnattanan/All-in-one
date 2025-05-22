import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Todo from './pages/Todo'
import Notes from './pages/Note'
import Depenses from './pages/Depense'
import TodoList from './display/TodoList'
import TodoEdit from './display/TodoEdit'
import NoteList from './display/NoteList'
import NoteEdit from './display/NoteEdit'
import DepenseList from './display/DepenseList'
import DepenseEdit from './display/DepenseEdit'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Accueil */}
        <Route path="/" element={<Home />} />

        {/* Todo */}
        <Route path="/todos" element={<Todo />} />                {/* Création */}
        <Route path="/todos/lists" element={<TodoList />} />       {/* Liste */}
        <Route path="/todos/:id" element={<TodoEdit />} />        {/* Edition */}

        {/* Notes */}
        <Route path="/notes" element={<Notes />} />              {/* Création */}
        <Route path="/notes/lists" element={<NoteList />} />      {/* Liste */}
        <Route path="/notes/:id" element={<NoteEdit />} />       {/* Edition */}

        {/* Dépenses */}
        <Route path="/depenses" element={<Depenses />} />        {/* Création */}
        <Route path="/depenses/lists" element={<DepenseList />} />{/* Liste */}
        <Route path="/depenses/:id" element={<DepenseEdit />} /> {/* Edition */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)