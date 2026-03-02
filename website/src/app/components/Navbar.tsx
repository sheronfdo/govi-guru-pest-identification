import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X, UserCircle2 } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Pest Details", path: "/pest-details" },
        { name: "About Us", path: "/about" },
        { name: "Feedback", path: "/feedback" },
        { name: "Contact Us", path: "/contact" },
    ];

    return (
        <nav className="fixed w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-govi-500 flex items-center justify-center text-white">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight dark:text-white">ගොවි ගුරු</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-govi-500 ${location.pathname === link.path
                                        ? "text-govi-600 dark:text-govi-400 font-semibold"
                                        : "text-slate-600 dark:text-slate-300"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 bg-govi-600 hover:bg-govi-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
                        >
                            <UserCircle2 className="w-4 h-4" /> Login
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 dark:text-slate-300 hover:text-govi-500 focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden glass border-t border-slate-200 dark:border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path
                                        ? "bg-govi-50 dark:bg-govi-900/50 text-govi-600 dark:text-govi-400"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-govi-600 hover:bg-govi-500 text-white text-base font-semibold rounded-xl transition-all shadow-md"
                        >
                            <UserCircle2 className="w-5 h-5" /> Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
