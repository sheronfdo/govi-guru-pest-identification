import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        contact_info: "",
        message: ""
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
            const response = await fetch(`${apiUrl}/api/v1/public/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to submit contact request");
            }

            setSuccess(true);
            setFormData({
                name: "",
                contact_info: "",
                message: ""
            });
        } catch (err: any) {
            console.error("Contact error:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="py-16 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Contact Our Experts</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Need assistance with the system or require direct agricultural advice? We are here to help you protect your harvest.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-govi-100 dark:bg-govi-900/30 text-govi-600 dark:text-govi-400 rounded-full flex justify-center items-center shrink-0">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white">Phone Support</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Available Monday to Friday, 8am to 5pm</p>
                            <p className="font-semibold text-govi-600 dark:text-govi-400 mt-2">+94 11 234 5678</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex justify-center items-center shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white">Email Us</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Drop us an email anytime and we will get back to you.</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400 mt-2">support@goviguru.lk</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex justify-center items-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white">Department Location</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Agriculture Extension Center,<br />
                                Peradeniya,<br />Sri Lanka
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl"
                >
                    <h3 className="text-2xl font-bold mb-6 dark:text-white">Send a Message</h3>

                    {success ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-10"
                        >
                            <CheckCircle className="w-16 h-16 text-govi-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold dark:text-white mb-2">Message Sent!</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">Thank you for reaching out. A representative will get back to you shortly.</p>
                            <button
                                type="button"
                                onClick={() => setSuccess(false)}
                                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email or Phone Number</label>
                                <input
                                    type="text"
                                    name="contact_info"
                                    value={formData.contact_info}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                                    placeholder="Contact details"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    minLength={5}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-govi-500"
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-70 transition-colors flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>Sending... <Loader2 className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <>Send Message <Send className="w-5 h-5" /></>
                                )}
                            </button>
                        </motion.form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
