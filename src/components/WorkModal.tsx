import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Info, Layers, Cpu, Edit2 } from 'lucide-react';
import { WorkItem, CategoryItem } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { convertGoogleDriveUrl } from '../utils';

interface WorkModalProps {
  item: WorkItem | null;
  onClose: () => void;
  onEdit: (item: WorkItem) => void;
  isAdmin?: boolean;
  categories: CategoryItem[];
}

export const WorkModal: React.FC<WorkModalProps> = ({ item, onClose, onEdit, isAdmin, categories }) => {
  if (!item) return null;

  const categoryName = categories.find(c => c.id === item.category)?.name || item.category;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-black/50 hover:bg-[#7DD3FC]/20 text-[#7DD3FC] rounded-full transition-colors border border-[#7DD3FC]/20"
                title="수정하기"
              >
                <Edit2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Media Section */}
          <div className="w-full bg-black">
            {item.type === 'video' ? (
              <VideoPlayer url={convertGoogleDriveUrl(item.media_url)} platform={item.platform} title={item.title} />
            ) : (
              <img
                src={convertGoogleDriveUrl(item.media_url)}
                alt={item.title}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#7DD3FC]/10 text-[#7DD3FC] border border-[#7DD3FC]/20 rounded-full">
                {categoryName}
              </span>
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-400 rounded-full">
                {item.platform}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              {item.short_desc}
            </p>

            <div className="grid grid-cols-1 gap-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg text-[#7DD3FC]">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">역할</h4>
                    <p className="text-zinc-200">{item.role}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg text-[#7DD3FC]">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">사용 도구</h4>
                    <p className="text-zinc-200">{item.tools}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href={item.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all"
              >
                원본 보기 <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
