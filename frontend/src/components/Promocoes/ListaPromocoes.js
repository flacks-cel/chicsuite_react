import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const ListaPromocoes = () => {
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    percentual_desconto: ''
  });

  useEffect(() => {
    carregarPromocoes();
  }, []);

  const carregarPromocoes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/promocoes');
      setPromocoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://localhost:3000/promocoes/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/promocoes', formData);
      }
      carregarPromocoes();
      setShowForm(false);
      setFormData({
        titulo: '',
        descricao: '',
        data_inicio: '',
        data_fim: '',
        percentual_desconto: ''
      });
    } catch (error) {
      console.error('Erro ao salvar promoção:', error);
    }
  };

  const handleEdit = (promocao) => {
    setFormData({
      ...promocao,
      data_inicio: new Date(promocao.data_inicio).toISOString().split('T')[0],
      data_fim: new Date(promocao.data_fim).toISOString().split('T')[0],
      percentual_desconto: promocao.percentual_desconto || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta promoção?')) {
      try {
        await axios.delete(`http://localhost:3000/promocoes/${id}`);
        carregarPromocoes();
      } catch (error) {
        console.error('Erro ao excluir promoção:', error);
      }
    }
  };

  const promocoesFiltradas = promocoes.filter(promocao =>
    promocao.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
    promocao.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const isPromocaoAtiva = (promocao) => {
    const hoje = new Date();
    const inicio = new Date(promocao.data_inicio);
    const fim = new Date(promocao.data_fim);
    return hoje >= inicio && hoje <= fim;
  };

  const formatarPercentual = (valor) => {
    return valor ? `${Number(valor).toFixed(2)}%` : '-';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">Promoções</h1>
        <button
          onClick={() => {
            setFormData({
              titulo: '',
              descricao: '',
              data_inicio: '',
              data_fim: '',
              percentual_desconto: ''
            });
            setShowForm(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Promoção
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar promoções..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-purple-800">
                {formData.id ? 'Editar Promoção' : 'Nova Promoção'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.percentual_desconto}
                    onChange={(e) => setFormData({ ...formData, percentual_desconto: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desconto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Início
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promocoesFiltradas.map((promocao) => (
                <tr key={promocao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{promocao.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{promocao.descricao}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatarPercentual(promocao.percentual_desconto)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatarData(promocao.data_inicio)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatarData(promocao.data_fim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isPromocaoAtiva(promocao) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isPromocaoAtiva(promocao) ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(promocao)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(promocao.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {promocoesFiltradas.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Nenhuma promoção encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListaPromocoes;