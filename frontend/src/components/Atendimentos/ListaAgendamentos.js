import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ListaAgendamentos = () => {
 const initialFormData = {
   cliente_id: '',
   profissional_id: '',
   data_hora: '',
   produtos: [],
   promocao_id: '',
   forma_pagamento: '',
   status_pagamento: 'pendente',
   produtosSelecionados: [],
   desconto_adicional: 0,
   valor_total: 0
 };

 const [agendamentos, setAgendamentos] = useState([]);
 const [clientes, setClientes] = useState([]);
 const [profissionais, setProfissionais] = useState([]);
 const [produtos, setProdutos] = useState([]);
 const [promocoes, setPromocoes] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState(initialFormData);

 const formasPagamento = [
   { value: 'dinheiro', label: 'Dinheiro' },
   { value: 'debito', label: 'Cartão de Débito' },
   { value: 'credito', label: 'Cartão de Crédito' },
   { value: 'pix', label: 'PIX' }
 ];

 const calcularValorTotal = () => {
   let total = formData.produtosSelecionados.reduce((sum, prod) => {
     const produto = produtos.find(p => p.id === prod.id);
     return sum + (produto ? Number(produto.preco) * prod.quantidade : 0);
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

 const isPromocaoAtiva = (promocao) => {
   const hoje = new Date();
   const inicio = new Date(promocao.data_inicio);
   const fim = new Date(promocao.data_fim);
   return hoje >= inicio && hoje <= fim;
 };

 const handleProdutoChange = (produtoId, quantidade) => {
   setFormData(prev => {
     const produtosSelecionados = [...prev.produtosSelecionados];
     const index = produtosSelecionados.findIndex(p => p.id === produtoId);
     
     if (quantidade > 0) {
       if (index >= 0) {
         produtosSelecionados[index] = { id: produtoId, quantidade };
       } else {
         produtosSelecionados.push({ id: produtoId, quantidade });
       }
     } else {
       if (index >= 0) {
         produtosSelecionados.splice(index, 1);
       }
     }

     return {
       ...prev,
       produtosSelecionados
     };
   });
 };
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const valorTotal = calcularValorTotal();
    const dadosAgendamento = {
      ...formData,
      valor_total: valorTotal,
      produtos: formData.produtosSelecionados.map(p => ({
        id: p.id,
        quantidade: p.quantidade,
        preco_unitario: produtos.find(prod => prod.id === p.id).preco
      }))
    };

    if (formData.id) {
      await axios.put(`http://localhost:3002/api/agendamentos/${formData.id}`, dadosAgendamento);
    } else {
      await axios.post('http://localhost:3002/api/agendamentos', dadosAgendamento);
    }
    
    carregarDados();
    setShowForm(false);
    setFormData(initialFormData);
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
  }
};

const handleEdit = (agendamento) => {
  setFormData({
    ...agendamento,
    data_hora: new Date(agendamento.data_hora).toISOString().slice(0, 16),
    produtosSelecionados: agendamento.produtos || [],
    promocao_id: agendamento.promocao_id || '',
    desconto_adicional: agendamento.desconto_adicional || 0
  });
  setShowForm(true);
};

const handleDelete = async (id) => {
  if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
    try {
      await axios.delete(`http://localhost:3002/api/agendamentos/${id}`);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  }
};
const carregarDados = async () => {
  try {
    const [
      agendamentosRes,
      clientesRes,
      profissionaisRes,
      produtosRes,
      promocoesRes
    ] = await Promise.all([
      axios.get('http://localhost:3002/api/agendamentos'),
      axios.get('http://localhost:3002/api/clientes'),
      axios.get('http://localhost:3002/api/profissionais'),
      axios.get('http://localhost:3002/api/produtos'),
      axios.get('http://localhost:3002/api/promocoes')
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

useEffect(() => {
  carregarDados();
}, []);

const FormularioAgendamento = ({ formData, setFormData, onSubmit, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-purple-800">
          {formData.id ? 'Editar Agendamento' : 'Novo Agendamento'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">&times;</button>
      </div>
      <form onSubmit={onSubmit} className="p-6">
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
             <select
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
               value={formData.cliente_id}
               onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
             >
               <option value="">Selecione um cliente</option>
               {clientes.map(cliente => (
                 <option key={cliente.id} value={cliente.id}>
                   {cliente.nome} - {cliente.email}
                 </option>
               ))}
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
             <input
               type="datetime-local"
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
               value={formData.data_hora}
               onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
             <select
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
               value={formData.profissional_id}
               onChange={(e) => setFormData({ ...formData, profissional_id: e.target.value })}
             >
               <option value="">Selecione um profissional</option>
               {profissionais.map(prof => (
                 <option key={prof.id} value={prof.id}>
                   {prof.nome} - {prof.especialidade}
                 </option>
               ))}
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
             <select
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
               value={formData.forma_pagamento}
               onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
             >
               <option value="">Selecione a forma de pagamento</option>
               {formasPagamento.map(forma => (
                 <option key={forma.value} value={forma.value}>
                   {forma.label}
                 </option>
               ))}
             </select>
           </div>
           <div className="col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Produtos</label>
             <div className="grid grid-cols-2 gap-4">
               {produtos.map(produto => (
                 <div key={produto.id} className="flex items-center justify-between p-2 border rounded">
                   <div>
                     <p className="font-medium">{produto.nome}</p>
                     <p className="text-sm text-gray-500">R$ {Number(produto.preco).toFixed(2)}</p>
                   </div>
                   <input
                     type="number"
                     min="0"
                     className="w-20 px-2 py-1 border rounded"
                     value={formData.produtosSelecionados.find(p => p.id === produto.id)?.quantidade || 0}
                     onChange={(e) => handleProdutoChange(produto.id, parseInt(e.target.value) || 0)}
                   />
                 </div>
               ))}
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Promoção</label>
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
             <label className="block text-sm font-medium text-gray-700 mb-1">Desconto Adicional (%)</label>
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

           <div className="mt-4 p-4 bg-gray-50 rounded-lg col-span-2">
             <p className="text-lg font-semibold text-purple-800">
               Valor Total: R$ {calcularValorTotal().toFixed(2)}
             </p>
           </div>

           <div className="mt-6 flex justify-end gap-3 col-span-2">
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
         </div>
       </form>
     </div>
   </div>
 );
 return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-purple-800">Agendamentos</h1>
      <button
        onClick={() => {
          setFormData(initialFormData);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profissional</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produtos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forma Pagamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agendamentos.map(agendamento => (
              <tr key={agendamento.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(agendamento.data_hora).toLocaleString()}</td>
                <td className="px-6 py-4">{clientes.find(c => c.id === parseInt(agendamento.cliente_id))?.nome}</td>
                <td className="px-6 py-4">{profissionais.find(p => p.id === parseInt(agendamento.profissional_id))?.nome}</td>
                <td className="px-6 py-4">
                  {agendamento.produtos?.map(prod => 
                    `${produtos.find(p => p.id === prod.id)?.nome} (${prod.quantidade}x)`
                  ).join(', ')}
                </td>
                <td className="px-6 py-4">{formasPagamento.find(f => f.value === agendamento.forma_pagamento)?.label}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    agendamento.status_pagamento === 'pago' 
                      ? 'bg-green-100 text-green-800'
                      : agendamento.status_pagamento === 'pendente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {agendamento.status_pagamento}
                  </span>
                </td>
                <td className="px-6 py-4">R$ {Number(agendamento.valor_total).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(agendamento)} className="text-purple-600 hover:text-purple-800">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(agendamento.id)} className="text-red-600 hover:text-red-800">
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