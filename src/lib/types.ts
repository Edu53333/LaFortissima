export interface WorkShift {
  id: string;
  date: string; // Formato YYYY-MM-DD
  startTime: string; // Formato "HH:mm", ej: "13:00"
  endTime: string; // Formato "HH:mm", ej: "21:30"
  totalHoursStr: string; // Formato "8h 30m"
  decimalHours: number; // Ej: 8.50
  hourlyRate: number; // Por defecto 8.00 €/h
  totalMoney: number; // decimalHours * hourlyRate
  note?: string; // Nota o concepto opcional
  isPaid?: boolean; // True si ya fue cobrado
  isAdvance?: boolean; // True si es un registro de adelanto / efectivo recibido
  isNomina?: boolean; // True si es un cobro por nómina/transferencia
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

/**
 * Calcula las horas trabajadas entre dos marcas de tiempo "HH:mm".
 * Maneja automáticamente turnos nocturnos que cruzan la medianoche
 * (ejemplo: de 21:00 a 03:00 = 6h).
 */
export function calculateShiftDuration(startTime: string, endTime: string): {
  decimalHours: number;
  totalHoursStr: string;
  totalMinutes: number;
} {
  if (!startTime || !endTime) {
    return { decimalHours: 0, totalHoursStr: "0h 00m", totalMinutes: 0 };
  }

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
    return { decimalHours: 0, totalHoursStr: "0h 00m", totalMinutes: 0 };
  }

  let startTotalM = startH * 60 + startM;
  let endTotalM = endH * 60 + endM;

  // Si la hora de fin es menor o igual a la de inicio, asumimos que pasa la medianoche
  if (endTotalM <= startTotalM) {
    endTotalM += 24 * 60;
  }

  const diffMinutes = endTotalM - startTotalM;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const decimalHours = Number((diffMinutes / 60).toFixed(2));
  const totalHoursStr = `${hours}h ${minutes.toString().padStart(2, "0")}m`;

  return {
    decimalHours,
    totalHoursStr,
    totalMinutes: diffMinutes,
  };
}

export const DEFAULT_HOURLY_RATE = 8.0;

export const SEED_SHIFTS: WorkShift[] = [
  {
    id: "shift-domingo-11",
    date: "2026-10-11",
    startTime: "16:00",
    endTime: "02:00",
    totalHoursStr: "10h 00m",
    decimalHours: 10.0,
    hourlyRate: 8.0,
    totalMoney: 80.0,
    note: "Turno domingo",
    isPaid: false,
  },
];
