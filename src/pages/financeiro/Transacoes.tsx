import { useState } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownRight, Trash2, Edit2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/DataTable';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { Transaction, TransactionType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  salario: 'Salário',
  freelance: 'Freelance',
  investimentos: 'Investimentos',
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  moradia: 'Moradia',
  lazer: 'Lazer',
  saude: 'Saúde',
  educacao: 'Educação',
  outros: 'Outros',
};

export default function Transacoes() {
  const { currentUser } = useUserStore();
  const { getTransactionsByUser, deleteTransaction } = useDataStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const transactions = getTransactionsByUser(currentUser);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const columns = [
    {
      key: 'date',
      header: 'Data',
      cell: (transaction: Transaction) => (
        <span className="text-sm">
          {format(transaction.date, 'dd/MM/yyyy', { locale: ptBR })}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'description',
      header: 'Descrição',
      cell: (transaction: Transaction) => (
        <div>
          <p className="font-medium">{transaction.description}</p>
          <Badge variant="outline" className="text-xs mt-1">
            {categoryLabels[transaction.category]}
          </Badge>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'type',
      header: 'Tipo',
      cell: (transaction: Transaction) => (
        <div className="flex items-center gap-1">
          {transaction.type === 'entrada' ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={cn(
            'text-sm',
            transaction.type === 'entrada' ? 'text-emerald-500' : 'text-red-500'
          )}>
            {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Valor',
      cell: (transaction: Transaction) => (
        <span className={cn(
          'font-semibold',
          transaction.type === 'entrada' ? 'text-emerald-500' : 'text-red-500'
        )}>
          {transaction.type === 'entrada' ? '+' : '-'}
          R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: '',
      cell: (transaction: Transaction) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500"
            onClick={() => deleteTransaction(transaction.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas entradas e saídas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <TransactionForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Entradas</p>
            <p className="text-2xl font-bold text-emerald-500">
              +R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Saídas</p>
            <p className="text-2xl font-bold text-red-500">
              -R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Saldo</p>
            <p className={cn(
              'text-2xl font-bold',
              totalIncome - totalExpense >= 0 ? 'text-emerald-500' : 'text-red-500'
            )}>
              {totalIncome - totalExpense >= 0 ? '+' : ''}
              R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as TransactionType | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredTransactions}
            columns={columns}
            searchable
            searchKeys={['description', 'category']}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
