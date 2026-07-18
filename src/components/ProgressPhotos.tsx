"use client";

import { useState, useEffect } from "react";
import { todayET } from "@/lib/timezone";

interface Photo {
  id: string;
  date: string;
  dataUrl: string;
  note: string;
}

export default function ProgressPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [note, setNote] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("musclemap_photos");
    if (saved) setPhotos(JSON.parse(saved));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Resize to save localStorage space
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 400;
        let w = img.width; let h = img.height;
        if (w > h) { if (w > max) { h = h * max / w; w = max; } }
        else { if (h > max) { w = w * max / h; h = max; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

        const newPhoto: Photo = {
          id: Date.now().toString(36),
          date: todayET(),
          dataUrl,
          note: note.trim(),
        };
        const updated = [newPhoto, ...photos].slice(0, 30); // Max 30 photos
        setPhotos(updated);
        localStorage.setItem("musclemap_photos", JSON.stringify(updated));
        setShowAdd(false);
        setNote("");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    localStorage.setItem("musclemap_photos", JSON.stringify(updated));
    setViewing(null);
  };

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-pink-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-pink-500/10 flex items-center justify-center">
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Progress Photos</h3>
              <p className="text-dark-600 text-[8px] lg:text-[9px]">{photos.length} photos saved locally</p>
            </div>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="text-dark-400 hover:text-white h-6 w-6 rounded flex items-center justify-center hover:bg-white/5 transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>

        {/* Add photo */}
        {showAdd && (
          <div className="glass-inset rounded p-2.5 mb-2 animate-fade-in space-y-2">
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="input-field !text-[11px]" />
            <label className="w-full h-8 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-semibold rounded flex items-center justify-center gap-1 cursor-pointer transition-all">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" /></svg>
              Take / Upload Photo
              <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            </label>
          </div>
        )}

        {/* Photo timeline */}
        {photos.length === 0 ? (
          <div className="text-center py-3 text-dark-600 text-[9px]">No progress photos yet. Tap + to add your first one.</div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-1">
              {photos.slice(0, 12).map((p) => (
                <button key={p.id} onClick={() => setViewing(viewing === p.id ? null : p.id)} className="relative aspect-square rounded overflow-hidden glass-inset">
                  <img src={p.dataUrl} alt={p.note || p.date} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-0.5 py-px">
                    <span className="text-[6px] text-white">{p.date.slice(5)}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Expanded view */}
            {viewing && (() => {
              const p = photos.find((x) => x.id === viewing);
              if (!p) return null;
              return (
                <div className="glass-inset rounded p-2 mt-1.5 animate-fade-in">
                  <img src={p.dataUrl} alt={p.note || p.date} className="w-full rounded mb-1.5" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-[10px] font-medium">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      {p.note && <div className="text-dark-500 text-[8px]">{p.note}</div>}
                    </div>
                    <button onClick={() => deletePhoto(p.id)} className="text-dark-600 hover:text-red-400 text-[8px] font-medium transition-colors">Delete</button>
                  </div>
                </div>
              );
            })()}

            {photos.length > 12 && <div className="text-center text-dark-600 text-[8px] mt-1">+{photos.length - 12} more photos</div>}
          </>
        )}
      </div>
    </div>
  );
}
