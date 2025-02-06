import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './assets/images/logo.png';
import Navbar from './components/layout/Navbar';
import ListaClientes from './components/Clientes/ListaClientes';
import ListaProdutos from './components/Produtos/ListaProdutos';
import ListaProfissionais from './components/Profissionais/ListaProfissionais';
import ListaPromocoes from './components/Promocoes/ListaPromocoes';
import ListaAgendamentos from './components/Atendimentos/ListaAgendamentos';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute';
import UserList from './components/Users/UserList';
import UserForm from './components/Users/UserForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
        <header className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <img 
                src={logo} 
                alt="ChicSuite Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-purple-800">ChicSuite</h1>
                <p className="text-gray-600">Sistema de Gestão para Salão de Beleza</p>
              </div>
            </div>
          </div>
        </header>

        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/clientes" element={<PrivateRoute><ListaClientes /></PrivateRoute>} />
            <Route path="/produtos" element={<PrivateRoute><ListaProdutos /></PrivateRoute>} />
            <Route path="/profissionais" element={<PrivateRoute><ListaProfissionais /></PrivateRoute>} />
            <Route path="/promocoes" element={<PrivateRoute><ListaPromocoes /></PrivateRoute>} />
            <Route path="/agendamentos" element={<PrivateRoute><ListaAgendamentos /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute><UserList /></PrivateRoute>} />
            <Route path="/usuarios/novo" element={<PrivateRoute><UserForm /></PrivateRoute>} />
            <Route path="/usuarios/:id/edit" element={<PrivateRoute><UserForm /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-bold text-purple-800 mb-2">Atendimentos do Dia</h2>
      <p className="text-gray-600">Visualize e gerencie os atendimentos</p>
    </div>

    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-bold text-purple-800 mb-2">Produtos em Baixa</h2>
      <p className="text-gray-600">Verifique o estoque dos produtos</p>
    </div>

    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-bold text-purple-800 mb-2">Promoções Ativas</h2>
      <p className="text-gray-600">Confira as promoções em andamento</p>
    </div>
  </div>
);

export default App;