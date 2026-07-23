import { useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, Calendar, MoreHorizontal } from "lucide-react"

// Mock data
const projectsData = [
  { id: 1, name: "Website Redesign", client: "Acme Corp", status: "In Progress", deadline: "2026-08-15", progress: 65 },
  { id: 2, name: "SEO Optimization", client: "TechFlow", status: "Completed", deadline: "2026-07-20", progress: 100 },
  { id: 3, name: "Social Media Campaign", client: "Stellar Foods", status: "Planning", deadline: "2026-09-01", progress: 10 },
  { id: 4, name: "App Development", client: "Nexus Inc", status: "In Progress", deadline: "2026-10-30", progress: 40 },
]

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projectsData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "text-green-500 bg-green-500/10"
      case "In Progress": return "text-blue-500 bg-blue-500/10"
      case "Planning": return "text-amber-500 bg-amber-500/10"
      default: return "text-gray-500 bg-gray-500/10"
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">Manage active client projects and deliverables.</p>
            </div>
            <Button className="shrink-0">
              <Plus size={16} className="mr-2" /> New Project
            </Button>
          </div>
          
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search projects or clients..." 
                className="pl-9 bg-accent/50 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Board View</Button>
              <Button variant="outline" size="sm">List View</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
                
                <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Client: {project.client}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center text-muted-foreground"><Calendar size={14} className="mr-1" /> Deadline</span>
                    <span className="font-medium">{project.deadline}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-accent/20 rounded-xl border border-dashed">
              No projects found matching "{searchTerm}"
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
