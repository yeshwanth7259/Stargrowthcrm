import { useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, MoreHorizontal } from "lucide-react"

// Mock data for initial build
const employeesData = [
  { id: 1, name: "Alice Smith", email: "alice@stargrowth.com", role: "Digital Marketing Exec", department: "Marketing", status: "Active" },
  { id: 2, name: "Bob Jones", email: "bob@stargrowth.com", role: "SEO Executive", department: "Marketing", status: "Active" },
  { id: 3, name: "Charlie Davis", email: "charlie@stargrowth.com", role: "Content Writer", department: "Content", status: "On Leave" },
  { id: 4, name: "Diana Prince", email: "diana@stargrowth.com", role: "HR Manager", department: "HR", status: "Active" },
  { id: 5, name: "Evan Wright", email: "evan@stargrowth.com", role: "Web Developer", department: "IT", status: "Active" },
]

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employeesData.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
              <p className="text-muted-foreground">Manage your team members and HR records.</p>
            </div>
            <Button className="shrink-0">
              <Plus size={16} className="mr-2" /> Add Employee
            </Button>
          </div>
          
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search employees..." 
                  className="pl-9 bg-accent/50 border-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{emp.name}</div>
                        <div className="text-muted-foreground text-xs">{emp.email}</div>
                      </td>
                      <td className="px-6 py-4">{emp.role}</td>
                      <td className="px-6 py-4">{emp.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          emp.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No employees found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
              <div>Showing 1 to {filteredEmployees.length} of {employeesData.length} entries</div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  )
}
