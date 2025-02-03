import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
    console.log('Iniciando carregamento de dados...');
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      console.log('Fazendo requisições...');
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

      console.log('Dados recebidos:');
      console.log('Clientes:', clientesRes.data);
      console.log('Profissionais:', profissionaisRes.data);

      setAgendamentos(agendamentosRes.data);
      setClientes(clientesRes.data);
      setProfissionais(profissionaisRes.data);
      setProdutos(produtosRes.data);
      setPromocoes(promocoesRes.data.filter(p => isPromocaoAtiva(p)));

      console.log('Estados atualizados');
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
    if (!formData.data_hora) return profissionais;
    
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
      const produto = produtos.find(p => p.id === parseInt(prodId));
      return sum + (produto ? Number(produto.preco) : 0);
    }, 0);

    if (formData.promocao_id) {
      const promocao = promocoes.find(p => p.id === parseInt(formData.promocao_id));
      if (promocao) {
        total = total * (1 - Number(promocao.percentual_desconto) / 100);
      }
    }

    if (formData.desconto_adicional) {
      total = total * (1 - Number(formData.desconto_adicional) / 100);
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
      data_hora: new Date(agendamento.data_hora).toISOString().slice(0, 16),
      produtos: agendamento.produtos || [],
      promocao_id: agendamento.promocao_id || '',
      desconto_adicional: agendamento.desconto_adicional || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await axios.delete(`http://localhost:3000/agendamentos/${id}`);
        carregarDados();
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
      }
    }
  };

  const FormularioAgendamento = ({ formData, setFormData, onSubmit, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-purple-800">
              {formData.id ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.cliente_id}
                  onChange={(e) => {
                    console.log('Cliente selecionado:', e.target.value);
                    setFormData({ ...formData, cliente_id: e.target.value });
                  }}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes && clientes.length > 0 && clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.email}
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
                  onChange={(e) => {
                    console.log('Profissional selecionado:', e.target.value);
                    setFormData({ ...formData, profissional_id: e.target.value });
                  }}
                >
                  <option value="">Selecione um profissional</option>
                  {profissionais && profissionais.length > 0 && profissionais.map(prof => (
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
                      {produto.nome} - R$ {Number(produto.preco).toFixed(2)}
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
                onClick={onCancel}
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
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">Agendamentos</h1>
        <button
          onClick={() => {
            setFormData({
              cliente_id: '',
              profissional_id: '',
              data_hora: '',
              produtos: [],
              promocao_id: '',
              desconto_adicional: 0,
              valor_total: 0
            });
            setShowForm(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {showForm && (
        <FormularioAgendamento
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
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
                <tr key={agendamento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(agendamento.data_hora).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {clientes.find(c => c.id === parseInt(agendamento.cliente_id))?.nome}
                  </td>
                  <td className="px-6 py-4">
                    {profissionais.find(p => p.id === parseInt(agendamento.profissional_id))?.nome}
                  </td>
                  <td className="px-6 py-4">
                    {agendamento.produtos?.map(prodId => 
                      produtos.find(p => p.id === parseInt(prodId))?.nome
                    ).join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    R$ {Number(agendamento.valor_total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(agendamento)}
                        className="text-purple-600 hover:text-purple-800"
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
      )}
    </div>
  );
};

export default ListaAgendamentos;