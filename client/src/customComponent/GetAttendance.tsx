import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, AlertCircle, BookOpen, GraduationCap, BarChart3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Types based on your Backend Response ---
interface SubjectStat {
  subjectId: string;
  subjectName: string;
  presentCount: number;
  totalLectures: number;
}

interface StudentAttendance {
  studentId: string;
  rollNo: number;
  name: string;
  branch: string;
  subjects: SubjectStat[];
  totalLectures: number;
  totalPresent: number;
  percentage: number;
}

export default function BranchAttendance() {
  const [branchInput, setBranchInput] = useState("");
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Helper to determine color based on percentage
  const getStatusBadge = (percentage: number) => {
    if (percentage >= 75) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Good</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Critical</Badge>;
  };

  // Fetch Function
  const fetchAttendance = async () => {
    if (!branchInput.trim()) return;
    
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      // Adjust URL to match your API route structure
      const res = await fetch(`http://localhost:3000/api/admin/students/attendance/${branchInput}`,{
        credentials:"include"
      });
      const json = await res.json();

      if (json.success) {
        setStudents(json.data);
      } else {
        setError(json.message || "Failed to fetch data");
        setStudents([]);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Class Stats
  const classAverage = students.length > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.percentage, 0) / students.length) 
    : 0;

  const lowAttendanceCount = students.filter(s => s.percentage < 60).length;

  return (
    <div className="space-y-6 p-1 md:p-6">
      
      {/* --- Header & Search Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branch Attendance</h1>
          <p className="text-muted-foreground">Monitor student attendance and subject-wise performance.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* <Input 
            placeholder="Enter Branch (e.g., VLSI, CSE)" 
            value={branchInput}
            onChange={(e) => setBranchInput(e.target.value)}
            className="w-full md:w-64"
            onKeyDown={(e) => e.key === "Enter" && fetchAttendance()}
          /> */}
              <Select
                value={branchInput}   // ✅ yahan ALL fallback
                onValueChange={(value) => {
                 setBranchInput(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>

                <SelectContent  onClick={fetchAttendance}>
                  {/* ✅ EMPTY STRING HATA DIYA */}
                  <SelectItem onClick={fetchAttendance} value="VLSI">VLSI</SelectItem>
                  <SelectItem onClick={fetchAttendance} value="CYB">CYB</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                </SelectContent>
              </Select>

          <Button onClick={fetchAttendance} disabled={loading}>
            {loading ? "Loading..." : <><Search className="mr-1 h-4 w-4" />Search</>}
          </Button>

  
          

        </div>
      </div>

      {/* --- Error Handling --- */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* --- Statistics Cards (Only show if data exists) --- */}
      {students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Average</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classAverage}%</div>
              <Progress value={classAverage} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Attendance (less than 60%)</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowAttendanceCount}</div>
              <p className="text-xs text-muted-foreground">Students at risk of detainment</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Main Data Table --- */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Student List: {branchInput.toUpperCase() || "..."}</CardTitle>
          <CardDescription>
            {hasSearched && students.length === 0 
              ? "No students found for this branch." 
              : "Detailed attendance report per student."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-[200px]">Overall Attendance</TableHead>
                  <TableHead>Lectures</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.branch}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-sm font-bold">{student.percentage}%</span>
                        <Progress 
                          value={student.percentage} 
                          className="h-2 w-[100px]" 
                          // You can add a custom color class prop to shadcn progress if needed, 
                          // otherwise it defaults to primary color
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                       {student.totalPresent} / {student.totalLectures}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student.percentage)}
                    </TableCell>
                    <TableCell className="text-right">
                      <SubjectDetailsDialog student={student} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <BookOpen className="h-12 w-12 mb-2 opacity-20" />
                <p>Enter a branch name to view attendance.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Sub-Component: Details Dialog ---
function SubjectDetailsDialog({ student }: { student: StudentAttendance }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Subjects</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attendance Details</DialogTitle>
          <DialogDescription>
            Subject-wise breakdown for <span className="font-semibold text-primary">{student.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
             {student.subjects.map((sub) => {
                 // Calculate individual subject percentage
                 const subPercent = sub.totalLectures === 0 ? 0 : Math.round((sub.presentCount / sub.totalLectures) * 100);
                 const isLow = subPercent < 75;

                 return (
                    <div key={sub.subjectId} className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm truncate max-w-[150px]" title={sub.subjectName}>
                                {sub.subjectName}
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {subPercent}%
                            </span>
                        </div>
                        <Progress value={subPercent} className={`h-1.5 mb-2 ${isLow ? "bg-red-200" : ""}`} />
                        <div className="text-xs text-muted-foreground flex justify-between">
                            <span>Attended: {sub.presentCount}</span>
                            <span>Total: {sub.totalLectures}</span>
                        </div>
                    </div>
                 )
             })}
          </div>
          {student.subjects.length === 0 && (
             <p className="text-center text-muted-foreground">No subject data recorded yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}