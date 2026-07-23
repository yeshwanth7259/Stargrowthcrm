import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../store/authSlice"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Crown, Briefcase, Laptop, UserCircle, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type Department = 'MANAGER' | 'ACCOUNTANT' | 'EMPLOYEE' | 'CLIENT' | null;

export default function Login() {
  const [department, setDepartment] = useState<Department>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if system is initialized
    fetch(`http://${window.location.hostname}:8000/api/v1/setup/status`)
      .then(res => res.json())
      .then(data => {
        if (!data.initialized) {
          navigate("/setup")
        }
      })
      .catch(err => console.error("Failed to check setup status", err))
  }, [navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          email: data.email,
          password: data.password
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid email or password")
      }

      const result = await response.json()
      const user = result.user
      
      if (department && user.role !== department) {
        throw new Error(`Invalid role. You selected ${department} but you are a ${user.role}`)
      }

      dispatch(loginSuccess({ token: result.access_token, user }))
      navigate(`/${user.role.toLowerCase()}/dashboard`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-100">Star Growth Hub</h1>
          <p className="text-sm text-zinc-400 uppercase tracking-widest">Select Your Department To Continue</p>
          <div className="mt-4">
             <button onClick={() => navigate('/setup')} className="text-xs text-primary underline hover:text-primary/80 cursor-pointer">
               First time? Register Workspace
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
          <button onClick={() => setDepartment('MANAGER')} className="bg-zinc-900 border border-zinc-800 hover:border-primary hover:bg-zinc-800/50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center group h-48 cursor-pointer">
            <Crown size={40} className="text-zinc-500 group-hover:text-primary mb-4 transition-colors" />
            <h3 className="font-semibold text-lg text-zinc-200">Owner / Managing Director</h3>
            <p className="text-xs text-zinc-500 mt-2 text-center">Complete company ACCESS</p>
          </button>
          
          <button onClick={() => setDepartment('CLIENT')} className="bg-zinc-900 border border-zinc-800 hover:border-primary hover:bg-zinc-800/50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center group h-48 cursor-pointer">
            <UserCircle size={40} className="text-zinc-500 group-hover:text-primary mb-4 transition-colors" />
            <h3 className="font-semibold text-lg text-zinc-200">Investor / Client</h3>
            <p className="text-xs text-zinc-500 mt-2 text-center">Project & profit reports</p>
          </button>

          <button onClick={() => setDepartment('ACCOUNTANT')} className="bg-zinc-900 border border-zinc-800 hover:border-primary hover:bg-zinc-800/50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center group h-48 cursor-pointer">
            <Briefcase size={40} className="text-zinc-500 group-hover:text-primary mb-4 transition-colors" />
            <h3 className="font-semibold text-lg text-zinc-200">Accountant</h3>
            <p className="text-xs text-zinc-500 mt-2 text-center">Finance & accounting</p>
          </button>

          <button onClick={() => setDepartment('EMPLOYEE')} className="bg-zinc-900 border border-zinc-800 hover:border-primary hover:bg-zinc-800/50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center group h-48 cursor-pointer">
            <Laptop size={40} className="text-zinc-500 group-hover:text-primary mb-4 transition-colors" />
            <h3 className="font-semibold text-lg text-zinc-200">Staff</h3>
            <p className="text-xs text-zinc-500 mt-2 text-center">Agency employee portal</p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        
        <button onClick={() => setDepartment(null)} className="absolute top-6 left-6 text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            {department === 'MANAGER' && <Crown size={24} />}
            {department === 'CLIENT' && <UserCircle size={24} />}
            {department === 'ACCOUNTANT' && <Briefcase size={24} />}
            {department === 'EMPLOYEE' && <Laptop size={24} />}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{department} LOGIN</h2>
          <p className="text-sm text-zinc-400 mt-1">Sign in to access your portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Email Address</label>
            <Input 
              {...register("email")} 
              placeholder="name@company.com" 
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-zinc-300">Password</label>
            </div>
            <Input 
              type="password" 
              {...register("password")} 
              placeholder="••••••••" 
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={loading}>
            {loading ? "Authenticating..." : "Sign in"}
          </Button>

          {department === 'MANAGER' && (
            <div className="mt-4 text-center">
              <button 
                type="button" 
                onClick={() => navigate('/setup')} 
                className="text-sm text-zinc-400 hover:text-primary transition-colors underline cursor-pointer"
              >
                First time? Register Company
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
