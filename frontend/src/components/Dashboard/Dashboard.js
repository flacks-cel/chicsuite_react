import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Calendar, DollarSign, Package, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [metricas, setMetricas] = useState({
    atendimentosHoje: 0,
    faturamentoHoje: 0,
    faturamentoMes: 0,
    produtosMaisVendidos: [],
    profissionaisMaisRequisitados: [],
    faturamentoPorDia: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const mesAtual = new Date().getMonth() + 1;
      const anoAtual = new Date().getFullYear();

      const [atendimentosRes, produtosRes, profissionaisRes] = await Promise.all([
        axios.get('http://localhost:3000/agendamentos'),
        axios.get('http://localhost:3000/produtos'),
        axios.get('http://localhost:3000/profissionais')
      ]);

      const atendimentos = atendimentosRes.data;

      // Cálculo de métricas
      const atendimentosHoje = atendimentos.filter(a => 
        a.data_hora.startsWith(hoje)
      ).length;

      const faturamentoHoje = atendimentos
        .filter(a => a.data_hora.startsWith(hoje))
        .reduce((sum, a) => sum + Number(a.valor_total), 0);

      const faturamentoMes = atendimentos
        .filter(a => {
          const data = new Date(a.data_hora);
          return data.getMonth() + 1 === mesAtual && 
                 data.getFullYear() === anoAtual;
        })
        .reduce((sum, a) => sum + Number(a.valor_total), 0);

      // Produtos mais vendidos
      const produtosVendidos = {};
      atendimentos.forEach(atendimento => {
        atendimento.produtos?.forEach(prodId => {
          produtosVendidos[prodId] = (produtosVendidos[prodId] || 0) + 1;
        });
      });

      const produtosMaisVendidos = Object.entries(produtosVendidos)
        .map(([id, quantidade]) => ({
          nome: produtosRes.data.find(p => p.id === parseInt(id))?.nome || 'Produto Removido',
          quantidade
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5);

      // Profissionais mais requisitados
      const profissionaisRequisitados = {};
      atendimentos.forEach(atendimento => {
        const profId = atendimento.profissional_id;
        profissionaisRequisitados[profId] = (profissionaisRequisitados[profId] || 0) + 1;
      });

      const profissionaisMaisRequisitados = Object.entries(profissionaisRequisitados)
        .map(([id, quantidade]) => ({
          nome: profissionaisRes.data.find(p => p.id === parseInt(id))?.nome || 'Profissional Removido',
          quantidade
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5);

      // Faturamento por dia
      const faturamentoPorDia = atendimentos
        .reduce((acc, atendimento) => {
          const data = atendimento.data_hora.split('T')[0];
          acc[data] = (acc[data] || 0) + Number(atendimento.valor_total);
          return acc;
        }, {});

      const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() - i);
        return data.toISOString().split('T')[0];
      }).reverse();

      const faturamentoFormatado = ultimos7Dias.map(data => ({
        data,
        valor: faturamentoPorDia[data] || 0
      }));

      setMetricas({
        atendimentosHoje,
        faturamentoHoje,
        faturamentoMes,
        produtosMaisVendidos,
        profissionaisMaisRequisitados,
        faturamentoPorDia: faturamentoFormatado
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const CORES = ['#8B5CF6', '#EC4899', '#6366F1', '#F472B6', '#A78BFA'];

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">Dashboard</h1>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Atendimentos Hoje</p>
              <p className="text-2xl font-bold text-purple-800">{metricas.atendimentosHoje}</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Faturamento Hoje</p>
              <p className="text-2xl font-bold text-purple-800">
                R$ {metricas.faturamentoHoje.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Faturamento do Mês</p>
              <p className="text-2xl font-bold text-purple-800">
                R$ {metricas.faturamentoMes.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Faturamento dos Últimos 7 Dias */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">
            Faturamento dos Últimos 7 Dias
          </h2>
          <div className="h-80">
            <LineChart
              width={500}
              height={300}
              data={metricas.faturamentoPorDia}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#8B5CF6" name="Faturamento" />
            </LineChart>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">
            Produtos Mais Vendidos
          </h2>
          <div className="h-80">
            <BarChart
              width={500}
              height={300}
              data={metricas.produtosMaisVendidos}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#8B5CF6" name="Quantidade Vendida" />
            </BarChart>
          </div>
        </div>

        {/* Profissionais Mais Requisitados */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">
            Profissionais Mais Requisitados
          </h2>
          <div className="h-80">
            <PieChart width={400} height={300}>
              <Pie
                data={metricas.profissionaisMaisRequisitados}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="quantidade"
                nameKey="nome"
                label={({ nome, quantidade }) => `${nome}: ${quantidade}`}
              >
                {metricas.profissionaisMaisRequisitados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;