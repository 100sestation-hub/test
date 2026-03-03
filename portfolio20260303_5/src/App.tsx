import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  FileText, 
  Instagram, 
  Youtube, 
  Search, 
  Phone,
  Plus,
  Lock,
  Unlock,
  Settings,
  LogOut
} from 'lucide-react';
import { PortfolioData, WorkItem, Category, MediaType } from './types';
import { fetchPortfolioData, login } from './dataService';
import { WorkCard } from './components/WorkCard';
import { WorkModal } from './components/WorkModal';
import { WorkFormModal } from './components/WorkFormModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<WorkItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeType, setActiveType] = useState<MediaType | 'all'>('all');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken && adminToken.startsWith('admin-token-')) {
      setIsAdmin(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    alert('관리자 모드로 전환되었습니다.');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    alert('로그아웃 되었습니다.');
  };

  const refreshData = () => {
    setLoading(true);
    fetchPortfolioData().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredWorks = useMemo(() => {
    if (!data) return [];
    return data.works.filter(work => {
      const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           work.short_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           work.tools.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || work.category === activeCategory;
      const matchesType = activeType === 'all' || work.type === activeType;
      return matchesSearch && matchesCategory && matchesType;
    }).sort((a, b) => a.order - b.order);
  }, [data, searchQuery, activeCategory, activeType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#7DD3FC] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">데이터를 불러올 수 없습니다.</h1>
        <p className="text-zinc-400 mb-8">서버가 연결되지 않았거나 배포 환경 설정이 필요합니다.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#7DD3FC] text-zinc-950 font-bold rounded-xl"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showLanding && (
          <LandingPage onEnter={() => setShowLanding(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        {/* Hero Section */}
        <header className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7DD3FC]/10 text-[#7DD3FC] border border-[#7DD3FC]/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7DD3FC] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7DD3FC]"></span>
                </span>
                Available for Projects
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {data.profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-xl leading-relaxed">
                {data.profile.positioning}
              </p>
              <p className="text-lg text-zinc-500 mb-10 max-w-lg">
                {data.profile.bio}
              </p>

              <div className="flex flex-wrap gap-4">
                <a 
                  href={`mailto:${data.profile.email}`}
                  className="flex items-center gap-2 px-8 py-4 bg-[#7DD3FC] hover:bg-[#38BDF8] text-zinc-950 font-bold rounded-2xl transition-all shadow-lg shadow-sky-900/20"
                >
                  <Mail size={20} /> 문의하기
                </a>
              {isAdmin && (
                <>
                  <button 
                    onClick={() => { setEditItem(null); setIsFormModalOpen(true); }}
                    className="flex items-center gap-2 px-8 py-4 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-2xl transition-all"
                  >
                    <Plus size={20} /> 프로젝트 추가
                  </button>
                  <button 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-2xl border border-white/5 transition-all"
                  >
                    <Settings size={20} /> 프로필/카테고리 관리
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Work Section */}
      <main className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h2 className="text-3xl font-bold">전체 작업물</h2>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                placeholder="프로젝트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/50 transition-all w-full md:w-64"
              />
            </div>

            {/* Filters */}
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
              {(['all', 'video', 'image'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    activeType === type ? 'bg-zinc-800 text-[#7DD3FC] shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {type === 'all' ? '전체' : type === 'video' ? '영상' : '이미지'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              activeCategory === 'all' 
                ? 'bg-[#7DD3FC]/10 border-[#7DD3FC]/30 text-[#7DD3FC]' 
                : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            전체 카테고리
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-[#7DD3FC]/10 border-[#7DD3FC]/30 text-[#7DD3FC]' 
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredWorks.map(work => (
              <WorkCard key={work.id} item={work} onClick={setSelectedWork} />
            ))}
          </AnimatePresence>
        </div>

        {filteredWorks.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 text-lg">해당 조건에 맞는 프로젝트가 없습니다.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); setActiveType('all'); }}
              className="mt-4 text-[#7DD3FC] hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}
      </main>

      {/* Footer / Contact */}
      <footer className="bg-zinc-900/30 border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">함께 <span className="text-[#7DD3FC]">멋진 프로젝트</span>를 만들어봐요.</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-md">
              {data.profile.footer_text}
            </p>
            <div className="flex gap-4">
              {data.profile.socials.instagram && (
                <a href={data.profile.socials.instagram} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                  <Instagram size={24} />
                </a>
              )}
              {data.profile.socials.tiktok && (
                <a href={data.profile.socials.tiktok} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 3.44-.3 6.88-.45 10.32-.13 1.58-.86 3.12-2.14 4.06-1.29.97-3.02 1.31-4.57 1.01-1.57-.3-3.01-1.3-3.84-2.67-.86-1.41-.92-3.22-.31-4.67.64-1.49 2.08-2.6 3.65-2.81.1-.01.2-.01.3-.01.01 1.42-.01 2.83-.01 4.24-.44.03-.89.15-1.27.39-.57.34-.93.97-.93 1.64.01.68.39 1.32.98 1.64.59.33 1.33.34 1.91.01.58-.33.95-.96.95-1.63.03-4.75.02-9.51.02-14.26.01-.85.01-1.7.01-2.55z"/>
                  </svg>
                </a>
              )}
              {data.profile.socials.youtube && (
                <a href={data.profile.socials.youtube} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                  <Youtube size={24} />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">연락처</h4>
              <div className="space-y-4">
                <a href={`mailto:${data.profile.email}`} className="flex items-center gap-4 text-xl font-medium hover:text-[#7DD3FC] transition-colors">
                  <Mail className="text-[#7DD3FC]" /> {data.profile.email}
                </a>
                {data.profile.phone && (
                  <a href={`tel:${data.profile.phone}`} className="flex items-center gap-4 text-xl font-medium hover:text-[#7DD3FC] transition-colors">
                    <Phone className="text-[#7DD3FC]" /> {data.profile.phone}
                  </a>
                )}
              </div>
            </div>
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} {data.profile.name}. Built for creators.
            </p>
            <div className="pt-8 border-t border-white/5 mt-8">
              {!isAdmin ? (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 text-zinc-600 hover:text-[#7DD3FC] transition-all text-sm py-2 px-4 bg-zinc-900/50 rounded-lg border border-white/5 hover:border-[#7DD3FC]/30"
                >
                  <Lock size={14} /> 관리자 로그인
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#7DD3FC]/70 hover:text-[#7DD3FC] transition-all text-sm py-2 px-4 bg-[#7DD3FC]/5 rounded-lg border border-[#7DD3FC]/20 hover:border-[#7DD3FC]/40"
                >
                  <Unlock size={14} /> 관리자 모드 (로그아웃)
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <WorkModal 
        item={selectedWork} 
        onClose={() => setSelectedWork(null)} 
        isAdmin={isAdmin}
        categories={data.categories}
        onEdit={(item) => {
          setSelectedWork(null);
          setEditItem(item);
          setIsFormModalOpen(true);
        }}
      />
      <WorkFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => { setIsFormModalOpen(false); setEditItem(null); }} 
        onSuccess={refreshData} 
        editItem={editItem}
        categories={data.categories}
      />
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSuccess={refreshData}
        data={data}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
    </>
  );
}
