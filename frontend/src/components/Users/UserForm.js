// frontend/src/components/Users/UserForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'attendant' // default role
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'attendant', label: 'Atendente' },
    { value: 'professional', label: 'Profissional' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', formData);
      navigate('/users');
    } catch (err) {
      setError('Erro ao criar usuário');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Cadastrar Novo Usuário</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Função
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default UserForm;