import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Edit2, Trash2 } from "lucide-react";
import api from "../../../lib/api";

export function AdminContent() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "Courses") endpoint = "/content/courses/";
      else if (activeTab === "Testimonials") endpoint = "/content/testimonials/";
      else if (activeTab === "Results") endpoint = "/content/success-stories/";
      
      if (endpoint) {
        const res = await api.get(endpoint);
        const payload = res.data.data !== undefined ? res.data.data : res.data;
        const data = Array.isArray(payload) ? payload : (payload?.results || []);
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Content Management</h1>
        <p className="text-gray-500 text-sm">Manage landing page content</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto custom-scrollbar">
          {["Hero", "About", "Courses", "Faculty", "Testimonials", "Results"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "text-red-700 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {["Hero", "About", "Faculty"].includes(activeTab) ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Content management for {activeTab} is currently read-only or managed via source code.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Manage {activeTab}</h3>
              <button
                className="px-4 py-2 rounded-xl font-semibold text-white text-sm shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all"
                style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
              >
                + Add New
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-gray-500 font-medium">Loading {activeTab}...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-10 text-gray-500 font-medium border border-dashed border-gray-200 bg-gray-50 rounded-xl">
                No {activeTab} found. Click "+ Add New" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-red-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-gray-900 font-bold text-lg">
                        {activeTab === "Courses" ? item.name || item.title : item.student_name || item.name}
                      </h4>
                      <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {activeTab === "Courses" && (
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    )}
                    {activeTab === "Testimonials" && (
                      <p className="text-gray-600 text-sm line-clamp-2">"{item.content}"</p>
                    )}
                    {activeTab === "Results" && (
                      <p className="text-gray-600 text-sm">{item.exam || item.exam_name} - {item.rank_or_score || item.achievement_text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
