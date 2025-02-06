// frontend/src/components/Users/UserList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar usuários');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/api/users/${id}`);
        loadUsers();
      } catch (err) {
        setError('Erro ao excluir usuário');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800">Usuários</h2>
        <Link
          to="/users/new"
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Novo Usuário
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === 'admin' && 'Administrador'}
                  {user.role === 'attendant' && 'Atendente'}
                  {user.role === 'professional' && 'Profissional'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/users/${user.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;