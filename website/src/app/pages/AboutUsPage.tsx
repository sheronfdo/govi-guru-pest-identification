import { ShieldAlert, Target, Users, Factory } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUsPage() {
    return (
        <div className="py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">About ගොවි ගුරු</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
                    In Sri Lanka, paddy cultivation is a vital source of food and livelihood for a significant portion of the population. However, farmers face a wide range of problems, primarily the lack of knowledge and resources for identifying and managing pest infestations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg"
                >
                    <Target className="w-12 h-12 text-govi-500 mb-6" />
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Our Mission</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        To empower Sri Lankan paddy farmers with a smart, accessible, and an eco-friendly AI platform capable of identifying pests instantly and providing reliable traditional ("kem") and modern control methods. We aim to reduce the misuse of chemical pesticides and boost harvest outcomes.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg"
                >
                    <Factory className="w-12 h-12 text-blue-500 mb-6" />
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Our Vision</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        A future where digital agricultural tools bridge the gap between rural farming challenges and expert knowledge, guaranteeing food security, minimizing ecological harm, and modernizing Sri Lanka’s traditional farming sector for long-term sustainability.
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">A Complete Ecosystem</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Empowered Farmers", icon: Users, desc: "Quick identification and actionable, localized advice on their smart devices." },
                        { title: "Informed Officers", icon: ShieldAlert, desc: "Agriculture experts can track field reports and offer direct support." },
                        { title: "Sustainable Growth", icon: Target, desc: "Lowerting toxic footprints by adopting precise, data-driven farming techniques." }
                    ].map((item, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            key={i}
                            className="text-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl"
                        >
                            <div className="w-16 h-16 mx-auto bg-govi-100 dark:bg-govi-900/30 text-govi-600 dark:text-govi-400 rounded-full flex items-center justify-center mb-4">
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
