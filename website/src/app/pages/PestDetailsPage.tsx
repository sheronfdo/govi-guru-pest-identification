import { useState, useEffect } from "react";
import { ShieldAlert, Bug, Search, Loader2, Leaf } from "lucide-react";

interface Pest {
    id: number;
    name_en: string;
    crop_stage: string | null;
    chemical_methods: string | null;
    kem_methods: string | null;
    image_path: string | null;
}

export default function PestDetailsPage() {
    const [pests, setPests] = useState<Pest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPests = async () => {
            try {
                // Fetch from the backend API, default to localhost:8000 if not set
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
                const response = await fetch(`${apiUrl}/api/v1/public/pests?limit=100`);
                if (!response.ok) {
                    throw new Error("Failed to fetch pest data");
                }
                const data = await response.json();
                setPests(data.items || []);
            } catch (err) {
                console.error(err);
                setError("Could not load pest details at this time.");
            } finally {
                setLoading(false);
            }
        };

        fetchPests();
    }, []);

    const filteredPests = pests.filter(pest =>
        pest.name_en.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-govi-500 transition-shadow"
                />
                <Search className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-govi-500 animate-spin mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Loading comprehensive pest data...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800">
                    <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Data</h3>
                    <p className="text-red-600 dark:text-red-300">{error}</p>
                </div>
            ) : filteredPests.length === 0 ? (
                <div className="text-center py-20">
                    <Bug className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Pests Found</h3>
                    <p className="text-slate-500 dark:text-slate-400">We couldn't find any pests matching your search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPests.map((pest) => (
                        <div key={pest.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                            {pest.image_path ? (
                                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative">
                                    <img src={pest.image_path} alt={pest.name_en} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-full h-32 bg-govi-50 dark:bg-govi-900/20 flex items-center justify-center">
                                    <Bug className="w-12 h-12 text-govi-300 dark:text-govi-700" />
                                </div>
                            )}

                            <div className="p-8 flex-1 flex flex-col">
                                <h2 className="text-2xl font-bold dark:text-white mb-2">{pest.name_en}</h2>
                                {pest.crop_stage && (
                                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full mb-6 w-fit">
                                        Stage: {pest.crop_stage}
                                    </span>
                                )}

                                <div className="space-y-6 flex-1">
                                    {pest.kem_methods && (
                                        <div>
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                                                <Leaf className="w-4 h-4" /> Eco / Kem Methods
                                            </h4>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{pest.kem_methods}</p>
                                        </div>
                                    )}

                                    {pest.chemical_methods && (
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                                                <ShieldAlert className="w-4 h-4" /> Chemical Control
                                            </h4>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{pest.chemical_methods}</p>
                                        </div>
                                    )}

                                    {!pest.kem_methods && !pest.chemical_methods && (
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-500 italic text-sm">
                                            No explicit control methods recorded yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
