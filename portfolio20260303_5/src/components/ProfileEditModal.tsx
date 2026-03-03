import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, User, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { PortfolioData, CategoryItem } from '../types';
import { updateProfile, addCategory, deleteCategory, updateCategory } from '../dataService';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: PortfolioData;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSuccess, data }) => {
  const [loading, setLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    positioning: '',
    bio: '',
    email: '',
    footer_text: '',
    phone: '',
    admin_password: '',
    socials: {
      instagram: '',
      tiktok: '',
      youtube: ''
    }
  });

  useEffect(() => {
    if (data) {
      setProfileData({
        name: data.profile.name,
        positioning: data.profile.positioning,
        bio: data.profile.bio,
        email: data.profile.email,
        footer_text: data.profile.footer_text || '',
        phone: data.profile.phone || '',
        admin_password: data.profile.admin_password || '',
        socials: {
          instagram: data.profile.socials.instagram || '',
          tiktok: data.profile.socials.tiktok || '',
          youtube: data.profile.socials.youtube || ''
        }
      });
    }
    setEditingCategoryId(null);
    setConfirmDeleteId(null);
  }, [data, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profileData);
      onSuccess();
      onClose();
    } catch (error) {
      alert('오류가 발생했습니다: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      await addCategory(newCategoryName);
      setNewCategoryName('');
      onSuccess();
    } catch (error) {
      alert('카테고리 추가 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCategoryName.trim()) return;
    setLoading(true);
    try {
      await updateCategory(id, editingCategoryName);
      setEditingCategoryId(null);
      onSuccess();
    } catch (error) {
      alert('카테고리 수정 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      setConfirmDeleteId(null);
      onSuccess();
    } catch (error) {
      alert('카테고리 삭제 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
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
          className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 md:p-10 no-scrollbar shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <User className="text-[#7DD3FC]" size={28} />
              프로필 및 카테고리 관리
            </h2>
            <button 
              type="button"
              onClick={onClose} 
              className="p-3 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-12">
            {/* Profile Section */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">기본 정보 수정</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">이름</label>
                    <input
                      required
                      value={profileData.name}
                      onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">포지셔닝 (한 줄 소개)</label>
                    <input
                      required
                      value={profileData.positioning}
                      onChange={e => setProfileData({ ...profileData, positioning: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">자기소개 (Bio)</label>
                  <textarea
                    required
                    value={profileData.bio}
                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 h-32 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">푸터 안내 문구 (함께 멋진 프로젝트... 아래 문구)</label>
                  <textarea
                    required
                    value={profileData.footer_text}
                    onChange={e => setProfileData({ ...profileData, footer_text: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 h-24 transition-all resize-none"
                    placeholder="예: 현재 새로운 프리랜서 프로젝트 및 풀타임 기회를 찾고 있습니다."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">이메일</label>
                    <input
                      required
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">전화번호</label>
                    <input
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">관리자 비밀번호</label>
                    <input
                      type="password"
                      value={profileData.admin_password}
                      onChange={e => setProfileData({ ...profileData, admin_password: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50"
                      placeholder="새 비밀번호 입력 (기본: 3945)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Instagram URL</label>
                    <input
                      value={profileData.socials.instagram}
                      onChange={e => setProfileData({ ...profileData, socials: { ...profileData.socials, instagram: e.target.value } })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">TikTok URL</label>
                    <input
                      value={profileData.socials.tiktok}
                      onChange={e => setProfileData({ ...profileData, socials: { ...profileData.socials, tiktok: e.target.value } })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">YouTube URL</label>
                    <input
                      value={profileData.socials.youtube}
                      onChange={e => setProfileData({ ...profileData, socials: { ...profileData.socials, youtube: e.target.value } })}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[#7DD3FC] hover:bg-[#38BDF8] disabled:opacity-50 text-zinc-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-900/30"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                  프로필 정보 저장
                </button>
              </form>
            </section>

            {/* Categories Section */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">카테고리 관리</h3>
              
              <div className="flex gap-4">
                <input
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all"
                  placeholder="새 카테고리 이름"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={loading || !newCategoryName.trim()}
                  className="px-8 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                >
                  <Plus size={20} /> 추가
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.categories.map((cat: CategoryItem) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-white/5 rounded-2xl group transition-all hover:border-white/10">
                    {editingCategoryId === cat.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          autoFocus
                          value={editingCategoryName}
                          onChange={e => setEditingCategoryName(e.target.value)}
                          className="flex-1 bg-zinc-800 border border-[#7DD3FC]/30 rounded-lg px-3 py-1 focus:outline-none"
                        />
                        <button 
                          onClick={() => handleUpdateCategory(cat.id)}
                          className="p-2 text-[#7DD3FC] hover:bg-[#7DD3FC]/10 rounded-lg"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingCategoryId(null)}
                          className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : confirmDeleteId === cat.id ? (
                      <div className="flex-1 flex items-center justify-between bg-red-500/5 p-1 rounded-lg">
                        <span className="text-xs text-red-500 ml-2 font-bold">정말 삭제할까요?</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md"
                          >
                            삭제
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium">{cat.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setEditingCategoryName(cat.name);
                            }}
                            className="p-2 text-zinc-500 hover:text-[#7DD3FC] hover:bg-[#7DD3FC]/10 rounded-full"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(cat.id)}
                            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
