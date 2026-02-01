import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // ✅ correct import (not from radix directly)
import { Eye, Mail, Key  } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { User, Lock, Loader2 } from "lucide-react"
import { Backend_URL } from "@/lib/config"



export default function AdminSignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secretkey, setSecretkey] = useState("")
  const [otp, setOtp] = useState("")
  const [username, setUsername] = useState("")

  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [type,setType] = useState('password')

  const handleSignup = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${Backend_URL}/api/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:email, username:username, password:password , secretkey:secretkey }),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        setOtpSent(true)
        alert("OTP sent to your email ✅")
      } else {
        alert(data.msg || "Signup failed ❌")
      }
    } catch (e) {
      console.error(e)
      alert("Error during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${Backend_URL}/api/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        alert("Signup verified 🎉")
        // navigate("/user/signin")
      } else {
        alert(data.msg || "OTP verification failed ❌")
        setOtpSent(false)
      }
    } catch (e) {
      console.error(e)
      alert("Error verifying OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center  px-4 bg-[linear-gradient(135deg,#f6e8f4_0%,#f0eefa_50%,#dee8fe_100%)]">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold text-gray-800">
            Create your account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative  ">
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              className="pl-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            </div>

          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">

              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <Input
              id="password"
              type={type}
              placeholder="••••••••"
                className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
           { type === "password" ?<Eye onClick={()=>setType("text")}  className="absolute right-3 top-2.5 h-5 w-5 text-gray-500"/>
              : <EyeOff onClick={()=>setType("password")}  className="absolute right-3 top-2.5 h-5 w-5 text-gray-500"/>}
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
        

          {/* OTP Field (show only after signup) */}
          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {!otpSent ? (
            <Button onClick={handleSignup} disabled={loading || !email  || !password }>
              {loading ? <Loader2 className="animate-spin  h-4 w-4" /> : "Send OTP "}
            </Button>
          ) : (
            <Button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <Loader2 className="animate-spin  h-4 w-4" /> : "Verify OTP"}
            </Button>
          )}

          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/admin/signin")}
          >
            Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}