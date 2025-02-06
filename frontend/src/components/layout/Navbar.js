import React from 'react';
import { Users, Calendar, ShoppingBag, Percent, BarChart3, Scissors, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, children, icon: Icon }) => (
  <Link 
    to={to}
    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </Link>
);

const Navbar = () => {
  return (
    <nav className="bg-purple-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/clientes" icon={Users}>
            Clientes
          </NavLink>
          <NavLink to="/profissionais" icon={Scissors}>
            Profissionais
          </NavLink>
          <NavLink to="/produtos" icon={ShoppingBag}>
            Produtos
          </NavLink>
          <NavLink to="/agendamentos" icon={Calendar}>
            Agendamentos
          </NavLink>
          <NavLink to="/promocoes" icon={Percent}>
            Promoções
          </NavLink>
          <NavLink to="/dashboard" icon={BarChart3}>
            Dashboard
          </NavLink>
          <NavLink to="/usuarios" icon={UserCog}>
            Usuários
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;