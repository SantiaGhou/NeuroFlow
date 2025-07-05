import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, PieChart, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { FinanceEntry } from '../../types';

export function FinanceView() {
  const { state, dispatch } = useApp();
  const { financeEntries } = state;
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('month');
  
  const [newEntry, setNewEntry] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    category: '',
    description: ''
  });

  const categories = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros']
  };

  const handleAddEntry = () => {
    if (newEntry.amount > 0 && newEntry.category && newEntry.description) {
      const entry: FinanceEntry = {
        id: Date.now().toString(),
        type: newEntry.type,
        amount: newEntry.amount,
        category: newEntry.category,
        description: newEntry.description,
        date: new Date(),
        tags: []
      };
      dispatch({ type: 'ADD_FINANCE_ENTRY', payload: entry });
      dispatch({ type: 'ADD_SPARKS', payload: 15 });
      setNewEntry({
        type: 'expense',
        amount: 0,
        category: '',
        description: ''
      });
      setShowForm(false);
    }
  };

  const getFilteredEntries = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (filterPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0);
    }

    return financeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const matchesPeriod = entryDate >= startDate;
      const matchesType = filterType === 'all' || entry.type === filterType;
      return matchesPeriod && matchesType;
    });
  };

  const filteredEntries = getFilteredEntries();
  
  const totalIncome = filteredEntries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const totalExpenses = filteredEntries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  const getCategoryTotals = (type: 'income' | 'expense') => {
    const categoryMap = new Map();
    
    filteredEntries
      .filter(entry => entry.type === type)
      .forEach(entry => {
        const current = categoryMap.get(entry.category) || 0;
        categoryMap.set(entry.category, current + entry.amount);
      });
    
    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const expenseCategories = getCategoryTotals('expense');
  const incomeCategories = getCategoryTotals('income');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mês';
      case 'year': return 'Este Ano';
      default: return 'Todos os Períodos';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Finanças</h1>
            <p className="text-gray-600">
              Controle suas receitas e despesas
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Transação</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-3">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="year">Este Ano</option>
                <option value="all">Todos os Períodos</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todas as Transações</option>
                <option value="income">Apenas Receitas</option>
                <option value="expense">Apenas Despesas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Receitas - {getPeriodLabel()}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Despesas - {getPeriodLabel()}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${balance >= 0 ? 'from-blue-500 to-purple-500' : 'from-orange-500 to-red-500'} rounded-2xl flex items-center justify-center`}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Saldo - {getPeriodLabel()}</p>
          </div>
        </div>

        {/* Categories Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expenses by Category */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingDown className="w-6 h-6 mr-3 text-red-500" />
              Despesas por Categoria
            </h2>
            
            {expenseCategories.length > 0 ? (
              <div className="space-y-4">
                {expenseCategories.map(({ category, amount }) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{category}</span>
                        <span className="text-red-600 font-bold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma despesa registrada</p>
            )}
          </div>

          {/* Income by Category */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-500" />
              Receitas por Categoria
            </h2>
            
            {incomeCategories.length > 0 ? (
              <div className="space-y-4">
                {incomeCategories.map(({ category, amount }) => {
                  const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{category}</span>
                        <span className="text-green-600 font-bold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma receita registrada</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transações Recentes</h2>
          
          {filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${
                        entry.type === 'income' 
                          ? 'from-green-500 to-emerald-500' 
                          : 'from-red-500 to-pink-500'
                      } rounded-xl flex items-center justify-center`}>
                        {entry.type === 'income' ? (
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{entry.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{entry.category}</span>
                          <span>•</span>
                          <span>{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma transação encontrada</h3>
              <p className="text-gray-600">Comece registrando suas receitas e despesas!</p>
            </div>
          )}
        </div>

        {/* Add Entry Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nova Transação</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNewEntry(prev => ({ ...prev, type: 'income', category: '' }))}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        newEntry.type === 'income'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Receita
                    </button>
                    <button
                      onClick={() => setNewEntry(prev => ({ ...prev, type: 'expense', category: '' }))}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        newEntry.type === 'expense'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Despesa
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                  <input
                    type="number"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="0,00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories[newEntry.type].map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <input
                    type="text"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da transação"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEntry}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}