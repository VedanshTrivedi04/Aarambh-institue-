import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SectionTitle } from "./AboutSection";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import api from "../../lib/api";

const classes = ["Class 10th", "Class 11th", "Class 12th"];
const boardsList = ["MP Board", "CBSE", "ICSE"];
const streams = ["Science", "Commerce", "Arts", "All Subjects"];

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/40 focus:border-[#FF5C00] bg-gray-50/50 text-sm transition-all placeholder:text-gray-400";
const selectCls = `${inputCls} cursor-pointer`;

export function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", grade: "", board: "", stream: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState<any>(null);

  // Removed fetchBranches

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/enquiries/leads/', {
        student_name: form.name,
        phone_number: form.phone,
        email: form.email,
        target_exam: form.stream || "Not specified",
        current_class: form.grade || "Not specified",
        notes: form.message + ` | Board: ${form.board}`
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit enquiry", error);
      alert("There was an issue submitting your request. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "88397-14081", sub: "79097-14081", color: "#3B5BDB" },
    { icon: Mail, label: "Email", value: "aarambhinstitute09@gmail.com", sub: "Replies within 24hrs", color: "#FF5C00" },
    { icon: MapPin, label: "Address", value: "8 Shantinath Puri, Hawa Bangla, Near Sai Mandir", sub: "Indore, Madhya Pradesh", color: "#2F9E44" },
    { icon: Clock, label: "Hours", value: "10 AM – 8 PM", sub: "Monday - Saturday", color: "#7950F2" },
  ];

  return (
    <section id="contact" className="py-28 bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle
          label="Enroll Today"
          title={`Start Your\nJourney`}
          subtitle="Fill the form and our counsellor will call you within 24 hours to schedule a free demo class."
        />

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-3">
            {contactInfo.map(({ icon: Icon, label, value, sub, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ x: 4 }}
                className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="font-semibold text-gray-900 text-sm">{value}</div>
                  <div className="text-gray-400 text-xs">{sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center"
            >
              <div className="text-center">
                <MapPin className="w-7 h-7 text-blue-500 mx-auto mb-1.5" />
                <p className="text-blue-700 font-bold text-sm">MRMF+W8 Indore, Madhya Pradesh</p>
                <a href="https://maps.app.goo.gl/T2m2g9b8tjVMCDqL9" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-bold text-xs underline mt-2 block">
                  View on Map
                </a>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="font-black text-2xl text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-400 mb-6 text-sm">Our counsellor will call within 24 hours to confirm your free demo.</p>
                <button onClick={() => setSubmitted(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-gray-500 text-sm hover:bg-gray-50 transition-colors">
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <>
                <h3 className="font-black text-xl text-gray-900 mb-6">Free Enrollment & Demo Class</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input name="name" required value={form.name} onChange={handleChange} placeholder="Student Full Name *" className={inputCls} />
                    <input name="phone" required type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX *" className={inputCls} />
                  </div>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address (optional)" className={inputCls} />
                  <div className="grid sm:grid-cols-3 gap-3">
                    <select name="grade" required value={form.grade} onChange={handleChange} className={selectCls}>
                      <option value="">Select Class *</option>
                      {classes.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <select name="board" required value={form.board} onChange={handleChange} className={selectCls}>
                      <option value="">Select Board *</option>
                      {boardsList.map((b) => <option key={b}>{b}</option>)}
                    </select>
                    <select name="stream" value={form.stream} onChange={handleChange} className={selectCls}>
                      <option value="">Stream</option>
                      {streams.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any questions or specific concerns..."
                    className={inputCls + " resize-none"}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 12px 30px rgba(255,92,0,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-70 transition-shadow"
                    style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 20px rgba(255,92,0,0.2)" }}
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Book My Free Demo Class</>
                    )}
                  </motion.button>
                  <p className="text-center text-gray-400 text-xs">No spam. We only call to confirm your demo slot.</p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
