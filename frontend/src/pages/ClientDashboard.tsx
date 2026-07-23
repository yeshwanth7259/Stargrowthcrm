import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { logout } from "../store/authSlice"
import { useNavigate } from "react-router-dom"
import { UserCircle, LogOut } from "lucide-react"

export default function ClientDashboard() {
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
              <UserCircle size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Client Portal</h1>
              <p className="text-zinc-400">Welcome, {user?.full_name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-zinc-400 font-semibold mb-4">Active Projects</h3>
            <p className="text-sm text-zinc-500">No active projects to display.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
