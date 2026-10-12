import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type { WorkShift } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Clock, Trash2, Banknote, Landmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ShiftsTableProps {
  shifts: WorkShift[];
  onUpdateShift: (shift: WorkShift) => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftsTable({ shifts, onUpdateShift, onDeleteShift }: ShiftsTableProps) {
  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = parseISO(dateStr)
      return format(d, "EEE, dd/MM/yyyy", { locale: es })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm transition-all">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-stone-50/80 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px] font-semibold text-stone-700 dark:text-stone-300">Fecha</TableHead>
              <TableHead className="text-center font-semibold text-stone-700 dark:text-stone-300">Horario</TableHead>
              <TableHead className="text-center font-semibold text-stone-700 dark:text-stone-300">H. Totales</TableHead>
              <TableHead className="text-center font-semibold text-stone-700 dark:text-stone-300">Tarifa</TableHead>
              <TableHead className="text-right font-semibold text-stone-700 dark:text-stone-300">Total Ganado</TableHead>
              <TableHead className="font-semibold text-stone-700 dark:text-stone-300">Nota / Tipo</TableHead>
              <TableHead className="text-center w-[120px] font-semibold text-stone-700 dark:text-stone-300">Estado</TableHead>
              <TableHead className="text-center w-[70px] font-semibold text-stone-700 dark:text-stone-300">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-stone-500 dark:text-stone-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="h-8 w-8 text-stone-300 dark:text-stone-600" />
                    <p className="font-medium text-sm">No hay turnos registrados para este mes.</p>
                    <p className="text-xs text-stone-400">Pulsa en "Añadir Turno" para comenzar.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shifts.map((shift) => {
                // Registro especial: Adelanto en efectivo
                if (shift.isAdvance) {
                  return (
                    <TableRow key={shift.id} className="bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/60 dark:hover:bg-amber-950/30">
                      <TableCell className="font-medium text-stone-700 dark:text-stone-300">
                        {formatDateDisplay(shift.date)}
                      </TableCell>
                      <TableCell className="text-center text-stone-400">-</TableCell>
                      <TableCell className="text-center text-stone-400">-</TableCell>
                      <TableCell className="text-center text-stone-400">-</TableCell>
                      <TableCell className="text-right font-bold text-amber-600 dark:text-amber-400">
                        {shift.totalMoney.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400 gap-1 bg-amber-100/50 dark:bg-amber-950/50">
                          <Banknote className="h-3 w-3" />
                          {shift.note || "Efectivo / Adelanto"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          Cobrado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          onClick={() => {
                            if (confirm("¿Eliminar este registro de adelanto?")) {
                              onDeleteShift(shift.id)
                            }
                          }}
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }

                // Registro especial: Nómina recibida
                if (shift.isNomina) {
                  return (
                    <TableRow key={shift.id} className="bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/60 dark:hover:bg-blue-950/30">
                      <TableCell className="font-medium text-stone-700 dark:text-stone-300">
                        {formatDateDisplay(shift.date)}
                      </TableCell>
                      <TableCell className="text-center text-stone-400">-</TableCell>
                      <TableCell className="text-center text-stone-400">-</TableCell>
                      <TableCell className="text-center text-stone-400">-</TableCell>
                      <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                        {shift.totalMoney.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-400 gap-1 bg-blue-100/50 dark:bg-blue-950/50">
                          <Landmark className="h-3 w-3" />
                          {shift.note || "Nómina Banco"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                          Ingresado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          onClick={() => {
                            if (confirm("¿Eliminar este registro de nómina?")) {
                              onDeleteShift(shift.id)
                            }
                          }}
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }

                // Registro ordinario: Turno trabajado
                return (
                  <TableRow
                    key={shift.id}
                    className={`transition-colors ${
                      shift.isPaid
                        ? "bg-stone-50/50 dark:bg-stone-900/40 opacity-75"
                        : "hover:bg-emerald-50/30 dark:hover:bg-stone-800/40"
                    }`}
                  >
                    <TableCell className="font-medium text-stone-800 dark:text-stone-200">
                      {formatDateDisplay(shift.date)}
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {shift.startTime} → {shift.endTime}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                        {shift.totalHoursStr}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {shift.decimalHours.toFixed(2)} h
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs text-stone-500 dark:text-stone-400">
                      {shift.hourlyRate.toFixed(2)} €/h
                    </TableCell>

                    <TableCell className="text-right font-bold text-base text-emerald-600 dark:text-emerald-400">
                      {shift.totalMoney.toFixed(2)} €
                    </TableCell>

                    <TableCell className="text-xs text-stone-600 dark:text-stone-400 max-w-[180px] truncate">
                      {shift.note || <span className="text-stone-300 dark:text-stone-600 italic">Sin nota</span>}
                    </TableCell>

                    <TableCell className="text-center">
                      {shift.isPaid ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1 shadow-sm transition-all"
                          onClick={() => onUpdateShift({ ...shift, isPaid: false })}
                          title="Click para marcar como pendiente"
                        >
                          <Check className="h-3 w-3" /> Cobrado
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/40 font-medium"
                          onClick={() => onUpdateShift({ ...shift, isPaid: true })}
                          title="Click para marcar como cobrado"
                        >
                          Pendiente
                        </Button>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        onClick={() => {
                          if (confirm(`¿Eliminar el turno del ${shift.date}?`)) {
                            onDeleteShift(shift.id)
                          }
                        }}
                        title="Eliminar turno"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
