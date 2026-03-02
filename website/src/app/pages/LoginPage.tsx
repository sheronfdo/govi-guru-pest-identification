import { Link } from "react-router-dom";
import { Leaf, ArrowRight, UserCircle2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">

            {/* Left Panel: Image & Branding */}
            <div className="hidden md:flex md:w-1/2 relative bg-govi-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero.png"
                        alt="Paddy Field"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-govi-950 via-govi-900/80 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-govi-500 flex items-center justify-center text-white shadow-lg">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">ගොවි ගුරු</span>
                    </Link>

                    <div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Welcome back to <br />
                            Smart Pest Identifcation
                        </h1>
                        <p className="text-govi-200 text-lg max-w-md">
                            Access AI-driven insights, expert agricultural advice, and sustainable crop management tools.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Role Selection */}
            <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">

                {/* Mobile Logo */}
                <Link to="/" className="md:hidden flex items-center gap-2 mb-12 absolute top-8 left-6">
                    <div className="w-8 h-8 rounded-lg bg-govi-500 flex items-center justify-center text-white">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight dark:text-white text-govi-950">ගොවි ගුරු</span>
                </Link>

                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Select Your Portal</h2>
                        <p className="text-slate-500 dark:text-slate-400">Choose your role to access the dedicated workspace.</p>
                    </div>

                    <div className="space-y-4">
                        <a
                            href={import.meta.env.VITE_FARMER_PORTAL_URL || "http://localhost:5174"}
                            className="group block w-full p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-govi-500 dark:hover:border-govi-500 transition-all hover:shadow-lg hover:shadow-govi-500/10 cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-govi-100 dark:bg-govi-900/40 text-govi-600 flex items-center justify-center group-hover:bg-govi-500 group-hover:text-white transition-colors">
                                    <UserCircle2 className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-0.5">Farmer Portal</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload diagnoses, view records, get help.</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-govi-500 transition-colors" />
                            </div>
                        </a>

                        <a
                            href={import.meta.env.VITE_OFFICER_PORTAL_URL || "http://localhost:5175"}
                            className="group block w-full p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-0.5">Agriculture Officer</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Verify requests and assist farmers.</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        </a>
                    </div>
                    <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                        Admin access? <a href="#" className="font-bold text-govi-600 dark:text-govi-400 hover:text-govi-500">Contact System Administrator</a>
                    </div>
                </div>
            </div>

        </div>
    );
}
