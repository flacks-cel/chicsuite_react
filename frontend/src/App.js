import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './assets/images/logo.png';
import Navbar from './components/layout/Navbar';
import ListaClientes from './components/Clientes/ListaClientes';
import ListaProdutos from './components/Produtos/ListaProdutos';
import ListaProfissionais from './components/Profissionais/ListaProfissionais';
import ListaPromocoes from './components/Promocoes/ListaPromocoes';

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
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<ListaClientes />} />
            <Route path="/produtos" element={<ListaProdutos />} />
            <Route path="/profissionais" element={<ListaProfissionais />} />
            <Route path="/promocoes" element={<ListaPromocoes />} />
            <Route path="/atendimentos" element={<div>Em construção: Atendimentos</div>} />
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