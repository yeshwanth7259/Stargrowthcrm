import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"
import { 
  LayoutDashboard, Users, Briefcase, FileText, 
  Settings, PieChart, MessagesSquare, CheckSquare 
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Employees (HR)", href: "/employees" },
  { icon: Briefcase, label: "Clients & Projects", href: "/projects" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: PieChart, label: "Leads & CRM", href: "/leads" },
  { icon: MessagesSquare, label: "Helpdesk", href: "/helpdesk" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mr-3 font-bold">
          SG
        </div>
        <span className="font-bold text-lg tracking-tight">Star Growth</span>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
