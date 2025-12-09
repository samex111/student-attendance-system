import { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  BookOpen, 
  Fingerprint, 
  Loader2, 
  Save, 
  Plus,
  X,
  Eye,
  EyeOff,
  Briefcase
} from "lucide-react";

// Assuming Shadcn/Tailwind setup
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export default function AddFaculty() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subjectId: "", // This maps to the ObjectId reference in your schema
  });

  // Specific state for the "subject" array
  const [currentSubjectInput, setCurrentSubjectInput] = useState("");
  const [subjectsList, setSubjectsList] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Logic to handle adding subjects to the array
  const handleAddSubject = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (currentSubjectInput.trim() && !subjectsList.includes(currentSubjectInput.trim())) {
      setSubjectsList([...subjectsList, currentSubjectInput.trim()]);
      setCurrentSubjectInput("");
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjectsList(subjectsList.filter(s => s !== subjectToRemove));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Basic Validation for the Array
    if (subjectsList.length === 0) {
        setMessage({ type: 'error', text: 'Please add at least one subject.' });
        setIsLoading(false);
        return;
    }

    try {
      // Construct payload according to your Zod Schema
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        subjectId: formData.subjectId,
        subject: subjectsList // The array of strings
      };

      // Adjust the URL to match your Router mounting point (e.g., /api/admin/create/faculty)
      const res = await fetch('http://localhost:3000/api/admin/create/faculty', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add faculty");
      }

      setMessage({ type: 'success', text: 'Faculty created successfully!' });
      
      // Reset form
      setFormData({ firstName: "", lastName: "", email: "", password: "", subjectId: "" });
      setSubjectsList([]);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Briefcase size={24} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">Register New Faculty</CardTitle>
            <CardDescription className="text-slate-500">
              Create credentials and assign subjects to new faculty members.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          
          {/* Section: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User size={16} className="text-indigo-500" /> 
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="e.g. Himanshu"
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
                  placeholder="e.g. Bhiwapurkar"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section: Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Lock size={16} className="text-indigo-500" /> 
              Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-9"
                    placeholder="faculty@acropolis.in"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section: Academic Assignment */}
          <div className="space-y-2">
                <Label>Subjects Taught</Label>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Type subject (e.g. mactronic lab and design) and click Add" 
                        value={currentSubjectInput}
                        onChange={(e) => setCurrentSubjectInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubject(e as any);
                            }
                        }}
                    />
                    <Button type="button" onClick={handleAddSubject} variant="secondary" className="bg-slate-200 hover:bg-slate-300">
                        <Plus size={18} />
                    </Button>
                </div>
                
                {/* Subject Chips/Badges */}
                <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] p-2 bg-slate-50 rounded-md border border-dashed border-slate-300">
                    {subjectsList.length === 0 && (
                        <span className="text-sm text-slate-400 italic flex items-center">No subjects added yet.</span>
                    )}
                    {subjectsList.map((subject, index) => (
                        <div key={index} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {subject}
                            <button 
                                type="button" 
                                onClick={() => handleRemoveSubject(subject)}
                                className="hover:text-indigo-900 focus:outline-none ml-1"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" /> 
              Academic Assignment
            </h3>

            <div className="space-y-2">
               <Label htmlFor="subjectId">Primary Subject ID (Reference)</Label>
               <div className="relative">
                  <Fingerprint className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="subjectId"
                    name="subjectId"
                    className="pl-9"
                    placeholder="Paste Subject ObjectId here"
                    value={formData.subjectId}
                    onChange={handleChange}
                    required
                  />
               </div>
               <p className="text-[10px] text-slate-500">This links the faculty to the Subject collection in the database.</p>
            </div>

            
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <Save size={16} /> : <X size={16} />}
              {message.text}
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2 pb-6">
           <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
                setFormData({ firstName: "", lastName: "", email: "", password: "", subjectId: "" });
                setSubjectsList([]);
            }}>
             Clear
           </Button>
           <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]" disabled={isLoading}>
             {isLoading ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Creating...
               </>
             ) : (
               <>
                 <Save className="mr-2 h-4 w-4" />
                 Create Faculty
               </>
             )}
           </Button>
        </CardFooter>
      </form>
    </Card>
  );
}