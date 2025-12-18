import {  Card, CardHeader, CardTitle,  CardContent } from "@/components/ui/card";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { GraduationCap, Users, School, Table } from "lucide-react";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export default function  DashboardOverview ()  {
  const navigate = useNavigate();
    
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1293</div>
            <p className="text-xs text-zinc-500">+180 from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-zinc-500">+4 new hires</p>
          </CardContent>
        </Card>
         <Card onClick={()=>navigate('/admin/dashboard/attendance')}>
          <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-zinc-500">branches attendance</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center mr-4">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">New student registered</p>
                    <p className="text-sm text-zinc-500">Student ID: 202400{i}</p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-zinc-500">Just now</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export function Student(){
    return(
        <>
        <GetStudents/>
        </>
    )
}
  async function GetStudents() {
    const [studentData, setStudentData] = useState<any[]>([])
    try {
      const res = await fetch(`http://localhost:3000/api/admin/get/students`,{
        method:"GET",
        headers:{'Content-Type':"application/json"},
        credentials:"include"
      })
      const json = await res.json()
      
      setStudentData(json.data)
    } catch (e) {
      console.error("Error fetching students", e)
    }
    return(
        <> { studentData.map(({item, index}:any) => (
        <div className="p-6">
       <div className="w-64">
    
    </div>

      <Table className="border rounded-lg shadow-sm">
        <TableCaption> {item._id} </TableCaption>

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
        
            <TableRow key={index}>
              <TableCell>{item.rollNo}</TableCell>
              <TableCell>{item.firstName} {item.lastName}</TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.batch}</TableCell>
            </TableRow>
          
        </TableBody>
      </Table>
    </div>
        
  ))}
        </>
    )
  }
