import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, BookOpen, Hash, Calendar, Clock, Check } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the API endpoint
const API_URL = "http://localhost:3000/api/admin/add/subject"; // Assuming your AdminRouter is exposed at /api/admin

export default function AddSubjectForm() {
  // --- State Management ---
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [year, setYear] = useState<string>(""); // Use string for select input, parse to number for API
  const [sem, setSem] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // --- Utility Data ---
  const years = ["1", "2", "3", "4"];
  const semesters = ["1", "2"];
  const slots = ["1", "2", "3", "4", "5", "6"];

  // --- Validation & Submission ---
  const isFormValid = name && code && year && sem && slot;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.warning("Incomplete Form", { description: "Please fill in all subject details." });
      return;
    }

    setLoading(true);

    const payload = {
      name,
      code,
      year: parseInt(year),
      sem: parseInt(sem),
      slot: parseInt(slot),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // Ensure cookies are sent if authentication relies on them
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Subject Added Successfully! ✅", {
          description: `Subject: ${name} (Code: ${code})`,
        });
        // Clear form fields on success
        setName("");
        setCode("");
        setYear("");
        setSem("");
        setSlot("");
      } else {
        toast.error("Subject Creation Failed ❌", {
          description: data.msg || "Check console for API error details.",
        });
        console.error("Backend error:", data);
      }
    } catch (error) {
      toast.error("Network Error", {
        description: "Could not connect to the subject creation service.",
      });
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" richColors />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Add New Subject
          </CardTitle>
          <CardDescription>
            Input all required academic details for the new course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Name and Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subjectName">Subject Name</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="subjectName"
                    type="text"
                    placeholder="e.g., MATHS , CHEMISTRY"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectCode">Subject Code</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="subjectCode"
                    type="text"
                    placeholder="e.g., BT-101"
                    className="pl-10 uppercase"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Details: Year, Semester, Slot */}
            <div className="grid grid-cols-3 gap-6">
              {/* Year */}
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        Year {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={sem} onValueChange={setSem} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lecture Slot */}
              <div className="space-y-2">
                <Label>Lecture Slot</Label>
                <Select value={slot} onValueChange={setSlot} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {slots.map((s) => (
                      <SelectItem key={s} value={s}>
                        Slot {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submission Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 font-semibold"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Adding Subject...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Confirm & Add Subject
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}