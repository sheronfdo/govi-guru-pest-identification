import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactUsPage() {
    return (
        <div className="py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Contact Our Experts</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Need assistance with the system or require direct agricultural advice? We are here to help you protect your harvest.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
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
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 dark:text-white">Send a Message</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-govi-500" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email or Phone Number</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-govi-500" placeholder="Contact details" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-govi-500" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
