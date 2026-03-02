import { useState } from "react";
import { Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: "",
        district: "",
        experience: "Excellent - Very helpful",
        comments: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/api/v1/public/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to submit feedback");
            }

            setSuccess(true);
            setFormData({
                name: "",
                district: "",
                experience: "Excellent - Very helpful",
                comments: ""
            });
        } catch (err: any) {
            console.error("Feedback error:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="py-16 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Your Feedback Matters</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Help us improve "ගොවි ගුරු". Let us know if the AI identification was accurate or if you need additional tools for your paddy farming.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                {success ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-govi-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold dark:text-white mb-2">Thank You!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Your feedback has been successfully submitted and will be reviewed by our team.</p>
                        <button
                            type="button"
                            onClick={() => setSuccess(false)}
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                        >
                            Submit Another Response
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">District / Region</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                                    placeholder="e.g. Anuradhapura"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform Experience</label>
                            <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                            >
                                <option>Excellent - Very helpful</option>
                                <option>Good - Mostly accurate</option>
                                <option>Average - Needs minor improvements</option>
                                <option>Poor - Pest identification failed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Detailed Comments</label>
                            <textarea
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                required
                                minLength={5}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                                placeholder="Tell us how we can do better..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-govi-600 hover:bg-govi-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg shadow-govi-500/30 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
                            ) : (
                                <>Submit Feedback <Send className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
