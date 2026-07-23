import { 
  Chart as ChartJS, 
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend 
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { Users, TrendingUp, DollarSign, Briefcase } from "lucide-react"

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend
)

const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [65000, 59000, 80000, 81000, 56000, 95000, 110000],
      borderColor: 'hsl(var(--primary))',
      backgroundColor: 'hsl(var(--primary) / 0.5)',
      tension: 0.4,
    },
  ],
};

const barChartData = {
  labels: ['SEO', 'Google Ads', 'Meta Ads', 'Content', 'Web Dev'],
  datasets: [
    {
      label: 'Active Projects',
      data: [12, 19, 15, 8, 5],
      backgroundColor: 'hsl(var(--primary))',
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Welcome back to Star Growth Hub!</span>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                <p className="text-2xl font-bold">$110,000</p>
              </div>
            </div>
            
            <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
                <p className="text-2xl font-bold">59</p>
              </div>
            </div>
            
            <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Leads</h3>
                <p className="text-2xl font-bold">1,240</p>
              </div>
            </div>
            
            <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
                <p className="text-2xl font-bold">14.5%</p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-card border rounded-xl shadow-sm h-[400px]">
              <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
              <div className="h-[300px]">
                <Line options={chartOptions} data={lineChartData} />
              </div>
            </div>
            <div className="p-6 bg-card border rounded-xl shadow-sm h-[400px]">
              <h3 className="text-lg font-semibold mb-4">Projects by Department</h3>
              <div className="h-[300px]">
                <Bar options={chartOptions} data={barChartData} />
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  )
}
