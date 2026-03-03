import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Loader2, Save, Trash2 } from 'lucide-react';
import { Platform, Category, MediaType, WorkItem, CategoryItem } from '../types';
import { addWorkItem, updateWorkItem, deleteWorkItem } from '../dataService';
import { convertGoogleDriveUrl } from '../utils';

interface WorkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: WorkItem | null;
  categories: CategoryItem[];
}

export const WorkFormModal: React.FC<WorkFormModalProps> = ({ isOpen, onClose, onSuccess, editItem, categories }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    media_url: '',
    thumbnail_url: '',
    type: 'video' as MediaType,
    platform: 'youtube' as Platform,
    category: 'branding' as Category,
    short_desc: '',
    role: '',
    tools: '',
    impact: ''
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title,
        media_url: editItem.media_url,
        thumbnail_url: editItem.thumbnail_url,
        type: editItem.type,
        platform: editItem.platform,
        category: editItem.category,
        short_desc: editItem.short_desc,
        role: editItem.role,
        tools: editItem.tools,
        impact: editItem.impact
      });
    } else {
      setFormData({
        title: '',
        media_url: '',
        thumbnail_url: '',
        type: 'video',
        platform: 'youtube',
        category: 'branding',
        short_desc: '',
        role: '',
        tools: '',
        impact: ''
      });
    }
  }, [editItem, isOpen]);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title,
        media_url: editItem.media_url,
        thumbnail_url: editItem.thumbnail_url,
        type: editItem.type,
        platform: editItem.platform,
        category: editItem.category,
        short_desc: editItem.short_desc,
        role: editItem.role,
        tools: editItem.tools,
        impact: editItem.impact
      });
    } else {
      setFormData({
        title: '',
        media_url: '',
        thumbnail_url: '',
        type: 'video',
        platform: 'youtube',
        category: 'branding',
        short_desc: '',
        role: '',
        tools: '',
        impact: ''
      });
    }
    setIsConfirmingDelete(false);
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editItem) {
        await updateWorkItem(editItem.id, formData);
      } else {
        await addWorkItem(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('오류가 발생했습니다: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const performDelete = async () => {
    if (!editItem) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/works/${editItem.id}`, { 
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        alert('삭제 실패: ' + (data.error || '서버 응답 오류'));
      }
    } catch (err) {
      alert('네트워크 오류: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setIsConfirmingDelete(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-10 no-scrollbar shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              {editItem ? <Save className="text-[#7DD3FC]" size={28} /> : <Plus className="text-[#7DD3FC]" size={28} />}
              {editItem ? '프로젝트 수정' : '새 프로젝트 추가'}
            </h2>
            <button 
              type="button"
              onClick={onClose} 
              className="p-3 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form id="work-form" onSubmit={handleSubmit} className="space-y-8">
            {/* ... form fields ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">프로젝트 제목</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all"
                  placeholder="예: 어반 테크 브랜드 필름"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">미디어 링크 (URL)</label>
                <input
                  required
                  value={formData.media_url}
                  onChange={e => setFormData({ ...formData, media_url: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all"
                  placeholder="YouTube, Drive, Instagram 등"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">썸네일 이미지 URL (선택사항)</label>
              <div className="flex gap-4 items-start">
                <input
                  value={formData.thumbnail_url}
                  onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="flex-1 bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all"
                  placeholder="직접 입력하지 않으면 YouTube 링크 시 자동 생성됩니다."
                />
                {formData.thumbnail_url && (
                  <div className="w-24 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-zinc-800 flex items-center justify-center shadow-inner">
                    <img 
                      src={convertGoogleDriveUrl(formData.thumbnail_url)} 
                      className="w-full h-full object-cover" 
                      alt="Preview" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">타입</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as MediaType })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="video">영상</option>
                  <option value="image">이미지</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">플랫폼</label>
                <select
                  value={formData.platform}
                  onChange={e => setFormData({ ...formData, platform: e.target.value as Platform })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="drive">Google Drive</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">카테고리</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">간단 설명</label>
              <textarea
                required
                value={formData.short_desc}
                onChange={e => setFormData({ ...formData, short_desc: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 h-32 transition-all resize-none"
                placeholder="프로젝트에 대한 짧은 설명을 입력하세요."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">역할</label>
                <input
                  required
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                  placeholder="예: 감독, 편집자"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">사용 도구</label>
                <input
                  required
                  value={formData.tools}
                  onChange={e => setFormData({ ...formData, tools: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                  placeholder="예: Premiere Pro, After Effects"
                />
              </div>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            {editItem && (
              <div className="flex-1 flex gap-2">
                {!isConfirmingDelete ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="w-full py-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <Trash2 size={22} /> 삭제
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="flex-1 py-5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={performDelete}
                      className="flex-[2] py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-900/20"
                    >
                      확인 삭제
                    </button>
                  </>
                )}
              </div>
            )}
            <button
              type="button"
              disabled={loading || isConfirmingDelete}
              onClick={() => {
                const form = document.getElementById('work-form') as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              className="flex-[2] py-5 bg-[#7DD3FC] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-900/30"
            >
              {loading ? <Loader2 className="animate-spin" /> : (editItem ? <Save size={22} /> : <Plus size={22} />)}
              {editItem ? '수정 사항 저장' : '프로젝트 추가하기'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
