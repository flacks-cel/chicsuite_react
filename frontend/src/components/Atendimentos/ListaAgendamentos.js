import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search, Calendar } from 'lucide-react';

const ListaAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    profissional_id: '',
    data_hora: '',
    produtos: [],
    promocao_id: '',
    desconto_adicional: 0,
    valor_total: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [
        agendamentosRes,
        clientesRes,
        profissionaisRes,
        produtosRes,
        promocoesRes
      ] = await Promise.all([
        axios.get('http://localhost:3000/agendamentos'),
        axios.get('http://localhost:3000/clientes'),
        axios.get('http://localhost:3000/profissionais'),
        axios.get('http://localhost:3000/produtos'),
        axios.get('http://localhost:3000/promocoes')
      ]);

      setAgendamentos(agendamentosRes.data);
      setClientes(clientesRes.data);
      setProfissionais(profissionaisRes.data);
      setProdutos(produtosRes.data);
      setPromocoes(promocoesRes.data.filter(p => isPromocaoAtiva(p)));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPromocaoAtiva = (promocao) => {
    const hoje = new Date();
    const inicio = new Date(promocao.data_inicio);
    const fim = new Date(promocao.data_fim);
    return hoje >= inicio && hoje <= fim;
  };

  const getProfissionaisDisponiveis = () => {
    const dataHoraSelecionada = new Date(formData.data_hora);
    return profissionais.filter(prof => {
      const agendamentosProf = agendamentos.filter(a => 
        a.profissional_id === prof.id &&
        new Date(a.data_hora).getTime() === dataHoraSelecionada.getTime()
      );
      return agendamentosProf.length === 0;
    });
  };

  const calcularValorTotal = () => {
    let total = formData.produtos.reduce((sum, prodId) => {
      const produto = produtos.find(p => p.id === prodId);
      return sum + (produto ? produto.preco : 0);
    }, 0);

    if (formData.promocao_id) {
      const promocao = promocoes.find(p => p.id === formData.promocao_id);
      if (promocao) {
        total = total * (1 - promocao.percentual_desconto / 100);
      }
    }

    if (formData.desconto_adicional) {
      total = total * (1 - formData.desconto_adicional / 100);
    }

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const valorTotal = calcularValorTotal();
      const dadosAgendamento = {
        ...formData,
        valor_total: valorTotal
      };

      if (formData.id) {
        await axios.put(`http://localhost:3000/agendamentos/${formData.id}`, dadosAgendamento);
      } else {
        await axios.post('http://localhost:3000/agendamentos', dadosAgendamento);
      }
      
      carregarDados();
      setShowForm(false);
      setFormData({
        cliente_id: '',
        profissional_id: '',
        data_hora: '',
        produtos: [],
        promocao_id: '',
        desconto_adicional: 0,
        valor_total: 0
      });
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  const handleEdit = (agendamento) => {
    setFormData({
      ...agendamento,
      data_hora: new Date(agendamento.data_hora).toISOString().slice(0, 16)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/agendamentos/${id}`);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Formulário e listagem de agendamentos */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-purple-800">
                Novo Agendamento
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.data_hora}
                    onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profissional
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.profissional_id}
                    onChange={(e) => setFormData({ ...formData, profissional_id: e.target.value })}
                  >
                    <option value="">Selecione um profissional</option>
                    {getProfissionaisDisponiveis().map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nome} - {prof.especialidade}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produtos
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.produtos}
                    onChange={(e) => setFormData({
                      ...formData,
                      produtos: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                  >
                    {produtos.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} - R$ {produto.preco.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promoção
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.promocao_id}
                    onChange={(e) => setFormData({ ...formData, promocao_id: e.target.value })}
                  >
                    <option value="">Selecione uma promoção</option>
                    {promocoes.map(promocao => (
                      <option key={promocao.id} value={promocao.id}>
                        {promocao.titulo} - {promocao.percentual_desconto}% de desconto
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto Adicional (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.desconto_adicional}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      desconto_adicional: parseFloat(e.target.value) || 0 
                    })}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-purple-800">
                  Valor Total: R$ {calcularValorTotal().toFixed(2)}
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de agendamentos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Profissional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Produtos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Valor Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agendamentos.map(agendamento => (
              <tr key={agendamento.id}>
                <td className="px-6 py-4">
                  {new Date(agendamento.data_hora).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {clientes.find(c => c.id === agendamento.cliente_id)?.nome}
                </td>
                <td className="px-6 py-4">
                  {profissionais.find(p => p.id === agendamento.profissional_id)?.nome}
                </td>
                <td className="px-6 py-4">
                  {agendamento.produtos?.map(prodId => 
                    produtos.find(p => p.id === prodId)?.nome
                  ).join(', ')}
                </td>
                <td className="px-6 py-4">
                  R$ {agendamento.valor_total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(agendamento)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(agendamento.id)}
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
      </div>
    </div>
  );
};

export default ListaAgendamentos;