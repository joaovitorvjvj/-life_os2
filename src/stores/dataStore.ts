import { create } from '@/lib/zustand';
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
  StudySession,
  User 
} from '@/types';
import { 
  mockTasks, 
  mockTransactions, 
  mockAccounts, 
  mockFinancialGoals,
  mockMeals,
  mockWorkouts,
  mockMeasurements,
  mockFitnessGoals,
  mockSubjects,
  mockStudySessions
} from '@/lib/mocks';

interface DataState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByUser: (user: User) => Task[];
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByUser: (user: User) => Transaction[];
  
  // Accounts
  accounts: Account[];
  getAccountsByUser: (user: User) => Account[];
  
  // Financial Goals
  financialGoals: FinancialGoal[];
  getFinancialGoalsByUser: (user: User) => FinancialGoal[];
  
  // Meals
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;
  getMealsByUser: (user: User) => Meal[];
  getMealsByDate: (user: User, date: Date) => Meal[];
  
  // Workouts
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsByUser: (user: User) => Workout[];
  
  // Measurements
  measurements: BodyMeasurement[];
  addMeasurement: (measurement: Omit<BodyMeasurement, 'id'>) => void;
  deleteMeasurement: (id: string) => void;
  getMeasurementsByUser: (user: User) => BodyMeasurement[];
  
  // Fitness Goals
  fitnessGoals: FitnessGoal[];
  getFitnessGoalsByUser: (user: User) => FitnessGoal[];
  
  // Subjects
  subjects: Subject[];
  getSubjectsByUser: (user: User) => Subject[];
  
  // Study Sessions
  studySessions: StudySession[];
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
  deleteStudySession: (id: string) => void;
  getStudySessionsByUser: (user: User) => StudySession[];
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial data
  tasks: mockTasks,
  transactions: mockTransactions,
  accounts: mockAccounts,
  financialGoals: mockFinancialGoals,
  meals: mockMeals,
  workouts: mockWorkouts,
  measurements: mockMeasurements,
  fitnessGoals: mockFitnessGoals,
  subjects: mockSubjects,
  studySessions: mockStudySessions,
  
  // Task actions
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  updateTask: (id, task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
  
  getTasksByUser: (user) => get().tasks.filter((t) => t.user === user),
  
  // Transaction actions
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ transactions: [...state.transactions, newTransaction] }));
  },
  
  updateTransaction: (id, transaction) => {
    set((state) => ({
      transactions: state.transactions.map((t) => 
        t.id === id ? { ...t, ...transaction } : t
      ),
    }));
  },
  
  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
  
  getTransactionsByUser: (user) => get().transactions.filter((t) => t.user === user),
  
  // Accounts
  getAccountsByUser: (user) => get().accounts.filter((a) => a.user === user),
  
  // Financial Goals
  getFinancialGoalsByUser: (user) => get().financialGoals.filter((g) => g.user === user),
  
  // Meal actions
  addMeal: (meal) => {
    const newMeal: Meal = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ meals: [...state.meals, newMeal] }));
  },
  
  deleteMeal: (id) => {
    set((state) => ({
      meals: state.meals.filter((m) => m.id !== id),
    }));
  },
  
  getMealsByUser: (user) => get().meals.filter((m) => m.user === user),
  
  getMealsByDate: (user, date) => {
    const dateStr = date.toDateString();
    return get().meals.filter(
      (m) => m.user === user && m.date.toDateString() === dateStr
    );
  },
  
  // Workout actions
  addWorkout: (workout) => {
    const newWorkout: Workout = {
      ...workout,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ workouts: [...state.workouts, newWorkout] }));
  },
  
  deleteWorkout: (id) => {
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },
  
  getWorkoutsByUser: (user) => get().workouts.filter((w) => w.user === user),
  
  // Measurement actions
  addMeasurement: (measurement) => {
    const newMeasurement: BodyMeasurement = {
      ...measurement,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ 
      measurements: [...state.measurements, newMeasurement] 
    }));
  },
  
  deleteMeasurement: (id) => {
    set((state) => ({
      measurements: state.measurements.filter((m) => m.id !== id),
    }));
  },
  
  getMeasurementsByUser: (user) => 
    get().measurements.filter((m) => m.user === user),
  
  // Fitness Goals
  getFitnessGoalsByUser: (user) => 
    get().fitnessGoals.filter((g) => g.user === user),
  
  // Subjects
  getSubjectsByUser: (user) => 
    get().subjects.filter((s) => s.user === user),
  
  // Study Session actions
  addStudySession: (session) => {
    const newSession: StudySession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ 
      studySessions: [...state.studySessions, newSession] 
    }));
  },
  
  deleteStudySession: (id) => {
    set((state) => ({
      studySessions: state.studySessions.filter((s) => s.id !== id),
    }));
  },
  
  getStudySessionsByUser: (user) => 
    get().studySessions.filter((s) => s.user === user),
}));
