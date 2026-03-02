import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf, ShieldAlert, MonitorSmartphone, Sprout,
    ChevronRight, Users, CheckCircle2, Factory,
    BookOpen, ImagePlus, UserCircle2, ArrowRight,
    ShieldCheck, Code, Server, Database
} from "lucide-react";

export default function HomePage() {
    const heroImages = [
        "/images/hero.png",
        "/images/hero2.png",
        "/images/hero3.png"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="relative overflow-hidden w-full">

            {/* 1. Hero Section */}
            <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                {/* Background Image Carousel / Overlay */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={currentImageIndex}
                            src={heroImages[currentImageIndex]}
                            alt="Sri Lankan Paddy Field Hero"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent z-10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center md:items-start md:text-left pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-govi-300 font-medium mb-6"
                    >
                        <Leaf className="w-4 h-4" />
                        <span>Smart Agriculture For Sri Lanka</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight"
                    >
                        Protect Your Harvest <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-govi-300 to-govi-500">
                            With "ගොවි ගුරු"
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10"
                    >
                        An intelligent, AI-powered pest identification system designed to empower Sri Lankan paddy farmers.
                        Instantly detect pests, get sustainable control recommendations, and monitor crop health.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start"
                    >
                        <button className="px-8 py-4 bg-govi-600 hover:bg-govi-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-govi-500/30 flex items-center justify-center gap-2">
                            Start Scanning Pests <MonitorSmartphone className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2">
                            Learn More <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. Problem / Solution / Deliverables */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white text-slate-900">Why Govi Guru?</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Addressing the critical challenges in paddy farming with modern, easily accessible technology.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            <ShieldAlert className="w-12 h-12 text-red-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3 dark:text-white">The Problem</h3>
                            <p className="text-slate-600 dark:text-slate-400">Farmers struggle to detect and classify early pest infestations, leading to misidentification and incorrect, overuse of toxic pesticides.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-govi-100 dark:bg-govi-900/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            <Sprout className="w-12 h-12 text-govi-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3 dark:text-white">Our Solution</h3>
                            <p className="text-slate-600 dark:text-slate-400">A smart platform utilizing AI and image processing to instantly analyze paddy images and suggest both traditional "Kem" and modern safe control tools.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 transition-opacity group-hover:opacity-20 dark:group-hover:opacity-30">
                                <img src="/images/leaf.png" alt="Healthy leaf" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/40 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            <CheckCircle2 className="w-12 h-12 text-blue-500 mb-6 relative z-10" />
                            <h3 className="text-2xl font-bold mb-3 dark:text-white relative z-10">Deliverables</h3>
                            <p className="text-slate-600 dark:text-slate-400 relative z-10">Accurate ML image recognition, real-time field monitoring, instant recommendation engine, and expert consultation channels all combined.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Operational Workflow */}
            <section className="py-24 px-6 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">How It Works</h2>
                        <p className="text-slate-500 dark:text-slate-400">Simple, intuitive, and effective steps to protect paddy crops.</p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 -ml-0.5 w-1 h-full bg-govi-100 dark:bg-govi-900/30 hidden md:block"></div>

                        <div className="space-y-12">
                            {[
                                { step: "01", title: "Capture Image", desc: "Use your smartphone to capture a clear photo of the unidentified insect or corrupted crop in the field.", icon: ImagePlus, side: "left" },
                                { step: "02", title: "Upload & AI Processing", desc: "The platform's Machine Learning backend analyzes the uploaded image to classify the pest species.", icon: MonitorSmartphone, side: "right" },
                                { step: "03", title: "Review Assessment", desc: "Receive detailed pest characteristics, symptoms, and potential impacts on crop yield.", icon: BookOpen, side: "left" },
                                { step: "04", title: "Take Action", desc: "Read suggested traditional remedies ('Kem') or eco-friendly methods to manage the pest sustainably.", icon: Sprout, side: "right" }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    key={i}
                                    className={`flex flex-col md:flex-row items-center justify-center gap-8 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
                                >
                                    <div className="md:w-1/2 flex flex-col items-center md:items-start p-6">
                                        <div className="text-5xl font-black text-govi-100 dark:text-govi-900/40 mb-2">{item.step}</div>
                                        <h3 className="text-2xl font-bold mb-2 dark:text-white">{item.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-center md:text-left">{item.desc}</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-govi-500 text-white flex items-center justify-center z-10 shadow-lg ring-8 ring-white dark:ring-slate-950">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <div className="md:w-1/2 invisible hidden md:block"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Site Content Map */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Platform Modules & Access</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Discover the comprehensive suite of tools built for every role in agriculture.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[
                            { name: "Home Page", desc: "Entry landing site summarizing system capabilities.", type: "Public" },
                            { name: "Pest Details Portal", desc: "Deep knowledge base of pests, symptoms, & treatments.", type: "Public" },
                            { name: "Image Analysis", desc: "Core AI application to detect insect species.", type: "Farmer Portal" },
                            { name: "Expert Connection", desc: "Direct consultation portal for expert guidance.", type: "Farmer Portal" },
                            { name: "Officer Dashboard", desc: "Dashboard to monitor field reports & validate results.", type: "Agri Officer" },
                            { name: "System Admin Panel", desc: "Platform stats, database updates, user roles.", type: "Admin" },
                        ].map((page, i) => (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                key={i}
                                className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                            >
                                <div className="text-xs font-bold uppercase tracking-wider text-govi-600 mb-3">{page.type}</div>
                                <h4 className="text-xl font-bold mb-2 dark:text-white flex justify-between items-center">
                                    {page.name} <ArrowRight className="w-4 h-4 text-slate-300" />
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{page.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Target Users & Expected Outcomes */}
            <section className="py-24 px-6 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                                <Users className="w-4 h-4" /> Target Audience
                            </div>
                            <h2 className="text-3xl font-bold mb-6 dark:text-white">Who is this for?</h2>
                            <ul className="space-y-4">
                                {[
                                    "Paddy farmers seeking immediate pest identification",
                                    "Agricultural officers & field extension workers",
                                    "Researchers studying pest behavior & crop impact",
                                    "Agribusiness & regional cooperatives"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 className="w-6 h-6 text-govi-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
                                <Factory className="w-4 h-4" /> Expected Outcomes
                            </div>
                            <h2 className="text-3xl font-bold mb-6 dark:text-white">System Benefits</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Higher Yields</h4>
                                    <p className="text-sm text-slate-500">Stop damage early.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Eco-friendly</h4>
                                    <p className="text-sm text-slate-500">Reduce chemical pesticides.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Faster Action</h4>
                                    <p className="text-sm text-slate-500">Instant ML-driven guidance.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-lg mb-1 dark:text-white">Expert Network</h4>
                                    <p className="text-sm text-slate-500">Direct officer interaction.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full aspect-square md:aspect-auto md:h-full min-h-[500px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800 group">
                        <img
                            src="/images/officer.png"
                            alt="Agricultural Officer reviewing data"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                            <div className="glass p-6 rounded-2xl w-full">
                                <h4 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                                    <ShieldCheck className="text-blue-400" /> Expert Field Validations
                                </h4>
                                <p className="text-slate-200 text-sm">Empowering Agriculture Officers with instant AI-backed data to support local farmers efficiently.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. User Roles and Responsibilities */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">User Roles & Capabilities</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Govi Guru provides dedicated workspaces depending on your role in the agricultural ecosystem.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Farmers */}
                        <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-govi-50 dark:bg-govi-900/30 rounded-full z-0"></div>
                            <UserCircle2 className="w-10 h-10 text-govi-600 mb-6 relative z-10" />
                            <h3 className="text-2xl font-bold mb-4 dark:text-white relative z-10">Farmers</h3>
                            <ul className="space-y-3 relative z-10">
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-govi-500 shrink-0" /> Upload pest images for automatic identification.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-govi-500 shrink-0" /> Get pest details, control methods, and traditional "kem" practices.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-govi-500 shrink-0" /> Request expert advice from agriculture officers.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-govi-500 shrink-0" /> Track past identification records in personal profile.</li>
                            </ul>
                        </div>

                        {/* Agri Officer */}
                        <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full z-0"></div>
                            <ShieldCheck className="w-10 h-10 text-blue-600 mb-6 relative z-10" />
                            <h3 className="text-2xl font-bold mb-4 dark:text-white relative z-10">Agriculture Officer</h3>
                            <ul className="space-y-3 relative z-10">
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-blue-500 shrink-0" /> Verify and validate AI pest identification results.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-blue-500 shrink-0" /> Offer customized pest control recommendations.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-blue-500 shrink-0" /> Monitor field reports & provide guidance.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-blue-500 shrink-0" /> Collaborate to update educational materials.</li>
                            </ul>
                        </div>

                        {/* Admin */}
                        <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 dark:bg-purple-900/30 rounded-full z-0"></div>
                            <ShieldAlert className="w-10 h-10 text-purple-600 mb-6 relative z-10" />
                            <h3 className="text-2xl font-bold mb-4 dark:text-white relative z-10">Admin</h3>
                            <ul className="space-y-3 relative z-10">
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-purple-500 shrink-0" /> Manage system and monitor all user accounts.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-purple-500 shrink-0" /> Maintain the pest database & recommendations.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-purple-500 shrink-0" /> Oversee platform operations and reported issues.</li>
                                <li className="text-slate-600 dark:text-slate-400 text-sm flex gap-2"><ArrowRight className="w-4 h-4 text-purple-500 shrink-0" /> Generate usage reports & ensure data security.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Technology Stack */}
            <section className="py-24 px-6 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Powered By Modern Technology</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">A robust and scalable architecture ensuring high availability and accurate image recognition.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <Code className="w-10 h-10 text-govi-500 mb-4" />
                            <h4 className="font-bold mb-1 dark:text-white">Frontend</h4>
                            <p className="text-xs text-slate-500">React, HTML, CSS, JS</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <Server className="w-10 h-10 text-blue-500 mb-4" />
                            <h4 className="font-bold mb-1 dark:text-white">Backend</h4>
                            <p className="text-xs text-slate-500">Python FastAPI & PHP</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <MonitorSmartphone className="w-10 h-10 text-purple-500 mb-4" />
                            <h4 className="font-bold mb-1 dark:text-white">Machine Learning</h4>
                            <p className="text-xs text-slate-500">TensorFlow</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <Database className="w-10 h-10 text-emerald-500 mb-4" />
                            <h4 className="font-bold mb-1 dark:text-white">Database</h4>
                            <p className="text-xs text-slate-500">MySQL Storage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Contact / CTA Section */}
            <section className="py-24 px-6 bg-govi-950 text-white relative overflow-hidden">
                <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-govi-800 rounded-full blur-[100px] opacity-50"></div>
                <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-govi-600 rounded-full blur-[100px] opacity-20"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Paddy Cultivation?</h2>
                    <p className="text-xl text-govi-100 mb-10 max-w-2xl mx-auto opacity-90">
                        Join the digital agriculture revolution. Connect with our experts, ask questions, or provide feedback on the Govi Guru platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-govi-900 font-bold rounded-2xl hover:bg-govi-50 transition-colors shadow-xl flex items-center justify-center gap-2">
                            <UserCircle2 className="w-5 h-5" /> Sign up for Free
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                            Consult an Expert
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
