import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Send, CheckCircle, Mail } from "lucide-react";
import api from "../../../lib/api";

export function AdminQueries() {
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("All");
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/enquiries/leads/');
      const payload = res.data.data !== undefined ? res.data.data : res.data;
      const data = Array.isArray(payload) ? payload : (payload?.results || []);
      setQueries(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedQuery) {
        setSelectedQuery(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch queries", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await api.patch(`/enquiries/leads/${id}/`, { status });
      fetchQueries();
      if (selectedQuery && selectedQuery.id === id) {
        setSelectedQuery({ ...selectedQuery, status });
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredQueries = queries.filter((q) => {
    const name = q.student_name || q.name || "";
    const email = q.email || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterTab === "Unread") return matchesSearch && q.status === "new";
    if (filterTab === "Replied") return matchesSearch && q.status === "contacted";
    if (filterTab === "Closed") return matchesSearch && (q.status === "converted" || q.status === "lost");
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Query Management</h1>
        <p className="text-gray-500 text-sm">Manage student and parent inquiries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Query List */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 text-sm shadow-sm transition-all focus:ring-2 focus:ring-red-600/20"
            />
          </div>

          <div className="flex gap-2 mb-4 text-xs">
            {["All", "Unread", "Replied", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                  filterTab === tab
                    ? "bg-red-50 text-red-700 border border-red-200 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500 text-sm font-medium">Loading queries...</div>
            ) : filteredQueries.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm font-medium">No queries found.</div>
            ) : (
              filteredQueries.map((query) => {
                const displayName = query.student_name || query.name || "Unknown";
                const initials = (displayName[0] || 'Q').toUpperCase();
                return (
                  <button
                    key={query.id}
                    onClick={() => setSelectedQuery(query)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedQuery?.id === query.id
                        ? "bg-red-50/50 border border-red-200 shadow-sm"
                        : "bg-white hover:bg-gray-50 border border-gray-100"
                    } ${query.status === "new" ? "border-l-4 border-l-red-600" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${query.status === "new" ? "font-bold text-gray-900" : "text-gray-700 font-medium"} truncate`}>
                          {displayName}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(query.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mb-1 truncate">
                      📞 {query.phone_number || query.phone || "No phone"}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">{query.notes || query.message || "No message provided."}</div>
                    <div className="mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        query.status === "new"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : query.status === "contacted"
                          ? "bg-slate-50 text-slate-600 border border-slate-200"
                          : "bg-green-50 text-green-600 border border-green-200"
                      }`}>
                        {query.status.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Panel - Query Detail */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 h-fit shadow-sm">
          {selectedQuery ? (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-sm">
                    {((selectedQuery.student_name || selectedQuery.name || 'Q')[0]).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold">{selectedQuery.student_name || selectedQuery.name}</h3>
                    <div className="flex gap-3 text-sm text-gray-500 font-medium">
                      <span>{selectedQuery.email || "No email"}</span>
                      {(selectedQuery.phone_number || selectedQuery.phone) && (
                        <>
                          <span>•</span>
                          <span>{selectedQuery.phone_number || selectedQuery.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-sm mb-2 font-medium">Submitted: {new Date(selectedQuery.created_at).toLocaleString()}</div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedQuery.notes || selectedQuery.message || "No message provided."}</p>
              </div>

              <div className="flex gap-2 mb-6">
                {(selectedQuery.status !== 'converted' && selectedQuery.status !== 'lost') && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedQuery.id, 'converted')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Mark Converted
                  </button>
                )}
                {selectedQuery.status === 'new' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedQuery.id, 'contacted')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-slate-500" />
                    Mark as Contacted
                  </button>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Send Reply via Email</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here... (Note: this is a UI demo, email integration needed on backend)"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm resize-none"
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => {
                      alert('Reply functionality would be connected to email backend here.');
                      setReplyText('');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all"
                    style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
                  >
                    <Send className="w-4 h-4" />
                    Send Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 font-medium">
              Select a query to view details
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
