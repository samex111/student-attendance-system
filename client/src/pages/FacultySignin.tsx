import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Loader2, Eye, EyeOff, School } from "lucide-react";
import { toast, Toaster } from "sonner"; // Using Sonner for beautiful alerts
import { Backend_URL } from "@/lib/config";

export default function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const res = await fetch(`${Backend_URL}/api/faculty/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Store credentials
        localStorage.setItem("StudentID", data.studentId); // Assuming API returns this
        localStorage.setItem("SubjectId", data.subjectId);
        
        toast.success("Welcome back!", {
          description: "Signin successful.",
        });
        
        // Small delay to let the user see the success message
        setTimeout(() => navigate("/faculty/dashboard"), 800);
      } else {
        toast.error("Signin Failed", {
          description: data.msg || "Invalid credentials",
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("System Error", {
        description: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      <Toaster position="top-right" richColors />

      {/* --- Background Effects --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
      </div>

      {/* --- Main Card --- */}
      <Card className="relative z-10 w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-md animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <School className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Faculty Portal
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600">Email Address</Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="faculty@college.edu"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-600">Password</Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="px-0 font-normal text-xs text-slate-500 h-auto">
                    Forgot password?
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

      </Card>
      
      {/* Footer Copyright */}
      <div className="absolute bottom-4 text-xs text-slate-400">
        © 2024 College Admin Portal. Secure Login.
      </div>
    </div>
  );
}