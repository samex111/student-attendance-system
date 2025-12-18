import  { Button } from "@/components/ui/button";
import { School, LayoutDashboard, GraduationCap,BookPlus , Users, ClipboardCheck,Settings, LogOut, X, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// import  { SidebarItem } from "@/components/ui/sidebar";
const SidebarItem = ({ icon: Icon, label, path, active }:any) => {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-zinc-900 ${
        active 
          ? "bg-zinc-100 text-zinc-900" 
          : "text-zinc-500 hover:bg-zinc-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default function AdminLayout({ children }:any)  {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
``
  const sidebarContent = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" to="/">
          <School className="h-6 w-6" />
          <span className="">In Charge Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard Overview"  
            path="/admin/dashboard" 
            active={isActive('/admin/dashboard')} 
          />
          <div className="my-2 text-xs font-semibold uppercase text-zinc-500 px-3">
            Management
          </div>
          <SidebarItem 
            icon={GraduationCap} 
            label="Add Student" 
            path="/admin/dashboard/add/student" 
            active={isActive('/admin/dashboard/add/student')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Add Faculty" 
            path="/admin/dashboard/add/faculty" 
            active={isActive('/admin/dashboard/add/faculty')} 
          />
          <SidebarItem 
            icon={ClipboardCheck} 
            label="Attendance" 
            path="/admin/dashboard/attendance" 
            active={isActive('/admin/dashboard/attendance')} 
          />
          <SidebarItem 
            icon={BookPlus} 
            label="Add Subject" 
            path="/admin/dashboard/add/subject" 
            active={isActive('/admin/dashboard/add/subject')} 
          />
           <div className="my-2 text-xs font-semibold uppercase text-zinc-500 px-3">
            System
          </div>
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            path="/admin/dashboard/settings" 
            active={isActive('/admin/dashboard/settings')} 
          />
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
         <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50" onClick={() => navigate('/')}>
            <LogOut className="h-4 w-4" />
            Sign Out
         </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-zinc-50/40 md:block">
        {sidebarContent}
      </div>

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-zinc-50/40 px-6 dark:bg-zinc-800/40 justify-between md:justify-end">
          <Button 
            variant="ghost" 
            className="md:hidden -ml-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">prashantgeetesir@acropolis.in</span>
            <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center">
              <span className="font-semibold text-xs">AD</span>
            </div>
          </div>
        </header>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-zinc-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};
