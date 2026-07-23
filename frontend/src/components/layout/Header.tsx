import { useDispatch, useSelector } from "react"
import type { RootState } from "../../store"
import { logout } from "../../store/authSlice"
import { Button } from "../ui/button"
import { Bell, Search, Sun, Moon, Menu, LogOut } from "lucide-react"
import { useTheme } from "../ThemeProvider"

export default function Header() {
  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
        <div className="relative hidden md:flex items-center">
          <Search size={16} className="absolute left-3 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search anything (Cmd+K)" 
            className="pl-9 pr-4 py-1.5 h-9 bg-accent/50 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary w-72 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm ml-2 border">
          {auth.user?.email?.[0].toUpperCase() || "U"}
        </div>
        <Button variant="ghost" size="icon" className="ml-1 text-muted-foreground hover:text-destructive" onClick={() => dispatch(logout())}>
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  )
}
