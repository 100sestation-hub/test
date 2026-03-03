import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { WorkItem } from '../types';
import { convertGoogleDriveUrl } from '../utils';

interface WorkCardProps {
  item: WorkItem;
  onClick: (item: WorkItem) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ item, onClick }) => {
  const [imgError, setImgError] = useState(false);

  // Determine if we should use no-referrer (required for picsum)
  const isPicsum = item.thumbnail_url?.includes('picsum.photos') || false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group relative bg-zinc-900/40 rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
      onClick={() => onClick(item)}
    >
      {/* Thumbnail */}
      <div className="aspect-[4/5] overflow-hidden relative bg-zinc-800">
        {item.thumbnail_url && !imgError ? (
          <>
            {/* Blurred Background */}
            <img
              src={convertGoogleDriveUrl(item.thumbnail_url)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-110"
              referrerPolicy="no-referrer"
            />
            {/* Main Image */}
            <img
              src={convertGoogleDriveUrl(item.thumbnail_url)}
              alt={item.title}
              className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 z-10"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
            {item.type === 'video' ? <Play size={40} strokeWidth={1} /> : <ImageIcon size={40} strokeWidth={1} />}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-20" />
        
        {/* Type Icon */}
        <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80 z-30">
          {item.type === 'video' ? <Play size={14} fill="currentColor" /> : <ImageIcon size={14} />}
        </div>

        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7DD3FC]">
            {item.category}
          </span>
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {item.platform}
          </span>
        </div>
        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-[#7DD3FC] transition-colors mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2">
          {item.short_desc}
        </p>
      </div>
    </motion.div>
  );
};
