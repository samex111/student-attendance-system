import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Loader2, Eye, EyeOff, Key, Shield } from "lucide-react";
import { toast, Toaster } from "sonner"; // Import Toaster for better UX
import { Backend_URL } from "@/lib/config";

export default function AdminSignin() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [secretkey, setSecretkey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Use boolean for clearer toggle logic

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission if wrapped in a form
    
    if (!identifier || !password || !secretkey) {
        toast.warning("Missing Fields", { description: "Please enter your username/email, password, AND the Secret Key." });
        return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`${Backend_URL}/api/admin/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier:identifier, password:password, secretkey:secretkey }),
        credentials: "include",
      });
        
      const data = await res.json();
      
      // NOTE: Storing StudentID for Admin is usually incorrect, but keeping the user's original logic structure.
      // If this is the Admin's ID, rename it: localStorage.setItem("AdminID", data.adminId)
      localStorage.setItem("StudentID", data.studentId);

      if (res.ok) {
        toast.success("Access Granted ✅", {
            description: "Welcome to the Admin Dashboard.",
        });
        setTimeout(() => navigate("/admin/dashboard"), 800); // Add a slight delay for the toast to be seen
      } else {
        toast.error("Login Failed ❌", {
            description: data.msg || "Invalid credentials or secret key.",
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error", {
        description: "Could not connect to the authentication server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-slate-50 overflow-hidden px-4">
      <Toaster position="top-right" richColors />

      {/* Background Grid and Blur effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/4 top-0 -z-10 m-auto h-[350px] w-[350px] rounded-full bg-indigo-400 opacity-10 blur-[120px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-pink-400 opacity-10 blur-[120px]"></div>
      </div>

      {/* Admin Sign-in Card */}
      <Card className="relative z-10 w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Portal Access
          </CardTitle>
          <CardDescription className="text-slate-500">
            Secure login requires your credentials and secret key.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Identifier (Username or Email) */}
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" /> 
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your username or email"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1} // Prevent focus with tab key
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Secret Key - Enhanced Visual Importance */}
            <div className="space-y-2">
              <Label htmlFor="secretkey" className="text-red-600 font-semibold">Secret Key (Admin Only)</Label>
              <div className="relative group">
                <Key className="absolute left-3 top-2.5 h-5 w-5 text-red-500 group-focus-within:text-red-700 transition-colors" />
                <Input
                  id="secretkey"
                  type="text"
                  placeholder="Enter secret key"
                  className="pl-10 h-11 border-red-300 bg-red-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all"
                  value={secretkey}
                  onChange={(e) => setSecretkey(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            onClick={handleSignIn}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all font-semibold"
            disabled={loading || !identifier || !password || !secretkey}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Verifying Access...
              </>
            ) : (
              "Secure Sign In"
            )}
          </Button>

          {/* Removed Register button, as Admin access is usually tightly controlled */}
           <p className="text-xs text-center text-slate-500 mt-2">
            Access restricted. Contact support if you have lost your credentials.
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}