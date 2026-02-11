import { Wallet, TrendingUp, TrendingDown, ArrowRight, PiggyBank } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FinanceiroOverview() {
  const { currentUser } = useUserStore();
  const { getTransactionsByUser, getAccountsByUser, getFinancialGoalsByUser } = useDataStore();

  const transactions = getTransactionsByUser(currentUser);
  const accounts = getAccountsByUser(currentUser);
  const goals = getFinancialGoalsByUser(currentUser);

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const last30Days = transactions.filter(
    (t) => t.date > subDays(new Date(), 30)
  );
  
  const monthlyIncome = last30Days
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpense = last30Days
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  // Chart data - last 30 days
  const days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const lineChartData = days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactions.filter(
      (t) => format(t.date, 'yyyy-MM-dd') === dayStr
    );
    return {
      date: format(day, 'dd/MM'),
      entradas: dayTransactions
        .filter((t) => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0),
      saidas: dayTransactions
        .filter((t) => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0),
    };
  });

  // Expense by category
  const expenseByCategory = transactions
    .filter((t) => t.type === 'saida')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index],
    }));

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Controle suas finanças e acompanhe seus objetivos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Saldo Total"
          value={`R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          trend={monthlyIncome > monthlyExpense ? 'up' : 'down'}
        />
        <StatCard
          title="Entradas (30 dias)"
          value={`R$ ${monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Saídas (30 dias)"
          value={`R$ ${monthlyExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          trend="down"
        />
        <StatCard
          title="Economia"
          value={`R$ ${(monthlyIncome - monthlyExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={PiggyBank}
          trend={monthlyIncome > monthlyExpense ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Fluxo de Caixa</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver detalhes <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <LineChart
              data={lineChartData}
              lines={[
                { key: 'entradas', name: 'Entradas', color: '#10b981' },
                { key: 'saidas', name: 'Saídas', color: '#ef4444' },
              ]}
              xAxisKey="date"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <PieChart data={pieChartData} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Sem dados suficientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accounts & Goals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Minhas Contas</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${account.color}20` }}
                    >
                      <Wallet className="h-5 w-5" style={{ color: account.color }} />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.bank}</p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Metas Financeiras</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const percentage = Math.min(
                  Math.round((goal.currentAmount / goal.targetAmount) * 100),
                  100
                );
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-muted-foreground">
                        R$ {goal.currentAmount.toLocaleString('pt-BR')} / R$ {goal.targetAmount.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {percentage}% completo
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
