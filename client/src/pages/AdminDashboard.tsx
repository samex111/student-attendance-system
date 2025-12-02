import { useState } from "react";

export default function Dashboard(){
  
}

function AddStudent(){
    interface studentDetails{
        firstName:string
        lastName:string
        rollNo:number;
        branch:string
        batch:string;
        year:number;
        email:string
    }
    const [firstName,setFirstName] = useState<string|null>(null)
    const [lastName,setlastName] = useState<string|null>(null)
    const [email,setEmail] = useState<string|null>(null)
    const [batch,setBatch] = useState<string|null>(null)
    const [branch,setBranch] = useState<string|null>(null)
    const [rollNo,setRollNo] = useState<number|null>(null)
    const [year,setYear] = useState<string|null>(null)

    try{
        async function handleSubmit(){
            const res = await fetch('',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                credentials:"include",
                body:JSON.stringify({
                    
                })
            })
        }
    }catch(e){

    }
    return(
        <>
        
        </>
    )
}