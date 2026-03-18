import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Star, GripVertical, Camera } from 'lucide-react';

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  isCover: boolean;
}

interface MediaManagerProps {
  images: MediaItem[];
  onChange: (images: MediaItem[]) => void;
  maxImages?: number;
  className?: string;
}

export function MediaManager({ images, onChange, maxImages = 20, className }: MediaManagerProps) {
  const [dragOverZone, setDragOverZone] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((files: FileList | null) => {
    if (!files) return;
    const newItems: MediaItem[] = Array.from(files).slice(0, maxImages - images.length).map((file, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      name: file.name,
      isCover: images.length === 0 && i === 0,
    }));
    onChange([...images, ...newItems]);
  }, [images, onChange, maxImages]);

  const removeImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
      filtered[0] = { ...filtered[0], isCover: true };
    }
    onChange(filtered);
  };

  const setCover = (id: string) => {
    const updated = images.map(img => ({ ...img, isCover: img.id === id }));
    const coverIdx = updated.findIndex(img => img.isCover);
    if (coverIdx > 0) {
      const [coverItem] = updated.splice(coverIdx, 1);
      updated.unshift(coverItem);
    }
    onChange(updated);
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    onChange(reordered);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
          dragOverZone ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/50 bg-slate-50'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOverZone(true); }}
        onDragLeave={() => setDragOverZone(false)}
        onDrop={(e) => { e.preventDefault(); setDragOverZone(false); addImages(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600">Arrastra imágenes aquí o haz clic para seleccionar</p>
        <p className="text-xs text-slate-400 mt-1">{images.length}/{maxImages} imágenes · JPG, PNG, WebP</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addImages(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={cn(
                'relative group rounded-xl overflow-hidden border-2 transition-all aspect-[4/3]',
                img.isCover ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200',
                dragOverIdx === idx && dragIdx !== idx && 'border-primary ring-2 ring-primary/30',
                dragIdx === idx && 'opacity-50'
              )}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <div className="absolute top-1.5 left-1.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
              </div>
              {img.isCover && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full">
                    <Star className="h-2.5 w-2.5 fill-amber-900" /> Cover
                  </span>
                </div>
              )}
              <div className="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!img.isCover && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setCover(img.id); }}
                    className="p-1 rounded-md bg-white/90 text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    title="Establecer como cover"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="p-1 rounded-md bg-white/90 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[100px] block">{img.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <div className="text-center">
            <Camera className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Sin imágenes disponibles</p>
          </div>
        </div>
      )}
    </div>
  );
}
