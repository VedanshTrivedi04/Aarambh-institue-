import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTitle } from "./AboutSection";
import { X, ZoomIn } from "lucide-react";
import api from "../../lib/api";

interface GalleryImage {
  id: string;
  url: string;
  label: string;
  wide: boolean;
  tall: boolean;
}

export function InstituteGallery() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await api.get('/content/gallery/');
        const payload = response.data.data !== undefined ? response.data.data : response.data;
        const data = Array.isArray(payload) ? payload : (payload?.results || []);
        
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any, index: number) => ({
            id: item.id,
            url: item.image,
            label: item.title || item.category || "Gallery Image",
            wide: index === 0, // 1st is wide
            tall: index === 0 || index === 3, // 1st and 4th are tall
          }));
          setImages(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <section className="py-28 bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle
          label="Our Institute"
          title={`A Glimpse\nInside Aarambh`}
          subtitle="Purpose-built spaces that make learning exciting — from modern classrooms to a well-stocked library and science labs."
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-gray-400 text-center py-10 border border-gray-200 rounded-2xl bg-white/50">
            Gallery coming soon.
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(3, 200px)" }}
          >
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(img)}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{
                  gridColumn: img.wide ? "span 2" : "span 1",
                  gridRow: img.tall ? "span 2" : "span 1",
                }}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05101F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-bold text-sm">{img.label}</p>
                </div>

                {/* Zoom icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
                  <ZoomIn className="w-3.5 h-3.5 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={selected.url} alt={selected.label} className="w-full object-contain max-h-[80vh]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold">{selected.label}</p>
                <p className="text-white/40 text-sm">Aarambh Institute, Bhopal</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
