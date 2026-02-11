// User Types
export type User = 'João' | 'Myrrena';

export interface UserProfile {
  name: User;
  email: string;
  avatar: string;
  color: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Task Types
export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';
export type TaskPriority = 'alta' | 'media' | 'baixa';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  user: User;
}

// Financial Types
export type TransactionType = 'entrada' | 'saida';
export type TransactionCategory = 
  | 'salario' 
  | 'freelance' 
  | 'investimentos' 
  | 'alimentacao' 
  | 'transporte' 
  | 'moradia' 
  | 'lazer' 
  | 'saude' 
  | 'educacao' 
  | 'outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
  accountId: string;
  user: User;
}

export interface Account {
  id: string;
  name: string;
  bank: string;
  balance: number;
  color: string;
  user: User;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  color: string;
  user: User;
}

// Fitness Types
export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
  mealType: 'cafe' | 'almoco' | 'jantar' | 'lanche';
  user: User;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: Date;
  duration: number;
  user: User;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface BodyMeasurement {
  id: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
  user: User;
}

export interface FitnessGoal {
  id: string;
  type: 'weight' | 'calories' | 'workouts';
  target: number;
  current: number;
  unit: string;
  user: User;
}

// Study Types
export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalHours: number;
  user: User;
}

export interface StudySession {
  id: string;
  subjectId: string;
  duration: number;
  date: Date;
  description?: string;
  user: User;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  type: 'tasks' | 'finance' | 'fitness' | 'studies';
  title: string;
  position: number;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

// Heatmap Data
export interface HeatmapData {
  date: string;
  value: number;
}
