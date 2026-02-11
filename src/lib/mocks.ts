import type { 
  Task, 
  Transaction, 
  Account, 
  FinancialGoal, 
  Meal, 
  Workout, 
  BodyMeasurement, 
  FitnessGoal,
  Subject,
  StudySession 
} from '@/types';
import { subDays, addDays } from 'date-fns';

// Helper to generate dates
const daysAgo = (days: number) => subDays(new Date(), days);
const daysFromNow = (days: number) => addDays(new Date(), days);

// ==================== TASKS ====================
export const mockTasks: Task[] = [
  // João's tasks
  {
    id: '1',
    title: 'Reunião com cliente',
    description: 'Apresentar proposta do projeto',
    status: 'pendente',
    priority: 'alta',
    dueDate: daysFromNow(1),
    createdAt: daysAgo(2),
    user: 'João',
  },
  {
    id: '2',
    title: 'Enviar relatório mensal',
    status: 'em_andamento',
    priority: 'alta',
    dueDate: daysFromNow(2),
    createdAt: daysAgo(5),
    user: 'João',
  },
  {
    id: '3',
    title: 'Comprar mantimentos',
    status: 'pendente',
    priority: 'media',
    dueDate: daysFromNow(3),
    createdAt: daysAgo(1),
    user: 'João',
  },
  {
    id: '4',
    title: 'Agendar consulta médica',
    status: 'concluida',
    priority: 'media',
    dueDate: daysAgo(1),
    createdAt: daysAgo(7),
    user: 'João',
  },
  {
    id: '5',
    title: 'Pagar contas de utilities',
    status: 'pendente',
    priority: 'alta',
    dueDate: daysFromNow(5),
    createdAt: daysAgo(3),
    user: 'João',
  },
  {
    id: '6',
    title: 'Ler capítulo do livro',
    status: 'em_andamento',
    priority: 'baixa',
    dueDate: daysFromNow(7),
    createdAt: daysAgo(2),
    user: 'João',
  },
  // Myrrena's tasks
  {
    id: '7',
    title: 'Preparar apresentação',
    status: 'pendente',
    priority: 'alta',
    dueDate: daysFromNow(1),
    createdAt: daysAgo(3),
    user: 'Myrrena',
  },
  {
    id: '8',
    title: 'Revisar documentação',
    status: 'em_andamento',
    priority: 'media',
    dueDate: daysFromNow(4),
    createdAt: daysAgo(2),
    user: 'Myrrena',
  },
  {
    id: '9',
    title: 'Yoga matinal',
    status: 'concluida',
    priority: 'baixa',
    dueDate: daysAgo(1),
    createdAt: daysAgo(1),
    user: 'Myrrena',
  },
  {
    id: '10',
    title: 'Planejar viagem',
    status: 'pendente',
    priority: 'media',
    dueDate: daysFromNow(14),
    createdAt: daysAgo(5),
    user: 'Myrrena',
  },
];

// ==================== ACCOUNTS ====================
export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta Corrente',
    bank: 'Nubank',
    balance: 8450.50,
    color: '#8b5cf6',
    user: 'João',
  },
  {
    id: '2',
    name: 'Poupança',
    bank: 'Itaú',
    balance: 12500.00,
    color: '#f59e0b',
    user: 'João',
  },
  {
    id: '3',
    name: 'Investimentos',
    bank: 'XP',
    balance: 8750.25,
    color: '#10b981',
    user: 'João',
  },
  {
    id: '4',
    name: 'Conta Principal',
    bank: 'Nubank',
    balance: 15200.75,
    color: '#8b5cf6',
    user: 'Myrrena',
  },
  {
    id: '5',
    name: 'Poupança',
    bank: 'Bradesco',
    balance: 8500.00,
    color: '#ef4444',
    user: 'Myrrena',
  },
];

// ==================== TRANSACTIONS ====================
export const mockTransactions: Transaction[] = [
  // João's transactions
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `j-tx-${i}`,
    description: ['Supermercado', 'Salário', 'Uber', 'Netflix', 'Academia', 'Restaurante', 'Farmácia', 'Internet'][Math.floor(Math.random() * 8)],
    amount: Math.floor(Math.random() * 500) + 50,
    type: (i % 5 === 0 ? 'entrada' : 'saida') as 'entrada' | 'saida',
    category: ['alimentacao', 'transporte', 'lazer', 'saude', 'moradia'][Math.floor(Math.random() * 5)] as Transaction['category'],
    date: daysAgo(Math.floor(Math.random() * 30)),
    accountId: '1',
    user: 'João' as const,
  })),
  // Myrrena's transactions
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `m-tx-${i}`,
    description: ['Shopping', 'Freelance', 'Gasolina', 'Spotify', 'Pilates', 'Café', 'Livros', 'Celular'][Math.floor(Math.random() * 8)],
    amount: Math.floor(Math.random() * 800) + 30,
    type: (i % 4 === 0 ? 'entrada' : 'saida') as 'entrada' | 'saida',
    category: ['alimentacao', 'transporte', 'educacao', 'saude', 'lazer'][Math.floor(Math.random() * 5)] as Transaction['category'],
    date: daysAgo(Math.floor(Math.random() * 30)),
    accountId: '4',
    user: 'Myrrena' as const,
  })),
];

// ==================== FINANCIAL GOALS ====================
export const mockFinancialGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Viagem para Europa',
    targetAmount: 15000,
    currentAmount: 8750,
    deadline: daysFromNow(180),
    color: '#3b82f6',
    user: 'João',
  },
  {
    id: '2',
    name: 'Carro Novo',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: daysFromNow(365),
    color: '#10b981',
    user: 'João',
  },
  {
    id: '3',
    name: 'Reserva de Emergência',
    targetAmount: 20000,
    currentAmount: 12500,
    deadline: daysFromNow(90),
    color: '#f59e0b',
    user: 'Myrrena',
  },
  {
    id: '4',
    name: 'Curso de MBA',
    targetAmount: 35000,
    currentAmount: 10000,
    deadline: daysFromNow(240),
    color: '#8b5cf6',
    user: 'Myrrena',
  },
];

// ==================== MEALS ====================
export const mockMeals: Meal[] = [
  // João's meals - today
  {
    id: '1',
    name: 'Ovos com bacon',
    calories: 450,
    protein: 25,
    carbs: 5,
    fat: 35,
    date: new Date(),
    mealType: 'cafe',
    user: 'João',
  },
  {
    id: '2',
    name: 'Frango grelhado com arroz',
    calories: 650,
    protein: 45,
    carbs: 70,
    fat: 15,
    date: new Date(),
    mealType: 'almoco',
    user: 'João',
  },
  // João's meals - previous days
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `j-meal-${i}`,
    name: ['Sanduíche', 'Salada', 'Macarrão', 'Peixe', 'Sopa'][Math.floor(Math.random() * 5)],
    calories: Math.floor(Math.random() * 600) + 300,
    protein: Math.floor(Math.random() * 40) + 10,
    carbs: Math.floor(Math.random() * 80) + 20,
    fat: Math.floor(Math.random() * 30) + 5,
    date: daysAgo(i + 1),
    mealType: ['cafe', 'almoco', 'jantar', 'lanche'][Math.floor(Math.random() * 4)] as Meal['mealType'],
    user: 'João' as const,
  })),
  // Myrrena's meals
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `m-meal-${i}`,
    name: ['Smoothie bowl', 'Quinoa salad', 'Salmão', 'Tofu stir-fry', 'Açaí'][Math.floor(Math.random() * 5)],
    calories: Math.floor(Math.random() * 500) + 250,
    protein: Math.floor(Math.random() * 35) + 15,
    carbs: Math.floor(Math.random() * 70) + 30,
    fat: Math.floor(Math.random() * 25) + 8,
    date: daysAgo(i),
    mealType: ['cafe', 'almoco', 'jantar', 'lanche'][Math.floor(Math.random() * 4)] as Meal['mealType'],
    user: 'Myrrena' as const,
  })),
];

// ==================== WORKOUTS ====================
export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Treino A - Peito e Tríceps',
    exercises: [
      { id: '1', name: 'Supino reto', sets: 4, reps: 10, weight: 60 },
      { id: '2', name: 'Crucifixo', sets: 3, reps: 12, weight: 15 },
      { id: '3', name: 'Tríceps testa', sets: 3, reps: 12, weight: 25 },
    ],
    date: daysAgo(1),
    duration: 60,
    user: 'João',
  },
  {
    id: '2',
    name: 'Treino B - Costas e Bíceps',
    exercises: [
      { id: '4', name: 'Puxada frontal', sets: 4, reps: 10, weight: 50 },
      { id: '5', name: 'Remada curvada', sets: 3, reps: 12, weight: 40 },
      { id: '6', name: 'Rosca direta', sets: 3, reps: 12, weight: 20 },
    ],
    date: daysAgo(3),
    duration: 55,
    user: 'João',
  },
  {
    id: '3',
    name: 'Yoga Flow',
    exercises: [
      { id: '7', name: 'Sun Salutation', sets: 5, reps: 1 },
      { id: '8', name: 'Warrior Sequence', sets: 3, reps: 1 },
    ],
    date: new Date(),
    duration: 45,
    user: 'Myrrena',
  },
  {
    id: '4',
    name: 'Pilates',
    exercises: [
      { id: '9', name: 'Hundred', sets: 3, reps: 100 },
      { id: '10', name: 'Rolling Like a Ball', sets: 3, reps: 10 },
    ],
    date: daysAgo(2),
    duration: 50,
    user: 'Myrrena',
  },
];

// ==================== BODY MEASUREMENTS ====================
export const mockMeasurements: BodyMeasurement[] = [
  // João's measurements - last 30 days
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `j-m-${i}`,
    date: daysAgo(i * 3),
    weight: 78 - (i * 0.1) + Math.random() * 0.5,
    bodyFat: 18 - (i * 0.05),
    chest: 102,
    waist: 82 - (i * 0.1),
    arms: 35,
    legs: 58,
    user: 'João' as const,
  })),
  // Myrrena's measurements
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `m-m-${i}`,
    date: daysAgo(i * 3),
    weight: 58 - (i * 0.05) + Math.random() * 0.3,
    bodyFat: 22 - (i * 0.03),
    chest: 88,
    waist: 66 - (i * 0.05),
    arms: 26,
    legs: 52,
    user: 'Myrrena' as const,
  })),
];

// ==================== FITNESS GOALS ====================
export const mockFitnessGoals: FitnessGoal[] = [
  {
    id: '1',
    type: 'weight',
    target: 75,
    current: 77.5,
    unit: 'kg',
    user: 'João',
  },
  {
    id: '2',
    type: 'calories',
    target: 2500,
    current: 2100,
    unit: 'kcal',
    user: 'João',
  },
  {
    id: '3',
    type: 'workouts',
    target: 4,
    current: 3,
    unit: 'semana',
    user: 'João',
  },
  {
    id: '4',
    type: 'weight',
    target: 56,
    current: 57.2,
    unit: 'kg',
    user: 'Myrrena',
  },
  {
    id: '5',
    type: 'calories',
    target: 1800,
    current: 1650,
    unit: 'kcal',
    user: 'Myrrena',
  },
];

// ==================== SUBJECTS ====================
export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Programação',
    color: '#3b82f6',
    icon: 'Code',
    totalHours: 120,
    user: 'João',
  },
  {
    id: '2',
    name: 'Inglês',
    color: '#10b981',
    icon: 'Languages',
    totalHours: 85,
    user: 'João',
  },
  {
    id: '3',
    name: 'Design',
    color: '#f59e0b',
    icon: 'Palette',
    totalHours: 45,
    user: 'João',
  },
  {
    id: '4',
    name: 'Data Science',
    color: '#8b5cf6',
    icon: 'BarChart3',
    totalHours: 60,
    user: 'Myrrena',
  },
  {
    id: '5',
    name: 'Espanhol',
    color: '#ef4444',
    icon: 'Languages',
    totalHours: 40,
    user: 'Myrrena',
  },
  {
    id: '6',
    name: 'Gestão',
    color: '#06b6d4',
    icon: 'Briefcase',
    totalHours: 35,
    user: 'Myrrena',
  },
];

// ==================== STUDY SESSIONS ====================
export const mockStudySessions: StudySession[] = [
  // João's sessions - last 90 days
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `j-ss-${i}`,
    subjectId: ['1', '2', '3'][Math.floor(Math.random() * 3)],
    duration: Math.floor(Math.random() * 120) + 30,
    date: daysAgo(Math.floor(Math.random() * 90)),
    description: 'Estudo regular',
    user: 'João' as const,
  })),
  // Myrrena's sessions
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `m-ss-${i}`,
    subjectId: ['4', '5', '6'][Math.floor(Math.random() * 3)],
    duration: Math.floor(Math.random() * 90) + 45,
    date: daysAgo(Math.floor(Math.random() * 90)),
    description: 'Sessão de estudos',
    user: 'Myrrena' as const,
  })),
];
