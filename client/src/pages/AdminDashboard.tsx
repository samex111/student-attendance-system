import { useState } from "react";
import { 
  User, 
  Mail, 
  Hash, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Loader2, 
  Save,
  Users,
  Link
} from "lucide-react";

// Assuming you have these Shadcn components installed in your project
// If not, standard HTML elements with the Tailwind classes below will work too.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AddFaculty from "@/customComponent/AddFAculty";

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
//       <AddStudent />
//       <AddFaculty/>
      
//     </div>
//   );
// }
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 space-y-4">
    <h1 className="text-4xl font-bold text-zinc-900">University Portal</h1>
    <div className="flex gap-4">
      <Link to="/signin"><Button variant="outline">Student Login</Button></Link>
      <Link to="/admin/signin"><Button>Admin Login</Button></Link>
    </div>
  </div>
);
