import { Send } from "lucide-react";

export default function FeedbackPage() {
    return (
        <div className="py-16 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Your Feedback Matters</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Help us improve "ගොවි ගුරු". Let us know if the AI identification was accurate or if you need additional tools for your paddy farming.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500" placeholder="Enter your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">District / Region</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500" placeholder="e.g. Anuradhapura" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform Experience</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500">
                            <option>Excellent - Very helpful</option>
                            <option>Good - Mostly accurate</option>
                            <option>Average - Needs minor improvements</option>
                            <option>Poor - Pest identification failed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Detailed Comments</label>
                        <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500" placeholder="Tell us how we can do better..."></textarea>
                    </div>

                    <button type="button" className="w-full py-4 bg-govi-600 hover:bg-govi-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-govi-500/30 flex justify-center items-center gap-2">
                        Submit Feedback <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
