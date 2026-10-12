import { useState, useEffect } from 'react';
import type { WorkShift, Goal } from './types';
import { SEED_SHIFTS, DEFAULT_HOURLY_RATE } from './types';
import { db, auth } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';

const STORAGE_KEYS = {
  SHIFTS: 'la_fortissima_shifts',
  GOALS: 'la_fortissima_goals',
  RATE: 'la_fortissima_hourly_rate',
};

export function useDashboard() {
  const [shifts, setShifts] = useState<WorkShift[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
      if (saved) {
        const parsed: WorkShift[] = JSON.parse(saved);
        const filtered = parsed.filter(s => !s.id.startsWith("seed-"));
        if (filtered.length === 0) return SEED_SHIFTS;
        return filtered;
      }
      return SEED_SHIFTS;
    } catch {
      return SEED_SHIFTS;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hourlyRate, setHourlyRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATE);
      return saved ? parseFloat(saved) : DEFAULT_HOURLY_RATE;
    } catch {
      return DEFAULT_HOURLY_RATE;
    }
  });

  const [user, setUser] = useState<User | null>(null);
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Escuchar estado de autenticación con Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsFirebaseLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // Sincronización en tiempo real desde Firebase Firestore (Lectura)
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "lafortissima_users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        // Evitar bucles infinitos comparando si los datos recibidos difieren de los locales
        const serverShiftsStr = JSON.stringify(data.shifts || []);
        const localShiftsStr = localStorage.getItem(STORAGE_KEYS.SHIFTS) || '[]';
        if (serverShiftsStr !== localShiftsStr && data.shifts) {
          setShifts(data.shifts);
          localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(data.shifts));
        }

        const serverGoalsStr = JSON.stringify(data.goals || []);
        const localGoalsStr = localStorage.getItem(STORAGE_KEYS.GOALS) || '[]';
        if (serverGoalsStr !== localGoalsStr && data.goals) {
          setGoals(data.goals);
          localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
        }

        if (typeof data.hourlyRate === 'number' && data.hourlyRate > 0) {
          const localRate = parseFloat(localStorage.getItem(STORAGE_KEYS.RATE) || '8');
          if (data.hourlyRate !== localRate) {
            setHourlyRateState(data.hourlyRate);
            localStorage.setItem(STORAGE_KEYS.RATE, data.hourlyRate.toString());
          }
        }
      }
      setIsFirebaseLoaded(true);
    }, (error) => {
      console.error("Error al sincronizar con Firestore:", error);
      setIsFirebaseLoaded(true);
    });

    return () => unsub();
  }, [user]);

  // Auto-guardado en Firebase Firestore (Escritura con Debounce)
  useEffect(() => {
    if (!user || !isFirebaseLoaded || !hasLocalChanges) return;

    const timeoutId = setTimeout(() => {
      setDoc(doc(db, "lafortissima_users", user.uid), {
        shifts: shifts || [],
        goals: goals || [],
        hourlyRate: hourlyRate || DEFAULT_HOURLY_RATE,
        updatedAt: new Date().toISOString()
      }, { merge: true }).then(() => {
        setHasLocalChanges(false);
      }).catch(console.error);
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [shifts, goals, hourlyRate, user, isFirebaseLoaded, hasLocalChanges]);

  const addShift = (shift: WorkShift) => {
    setShifts(prev => {
      const updated = [...prev, shift].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const updateShift = (shift: WorkShift) => {
    setShifts(prev => {
      const updated = prev.map(s => (s.id === shift.id ? shift : s)).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const deleteShift = (id: string) => {
    setShifts(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => {
      const updated = [...prev, goal];
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const updateGoal = (goal: Goal) => {
    setGoals(prev => {
      const updated = prev.map(g => (g.id === goal.id ? goal : g));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== id);
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const setHourlyRate = (rate: number) => {
    if (!isNaN(rate) && rate > 0) {
      setHourlyRateState(rate);
      localStorage.setItem(STORAGE_KEYS.RATE, rate.toString());
      setHasLocalChanges(true);
    }
  };

  return {
    shifts,
    addShift,
    updateShift,
    deleteShift,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    hourlyRate,
    setHourlyRate,
    user,
  };
}
