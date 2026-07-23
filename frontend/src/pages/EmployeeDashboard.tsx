import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { logout } from "../store/authSlice"
import { useNavigate } from "react-router-dom"
import { Laptop, LogOut } from "lucide-react"

export default function EmployeeDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <Laptop size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Staff Portal</h1>
              <p className="text-zinc-400">Welcome back, {user?.full_name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-zinc-400 font-semibold mb-4">Today's Tasks</h3>
            <p className="text-sm text-zinc-500">No tasks assigned yet.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-zinc-400 font-semibold mb-4">Attendance</h3>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-lg w-full">Clock In</button>
          </div>
        </div>
      </div>
    </div>
  )
}
