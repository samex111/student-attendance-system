import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Wrench } from "lucide-react";

// --- Imports needed for the structure you provided (kept for completeness) ---

import { Card, CardContent, CardHeader,CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import AddFaculty from "@/customComponent/AddFAculty"; // Assuming this is not needed for the landing page itself

// **Using a better logo placeholder structure**
const AcropolisLogoComponent = () => (
    <div className="flex flex-col items-center">
        {/* Placeholder for the official logo image (if you have the full URL) */}
        {/* NOTE: I am keeping the structure of the provided image but making it cleaner */}
        <img
            src="https://aitr.ac.in/wp-content/uploads/2023/03/unnamed-1-1536x304.png"
            alt="Acropolis Enlightening Wisdom"
            className="w-full max-w-[300px] h-auto object-contain mb-4"
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Attendance Portal
        </h1>
        <p className="text-md text-slate-500 mt-1">
            College Management System
        </p>
    </div>
);


export function LandingPage() {
    const navigate = useNavigate();

    return (
        // --- Full Screen Background: Clean, minimal light grey ---
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            
            {/* --- Centered Card: Focus on Content --- */}
            <Card className="w-full max-w-sm p-6 shadow-2xl border border-slate-200 bg-white animate-in fade-in zoom-in duration-700">
                
                <CardHeader className="text-center pt-8 pb-4">
                    <AcropolisLogoComponent />
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    <Separator className="bg-slate-200" />
                    
                    <p className="text-sm text-slate-600 font-medium text-center">
                        Select Your Portal Access:
                    </p>

                    {/* --- Faculty Login Button (Primary CTA) --- */}
                    <Button 
                        onClick={() => navigate('/faculty/signin')} 
                        className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/40 transition-all"
                    >
                        <Briefcase className="w-5 h-5 mr-3" />
                        Faculty Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    {/* --- Admin Login Button (Secondary CTA) --- */}
                    <Button 
                        onClick={() => navigate('/admin/signin')} 
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-2 border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <Wrench className="w-5 h-5 mr-3 text-slate-600" />
                        Administrator Login
                    </Button>
                </CardContent>

                <CardFooter className="pt-6">
                    <p className="text-xs w-full text-center text-slate-400">
                        © 2025 Acropolis Group. Secure system access only.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}