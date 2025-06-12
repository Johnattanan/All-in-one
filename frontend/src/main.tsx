import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Todo from './pages/Todo'
import Notes from './pages/Note'
import LoginForm from './pages/Login'
import Depenses from './pages/Depense'
import TodoList from './display/TodoList'
import TodoEdit from './display/TodoEdit'
import NoteList from './display/NoteList'
import NoteEdit from './display/NoteEdit'
import DepenseList from './display/DepenseList'
import DepenseEdit from './display/DepenseEdit'
import './App.css'
import { Toaster } from 'react-hot-toast'
import Sign from './pages/Sign'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginForm/>} />
        <Route path="/register" element={<Sign />} />
        {/* Accueil */}
        <Route path="/acceuil" element={<Home />} />

        {/* Todo */}
        <Route path="/todos" element={<Todo />} />
        <Route path="/todos/lists" element={<TodoList />} />
        <Route path="/todos/:id" element={<TodoEdit />} />

        {/* Notes */}
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/lists" element={<NoteList />} />
        <Route path="/notes/:id" element={<NoteEdit />} />

        {/* Dépenses */}
        <Route path="/depenses" element={<Depenses />} />
        <Route path="/depenses/lists" element={<DepenseList />} />
        <Route path="/depenses/:id" element={<DepenseEdit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)