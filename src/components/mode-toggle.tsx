import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full bg-white/80 backdrop-blur-sm dark:bg-stone-900/80 border-emerald-200 dark:border-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors shadow-sm"
      title="Cambiar tema claro / oscuro"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] opacity-100 transition-all dark:opacity-0 hidden dark:block text-amber-400" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] opacity-0 transition-all dark:opacity-100 block dark:hidden text-emerald-700" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
