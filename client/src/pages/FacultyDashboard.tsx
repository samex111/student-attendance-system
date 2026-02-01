import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Check, X, Search, Save, UserCheck, Users, Loader2, ListOrdered, GraduationCap } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Backend_URL } from "@/lib/config";

// --- Types (Kept as is) ---
interface StudentProps {
  _id: string;
  firstName: string;
  lastName: string;
  rollNo: number;
  branch: string;
  year: number;
  batch: string;
  email?: string;
}

interface AttendanceRecord {
  studentId: string;
  subjectId: string;
  status: "present" | "absent";
  slot: number;
}

// --- Component ---
export default function FacultyDashboard() {
  // --- State (Kept as is) ---
  const [students, setStudents] = useState<StudentProps[]>([]);
  const [branches] = useState<string[]>(["VLSI", "CSE", "CYB"]);
  const [branch, setBranch] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [slot, setSlot] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent">>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [batch, setBatch] = useState<'B1' | 'B2' | ''>("");

  // --- Effects (Kept as is) ---
  useEffect(() => {
    const storedSubjectId = localStorage.getItem("SubjectId");
    if (storedSubjectId) setSubjectId(storedSubjectId);
  }, []);

  useEffect(() => {
    if (branch) fetchStudents();
  }, [branch]);

  // --- Actions (Kept as is, using Toasts) ---
  async function fetchStudents() {
    setFetching(true);
    try {
      const res = await fetch(`http://localhost:3000/api/faculty/get/student/${branch}`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success || json.data) {
        setStudents(json.data || []);
        setAttendanceMap({});
      }
    } catch (e) {
      console.error("Error fetching students", e);
      toast.error("Failed to load students");
    } finally {
      setFetching(false);
    }
  }

  const toggleAttendance = (studentId: string, status: "present" | "absent") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAll = (status: "present" | "absent") => {
    const newMap: Record<string, "present" | "absent"> = {};
    filteredStudents.forEach((s) => {
      newMap[s._id] = status;
    });
    setAttendanceMap(newMap);
    toast.success(`Marked all ${status}`);
  };

  const submitAll = async () => {
    const unmarked = filteredStudents.filter((s) => !attendanceMap[s._id]);
    if (unmarked.length > 0) {
      toast.warning(`Please mark attendance for remaining ${unmarked.length} students.`);
      return;
    }

    const payload: AttendanceRecord[] = filteredStudents.map((student) => ({
      studentId: student._id,
      subjectId,
      status: attendanceMap[student._id],
      slot: parseInt(slot),
    }));


    try {
      setLoading(true);
      const res = await fetch(`${Backend_URL}/api/faculty/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attendance: payload }),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Attendance uploaded successfully!");
        setAttendanceMap({});
        setBranch("");
        setStudents([]);
      } else {
        toast.error(json.message || "Submission failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error during submission");
    } finally {
      setLoading(false);
    }
  };

  // --- Derived State for UI (Kept as is) ---
  const filteredStudents = useMemo(() => {
    let result = students;

    // ✅ 1. Batch filter (agar batch selected ho)
    if (batch) {
      result = result.filter((s) => s.batch === batch);
    }

    // ✅ 2. Search filter (naam / roll no)
    if (searchQuery.trim()) {
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNo.toString().includes(searchQuery)
      );
    }

    return result;
  }, [students, batch, searchQuery]);

  const presentCount = Object.values(attendanceMap).filter((s) => s === "present").length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === "absent").length;

  useEffect(() => {
    setAttendanceMap({});
  }, [batch]);

  // --- UI Component Start ---
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20"> {/* Added pb-20 for sticky footer space */}
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Faculty Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage daily attendance and records.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-sm self-start md:self-center">
          Subject ID: {subjectId || "Not Set"}
        </Badge>
      </div>

      {/* --- Controls Card --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: Columns become rows. Desktop: Keep side-by-side (flex-col on small, flex-row on md) */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
            <div className="grid w-full sm:w-[200px] items-center gap-1.5">
              <label className="text-sm font-medium leading-none">Select Branch</label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full ">
            <div className="grid w-full sm:w-[150px] items-center gap-1.5">
              <label className="text-sm font-medium leading-none">Lecture Slot</label>
              <Select value={slot} onValueChange={setSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Slot 1</SelectItem>
                  <SelectItem value="2">Slot 2</SelectItem>
                  <SelectItem value="3">Slot 3</SelectItem>
                  <SelectItem value="4">Slot 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full sm:w-[150px] items-center gap-1.5">
              <label className="text-sm font-medium leading-none">BATCH</label>

              <Select
                value={batch || "ALL"}   // ✅ yahan ALL fallback
                onValueChange={(value) => {
                  if (value === "ALL") {
                    setBatch("");       // ✅ real unselect yahan hota hai
                  } else {
                    setBatch(value as "B1" | "B2");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>

                <SelectContent>
                  {/* ✅ EMPTY STRING HATA DIYA */}
                  <SelectItem value="ALL">All Batches</SelectItem>
                  <SelectItem value="B1">BATCH 1</SelectItem>
                  <SelectItem value="B2">BATCH 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
    </div>

          </div>
        </CardContent>
      </Card>

      {/* --- Main Attendance Area --- */}
      {branch && (
        <div className="space-y-4 animate-in fade-in duration-500">

          {/* Stats & Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-muted/30 p-4 rounded-lg border gap-4">
            {/* Stats: Use flex-wrap on mobile */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-sm font-medium text-muted-foreground">Total: {students.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-700">Present: {presentCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-700">Absent: {absentCount}</span>
              </div>
            </div>

            {/* Bulk Action Button */}
            <div className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                onClick={() => markAll("present")}
              >
                <UserCheck className="w-4 h-4 mr-2" /> Mark All Present
              </Button>
            </div>
          </div>

          <Card >
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2"><ListOrdered className="w-5 h-5 text-primary" /> Student List</CardTitle>
                {/* Search Input: Full width on mobile */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name or roll no..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {fetching ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border-t">

                  {/* --- DESKTOP VIEW: Standard Table (md: block) --- */}
                  <Table className="hidden md:table">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-[100px]">Roll No</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            No students found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => {
                          const status = attendanceMap[student._id];
                          const isPresent = status === "present";
                          const isAbsent = status === "absent";

                          return (
                            <TableRow
                              key={student._id}
                              className={`
                                        transition-colors hover:bg-muted/50
                                        ${isPresent ? "bg-green-50/50 hover:bg-green-50" : ""}
                                        ${isAbsent ? "bg-red-50/50 hover:bg-red-50" : ""}
                                    `}
                            >
                              <TableCell className="font-medium">{student.rollNo}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-slate-200">
                                      {student.firstName[0]}{student.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{student.firstName} {student.lastName}</span>
                                    <span className="text-xs text-muted-foreground">{student.email}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {status ? (
                                  <Badge variant={isPresent ? "default" : "destructive"} className={isPresent ? "bg-green-600 hover:bg-green-600" : ""}>
                                    {status.toUpperCase()}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground">PENDING</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant={isPresent ? "default" : "outline"}
                                    className={`h-8 w-8 p-0 rounded-full ${isPresent ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-200 hover:bg-green-50"}`}
                                    onClick={() => toggleAttendance(student._id, "present")}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={isAbsent ? "destructive" : "outline"}
                                    className={`h-8 w-8 p-0 rounded-full ${isAbsent ? "" : "text-red-600 border-red-200 hover:bg-red-50"}`}
                                    onClick={() => toggleAttendance(student._id, "absent")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>

                  {/* --- MOBILE VIEW: Card List (Default: block) --- */}
                  <div className="md:hidden divide-y">
                    {filteredStudents.length === 0 ? (
                      <p className="text-center py-10 text-muted-foreground text-sm">No students found.</p>
                    ) : (
                      filteredStudents.map((student) => {
                        const status = attendanceMap[student._id];
                        const isPresent = status === "present";
                        const isAbsent = status === "absent";

                        return (
                          <div key={student._id} className={`p-3 space-y-2 ${isPresent ? "bg-green-50/50" : isAbsent ? "bg-red-50/50" : "hover:bg-slate-50"}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="text-sm bg-slate-200">
                                    {student.rollNo}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">{student.firstName} {student.lastName}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" /> Batch: {student.batch}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {status ? (
                                  <Badge variant={isPresent ? "default" : "destructive"} className={isPresent ? "bg-green-600 hover:bg-green-600" : ""}>
                                    {status.toUpperCase()}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground">PENDING</Badge>
                                )}
                              </div>
                            </div>

                            <Separator className="my-2" />

                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                size="sm"
                                variant={isPresent ? "default" : "outline"}
                                className={`flex-1 ${isPresent ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-200 hover:bg-green-50"}`}
                                onClick={() => toggleAttendance(student._id, "present")}
                              >
                                <Check className="h-4 w-4 mr-1" /> Present
                              </Button>
                              <Button
                                size="sm"
                                variant={isAbsent ? "destructive" : "outline"}
                                className={`flex-1 ${isAbsent ? "" : "text-red-600 border-red-200 hover:bg-red-50"}`}
                                onClick={() => toggleAttendance(student._id, "absent")}
                              >
                                <X className="h-4 w-4 mr-1" /> Absent
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              )}
            </CardContent>

          </Card>
        </div>
      )}

      {!branch && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Users className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No Branch Selected</h3>
          <p className="text-sm">Select a branch and slot from the top menu to view students.</p>
        </div>
      )}
      <div className="hidden md:flex justify-end pt-4">
        <Button
          size="lg"
          onClick={submitAll}
          disabled={loading}
          className="font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading Attendance...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Submit All ({presentCount + absentCount} marked)
            </>
          )}
        </Button>
      </div>


      {/* --- Sticky Footer Submit Button (New for Mobile UX) --- */}
      {branch && filteredStudents.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl p-4 md:hidden">
          <Button
            size="lg"
            onClick={submitAll}
            disabled={loading}
            className="w-full font-semibold"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Attendance...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Submit All ({presentCount + absentCount} marked)</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}