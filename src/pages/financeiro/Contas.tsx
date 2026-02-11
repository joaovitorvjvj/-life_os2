import { Landmark, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { cn } from '@/lib/utils';

export default function Contas() {
  const { currentUser } = useUserStore();
  const { getAccountsByUser, getTransactionsByUser } = useDataStore();

  const accounts = getAccountsByUser(currentUser);
  const transactions = getTransactionsByUser(currentUser);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Calculate monthly change for each account
  const getMonthlyChange = (accountId: string) => {
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const accountTransactions = transactions.filter(
      (t) => t.accountId === accountId && t.date > lastMonth
    );
    return accountTransactions.reduce((sum, t) => {
      return sum + (t.type === 'entrada' ? t.amount : -t.amount);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contas Bancárias</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas contas e acompanhe seus saldos
        </p>
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Saldo Total</p>
              <p className="text-4xl font-bold">
                R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">
              {accounts.length} contas ativas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const monthlyChange = getMonthlyChange(account.id);
          const percentageOfTotal = (account.balance / totalBalance) * 100;

          return (
            <Card 
              key={account.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${account.color}20` }}
                    >
                      <Landmark 
                        className="h-6 w-6" 
                        style={{ color: account.color }} 
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.bank}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold">
                      R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        'text-sm',
                        monthlyChange >= 0 ? 'text-emerald-500' : 'text-red-500'
                      )}>
                        {monthlyChange >= 0 ? '+' : ''}
                        R$ {monthlyChange.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-muted-foreground">este mês</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{percentageOfTotal.toFixed(1)}% do total</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${percentageOfTotal}%`,
                          backgroundColor: account.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Account Card */}
        <Card className="border-dashed hover:border-solid hover:border-primary cursor-pointer transition-all">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <span className="text-2xl">+</span>
            </div>
            <p className="font-medium text-muted-foreground">Adicionar Conta</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas para Gerenciar suas Contas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">💰 Diversifique</h4>
              <p className="text-sm text-muted-foreground">
                Mantenha suas finanças distribuídas entre diferentes bancos para maior segurança.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">📊 Acompanhe</h4>
              <p className="text-sm text-muted-foreground">
                Revise seus saldos semanalmente para identificar padrões de gastos.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">🎯 Metas</h4>
              <p className="text-sm text-muted-foreground">
                Defina objetivos de economia para cada conta separadamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
