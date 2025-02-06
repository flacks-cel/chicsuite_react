import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, Calendar, Package, Percent, BarChart } from 'lucide-react';

const Sidebar = () => (
  <nav className="bg-purple-600 text-white w-64 min-h-screen p-4">
    <div className="space-y-4">
      <Link to="/clientes" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <User className="w-5 h-5" />
        <span>Clientes</span>
      </Link>
      
      <Link to="/usuarios" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <Users className="w-5 h-5" />
        <span>Usuários</span>
      </Link>

      <Link to="/profissionais" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <Users className="w-5 h-5" />
        <span>Profissionais</span>
      </Link>

      <Link to="/produtos" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <Package className="w-5 h-5" />
        <span>Produtos</span>
      </Link>

      <Link to="/agendamentos" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <Calendar className="w-5 h-5" />
        <span>Agendamentos</span>
      </Link>

      <Link to="/promocoes" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <Percent className="w-5 h-5" />
        <span>Promoções</span>
      </Link>

      <Link to="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded">
        <BarChart className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
    </div>
  </nav>
);

export default Sidebar;