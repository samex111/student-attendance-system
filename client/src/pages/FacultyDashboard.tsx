import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FacultyDashboard() {
  interface StudentProps {
    firstName: string;
    lastName: string;
    rollNo: number;
    branch: string;
    year: number;
    batch: string;
    email?: string;
  }

  const [students, setStudents] = useState<StudentProps[]>([])
  const [branch, setBranch] = useState<string>("CYB") 

  async function getStudents() {
    try {
      const res = await fetch(`http://localhost:3000/api/faculty/get/student/${branch}`,{
        method:"GET",
        headers:{'Content-Type':"application/json"},
        credentials:"include"
      })
      const json = await res.json()

      setStudents(json.data) 
    } catch (e) {
      console.error("Error fetching students", e)
    }
  }

  useEffect(() => {
    getStudents()
  }, [branch])



  return (
    <>
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Faculty Dashboard</h1>
       <div className="w-64">
      <Select value={branch} onValueChange={(value:string) => setBranch(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="VLSI">VLSI</SelectItem>
          <SelectItem value="CS">CS</SelectItem>
          <SelectItem value="CYB">CYB</SelectItem>
        </SelectContent>
      </Select>
    </div>

      <Table className="border rounded-lg shadow-sm">
        <TableCaption>List of students from {branch} branch.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Roll No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Batch</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.rollNo}</TableCell>
              <TableCell>{item.firstName} {item.lastName}</TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.batch}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  )
}



function TakeAttendance() {

    return (
    <>


    </>
    )
}

// branch name -- VLSI
// student name , roll no 
// absent present 