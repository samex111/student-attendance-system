import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import  { Input } from "@/components/ui/input";
import  { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-select";
import { Users, User, Mail, GraduationCap, Hash, Calendar, BookOpen, Loader2, Save } from "lucide-react";
import  { useState } from "react";

export function AddStudent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNo: "",
    branch: "",
    batch: "",
    year: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Convert numeric strings to numbers for the API
      const payload = {
        ...formData,
        rollNo: Number(formData.rollNo),
        year: Number(formData.year)
      };

      const res = await fetch('http://localhost:3000/api/admin/add/student', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to add student");
      }

      setMessage({ type: 'success', text: 'Student added successfully!' });
      // Optional: Reset form
      setFormData({
        firstName: "", lastName: "", email: "", rollNo: "", branch: "", batch: "", year: ""
      });

    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">Register New Student</CardTitle>
            <CardDescription className="text-slate-500">
              Enter the student's personal and academic details below.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          
          {/* Section: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User size={16} className="text-blue-500" /> 
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="e.g. Sameer"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="e.g. Patel"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-9"
                  placeholder="samxpatel@acropolis.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section: Academic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-500" /> 
              Academic Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <div className="relative">
                  <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="rollNo"
                    name="rollNo"
                    type="number"
                    className="pl-9"
                    placeholder="e.g. 42"
                    value={formData.rollNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <div className="relative">
                   <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                   <Input
                    id="batch"
                    name="batch"
                    className="pl-9"
                    placeholder="e.g. 2025-2029"
                    value={formData.batch}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <div className="relative">
                  <BookOpen className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                  <select
                    id="branch"
                    name="branch"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Branch</option>
                    <option value="CSE">CS</option>
                    <option value="ECE">EC-CORE</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                    <option value="VLSI">VLSI</option>
                    <option value="VLSI">AIML-1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Current Year</Label>
                <select
                  id="year"
                  name="year"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2 pb-6">
           <Button type="button" variant="outline" onClick={() => setFormData({
             firstName: "", lastName: "", email: "", rollNo: "", branch: "", batch: "", year: ""
           })}>
             Clear
           </Button>
           <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[140px]" disabled={isLoading}>
             {isLoading ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Saving...
               </>
             ) : (
               <>
                 <Save className="mr-2 h-4 w-4" />
                 Save Student
               </>
             )}
           </Button>
        </CardFooter>
      </form>
    </Card>
  );
}