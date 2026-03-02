import { ShieldAlert, BookOpen, Bug, Search } from "lucide-react";

export default function PestDetailsPage() {
    const pests = [
        {
            name: "Brown Plant Hopper (BPH)",
            symptoms: "Yellowing, browning, and drying of crop ('hopper burn').",
            control: "Avoid excessive urea. Use traditional neem remedies."
        },
        {
            name: "Rice Stem Borer",
            symptoms: "Deadhearts in vegetative stage, whiteheads in reproductive stage.",
            control: "Light traps, delayed planting, specific biopesticides."
        },
        {
            name: "Rice Leaf Folder",
            symptoms: "Leaves folded longitudinally and larvae feeding inside.",
            control: "Reduce shading, balance fertilizer, release Trichogramma."
        },
        {
            name: "Rice Bug (Gundhi Bug)",
            symptoms: "Grains become empty or partially filled, dark spots on grains.",
            control: "Traditional 'Kem' smoking methods using specific leaves."
        }
    ];

    return (
        <div className="py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Pest Knowledge Base</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
                    Explore detailed information regarding common pests affecting paddy cultivation in Sri Lanka.
                    Discover both traditional eco-friendly methods and modern treatments.
                </p>
            </div>

            <div className="mb-12 max-w-2xl mx-auto relative">
                <input
                    type="text"
                    placeholder="Search for a pest or symptom..."
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-govi-500"
                />
                <Search className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pests.map((pest, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shrink-0">
                                <Bug className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white">{pest.name}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    <ShieldAlert className="w-4 h-4" /> Symptoms
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300">{pest.symptoms}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    <BookOpen className="w-4 h-4" /> Control Methods
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300">{pest.control}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
