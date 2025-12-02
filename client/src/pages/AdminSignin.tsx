import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Loader2 } from "lucide-react"
import { Eye } from 'lucide-react';
import { EyeOff , Key} from 'lucide-react';


export default function AdminSignin() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [secretkey, setSecretkey] = useState("")
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('password')

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/faculty/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifire: identifier, password: password,secretkey:secretkey }),
        credentials: "include",
      })
        
      const data = await res.json()
      localStorage.setItem("StudentID", data.studentId)

      if (res.ok) {
        alert("Signin successful ✅")
        navigate("/dashboard")
      } else {
        alert(data.msg || "Signin failed ❌")
      }
    } catch (e) {
      console.error(e)
      alert("Error during signin : " + e)
    } finally {
      setLoading(false)
      console.log("identifire: ",identifier)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[linear-gradient(135deg,#f6e8f4_0%,#f0eefa_50%,#dee8fe_100%)] px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold text-gray-800">
            Welcome Back 👋
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" /> 
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your username or email"
                className="pl-10"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              {type === "password" ? <Eye onClick={() => setType("text")} className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                : <EyeOff onClick={() => setType("password")} className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />}
              <Input
                id="password"
                type={type}
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

              />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="username">Secret key</Label>
            <div className="relative  ">
            < Key  className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
            <Input
              id="username"
              type="text"
              placeholder="Enter secret key"
              className="pl-10"
              value={secretkey}
              onChange={(e) => setSecretkey(e.target.value)}
            />
            </div>

          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={handleSignIn}
            className="w-full"
            disabled={loading || !identifier || !password}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}