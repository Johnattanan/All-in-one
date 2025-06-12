// Home.tsx
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-6">
        Bienvenue dans votre application de gestion des organisations personnelles
      </h1>
      <div className="max-w-2xl mx-auto mb-8">
        <p className="text-lg text-gray-700 mb-4">
          Cette application vous aide à organiser efficacement votre quotidien. 
          Gérez vos tâches, prenez des notes importantes et suivez vos dépenses en toute simplicité.
        </p>
        <p className="text-md text-gray-600 mb-2">
          <strong>Fonctionnalités principales :</strong>
        </p>
        <ul className="text-left text-gray-600 list-disc list-inside mb-4">
          <li>Planifiez et suivez vos tâches à faire grâce au module Todo.</li>
          <li>Notez vos idées, rendez-vous ou informations importantes dans le Bloc-notes.</li>
          <li>Gardez un œil sur vos finances et vos dépenses personnelles.</li>
        </ul>
        <p className="text-md text-gray-600">
          Naviguez dans les sections ci-dessous pour commencer à organiser votre vie !
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/todos/lists" className="bg-indigo-100 p-6 rounded-xl hover:bg-indigo-200 transition">
          <h2 className="text-xl font-semibold">Todo</h2>
          <p className="text-sm text-gray-700">Gérez vos tâches</p>
        </Link>
        <Link to="/notes/lists" className="bg-yellow-100 p-6 rounded-xl hover:bg-yellow-200 transition">
          <h2 className="text-xl font-semibold">Bloc-notes</h2>
          <p className="text-sm text-gray-700">Prenez des notes rapidement</p>
        </Link>
        <Link to="/depenses/lists" className="bg-green-100 p-6 rounded-xl hover:bg-green-200 transition">
          <h2 className="text-xl font-semibold">Dépenses</h2>
          <p className="text-sm text-gray-700">Suivez vos finances</p>
        </Link>
      </div>
    </div>
  )
}

export default Home