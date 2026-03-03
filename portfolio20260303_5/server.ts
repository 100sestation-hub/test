import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "portfolio.db");
const db = new Database(dbPath);

function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  // Handle drive.google.com/file/d/ID/view... or drive.google.com/open?id=ID or drive.google.com/uc?id=ID
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=))([^/&?]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?id=${driveMatch[1]}`;
  }
  return url;
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    positioning TEXT,
    bio TEXT,
    email TEXT,
    footer_text TEXT,
    phone TEXT,
    instagram TEXT,
    tiktok TEXT,
    youtube TEXT,
    admin_password TEXT DEFAULT '3945'
  );

  CREATE TABLE IF NOT EXISTS works (
    id TEXT PRIMARY KEY,
    type TEXT,
    platform TEXT,
    category TEXT,
    title TEXT,
    short_desc TEXT,
    role TEXT,
    tools TEXT,
    media_url TEXT,
    thumbnail_url TEXT,
    impact TEXT,
    sort_order INTEGER
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER
  );
`);

try {
  db.exec("ALTER TABLE profile ADD COLUMN footer_text TEXT");
} catch (e) {}

try {
  db.exec("ALTER TABLE profile ADD COLUMN admin_password TEXT DEFAULT '3945'");
} catch (e) {}

// Seed initial data if empty
const profileCount = db.prepare("SELECT COUNT(*) as count FROM profile").get() as { count: number };
if (profileCount.count === 0) {
  db.prepare(`
    INSERT INTO profile (id, name, positioning, bio, email, footer_text, phone, instagram, tiktok, youtube, admin_password)
    VALUES (1, 'CHA KYUNG HO', 'AI 기반 콘텐츠 제작과 이커머스 운영을 연결하는 실무형 크리에이터', 'AI 콘텐츠 제작과 이커머스 운영 경험을 기반으로\n노출과 전환을 함께 고려하는 실행 중심 크리에이터입니다.', 'chaone11111@gmail.com', '이커머스 및 브랜드 협업 기반 프로젝트를 함께합니다.', '010-3253-3264', 'https://instagram.com', 'https://www.tiktok.com/@livingpong', 'https://www.youtube.com/@BeforeDrop', '3945')
  `).run();
}

const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const initialCategories = [
    { id: 'branding', name: '유튜브', order: 1 },
    { id: 'commerce', name: '틱톡', order: 2 },
    { id: 'social', name: '인스타', order: 3 },
    { id: 'other', name: '상세페이지', order: 4 },
    { id: '6atxz31um', name: '썸네일', order: 5 }
  ];
  const insertCat = db.prepare("INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)");
  initialCategories.forEach(cat => insertCat.run(cat.id, cat.name, cat.order));
}

const worksCount = db.prepare("SELECT COUNT(*) as count FROM works").get() as { count: number };
if (worksCount.count === 0) {
  const initialWorks = [
    {
      "id": "eytkq7jld",
      "type": "video",
      "platform": "youtube",
      "category": "branding",
      "title": "BEFORE DROP | AI 스타일링 프리뷰 티저 영상",
      "short_desc": "AI 기반 스타일링 프리뷰 티저 영상입니다.\n발매전 스니커즈를 먼저 스타일링 한다는 주제로 제작되었습니다.\nAI 비주얼 제작과 AI 음악을 결합해\n브랜드의 정체성과 감도를 동시에 보여주는 콘텐츠입니다.",
      "role": "전체 기획·제작",
      "tools": "Veo3, Midjourney, Nano banana, Suno ai, Capcut ",
      "media_url": "https://youtu.be/5To50QEKips?si=oql6qTdNsCCxKuak",
      "thumbnail_url": "https://img.youtube.com/vi/5To50QEKips/hqdefault.jpg",
      "impact": "",
      "sort_order": 1
    },
    {
      "id": "zy32y2j6k",
      "type": "video",
      "platform": "youtube",
      "category": "branding",
      "title": "Travis Scott x Fragment x Air Jordan 1 Low 2025",
      "short_desc": "도쿄 한정 발매를 기념해 제작한 시네마틱 콘셉트 숏 영상입니다.\nTravis Scott, Cactus Jack, Fujiwara Hiroshi 협업을 모티브로,\n스니커즈가 디자인되는 순간을 상상해 재현했습니다.\n협업이 가진 상징성과 창작의 에너지를 표현했습니다.",
      "role": "전체 기획·제작",
      "tools": "Veo3, Nano banana, Capcut",
      "media_url": "https://youtube.com/shorts/p2ZUwyCKj1U?si=MbQwMEKqDzv3_FBr",
      "thumbnail_url": "https://img.youtube.com/vi/p2ZUwyCKj1U/hqdefault.jpg",
      "impact": "",
      "sort_order": 2
    },
    {
      "id": "zsrvpzwbv",
      "type": "video",
      "platform": "youtube",
      "category": "branding",
      "title": "CACTUS JACK TOKYO POP-UP 👟 The Hype Lives On",
      "short_desc": "도쿄 한정 발매를 기념해 제작한 시네마틱 숏 콘텐츠입니다.\n이번 협업이 가진 상징성과 발매 현장의 에너지를 담았습니다.\n\n",
      "role": "전체 기획·제작",
      "tools": "Veo3, Nano banana, Capcut",
      "media_url": "https://youtube.com/shorts/EqmoPhWsckI?si=9PMFScn4Rw5wLoxi",
      "thumbnail_url": "https://img.youtube.com/vi/EqmoPhWsckI/hqdefault.jpg",
      "impact": "",
      "sort_order": 3
    },
    {
      "id": "hgy6911rj",
      "type": "video",
      "platform": "youtube",
      "category": "branding",
      "title": "𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 | 크리스마스 재즈 플레이리스트",
      "short_desc": "겨울 감성 재즈 플레이리스트 영상으로,\n계절 무드에 맞는 비주얼과 함께\nSUNO AI로 제작한 재즈 음악을 결합해 완성했습니다.",
      "role": "전체 기획·제작",
      "tools": "Kling, Nano banana, Suno ai, Capcut ",
      "media_url": "https://youtu.be/Rxy4HMSbeM4?si=9BzVH0CyMtCMRR85",
      "thumbnail_url": "https://img.youtube.com/vi/Rxy4HMSbeM4/hqdefault.jpg",
      "impact": "",
      "sort_order": 4
    },
    {
      "id": "83ez480yd",
      "type": "video",
      "platform": "youtube",
      "category": "branding",
      "title": "CCM 워십 | 눈 속에서 다시 피다",
      "short_desc": "스토리 기획부터 애니메이션 연출,\nSUNO AI 기반 음악 제작까지 1인 제작으로 진행한 작품입니다.\n겨울의 차가움과 은혜의 따뜻함을 대비시키며\n회복의 메시지를 시각과 음악으로 함께 풀어냈습니다.",
      "role": "전체 기획·제작",
      "tools": "Kling, Nano banana, Suno ai, Capcut ",
      "media_url": "https://youtu.be/tDWru6bvECo?si=-7EVZzjOui3KQe71",
      "thumbnail_url": "https://img.youtube.com/vi/tDWru6bvECo/hqdefault.jpg",
      "impact": "",
      "sort_order": 5
    },
    {
      "id": "4s1rrms3z",
      "type": "video",
      "platform": "youtube",
      "category": "branding",
      "title": " [MV] KoJeongMin (고정민) - Beautiful Heaven",
      "short_desc": "CCM 가수 고정민 2집 수록곡 ‘Beautiful Heaven’의 뮤직비디오입니다.\n가사의 메시지를 디즈니 스타일 애니메이션으로 재해석해,\n천국의 소망과 빛의 이미지를 따뜻한 색감과 스토리텔링으로 구현했습니다.",
      "role": "전체 기획·제작",
      "tools": "Kling, Hailuo, Midjourney, Nano banana, Capcut",
      "media_url": "https://youtu.be/vJGVizas3tY?si=BDk5Ey9797nnh2pY",
      "thumbnail_url": "https://img.youtube.com/vi/vJGVizas3tY/hqdefault.jpg",
      "impact": "",
      "sort_order": 6
    },
    {
      "id": "mn9znq8qh",
      "type": "video",
      "platform": "tiktok",
      "category": "commerce",
      "title": "트레이더스 쇼핑쇼츠 (초콜릿)",
      "short_desc": "트레이더스 인기 상품을 한눈에 정리한 쇼핑 쇼츠 영상입니다.\n숏폼 특성상 썸네일과 영상 시작 3초 안에 시청자의 시선을 끌 수 있도록\n강한 후킹 문구와 빠른 정보 전달 구조로 제작했습니다.",
      "role": "전체 기획·제작",
      "tools": "Grok, Kling, Nano banana, Capcut",
      "media_url": "https://www.tiktok.com/@livingpong/video/7601038112260656405?is_from_webapp=1&sender_device=pc&web_id=7602823882608936466",
      "thumbnail_url": "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/ocAiAnIc4AA6KSYAAEX7RWBkvEZ4xXMBt8ali~tplv-tiktokx-origin.image?dr=14575&x-expires=1772668800&x-signature=7uCRKnFuGoKZaBqUymuIY%2F%2FkHjE%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my",
      "impact": "",
      "sort_order": 7
    },
    {
      "id": "3qgb1yiqi",
      "type": "video",
      "platform": "tiktok",
      "category": "commerce",
      "title": "하리보 젤리 코하쿠토 만들기  ",
      "short_desc": "최근 유행 중인 ‘젤리 얼려 먹기’ 트렌드를 반영해 하리보 젤리로 코하쿠토를 만드는 과정을 숏폼 콘텐츠로 제작했습니다.\n영상은 AI 기반 영상 제작 툴을 활용해 구성했으며, 배경 음악 또한 AI로 직접 제작해 콘텐츠 분위기에 맞는 경쾌한 리듬으로 완성했습니다.",
      "role": "전체 기획·제작",
      "tools": "Grok, Kling, Nano banana, Suno ai, Capcut",
      "media_url": "https://www.tiktok.com/@livingpong/video/7611911602673323284?is_from_webapp=1&sender_device=pc&web_id=7602823882608936466",
      "thumbnail_url": "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oQa8HAA40Cgy1SDiB4iiwgB7B0AKNdAIEbfIUX~tplv-tiktokx-origin.image?dr=14575&x-expires=1772668800&x-signature=j8Bwi78I%2B%2BF%2BOG%2BAyj1lNgMhBls%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my",
      "impact": "",
      "sort_order": 8
    },
    {
      "id": "7j1ophdj0",
      "type": "video",
      "platform": "tiktok",
      "category": "commerce",
      "title": "하리보 샤말로우 맛있게 먹는 미친 조합",
      "short_desc": "하리보 샤말로우를 활용한 4가지 꿀조합을 소개하는 쇼츠입니다.\n강한 초반 후킹과 빠른 전개 구조로 신상 간식을 더 맛있게 즐길 수 있도록 제작했습니다.\n\n",
      "role": "전체 기획·제작",
      "tools": "Grok, Nano banana, Capcut",
      "media_url": "https://www.tiktok.com/@livingpong/video/7609338160174140693?is_from_webapp=1&sender_device=pc&web_id=7602823882608936466",
      "thumbnail_url": "https://p77-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oQBWEAoMA3ZwEAAnOASz8CAniAaPEwYLMiZIl~tplv-tiktokx-origin.image?dr=14575&x-expires=1772668800&x-signature=OHKi30XFlYRf54wEZ%2FmciitOlOQ%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my",
      "impact": "",
      "sort_order": 9
    },
    {
      "id": "ensmqyu22",
      "type": "image",
      "platform": "other",
      "category": "other",
      "title": "누적 판매 강조형 바디로션 상세페이지 제작",
      "short_desc": "판매 수치와 신뢰 요소를 상단에 배치해 구매 신뢰를 형성하고,\n향·보습·텍스처·사용 시나리오를 단계적으로 구성한 전환형 상세페이지입니다.\n질문형 카피와 감성 연출 컷을 결합해\n기능 설명과 이미지 몰입도를 동시에 높이도록 제작했습니다.",
      "role": "전체 기획·제작",
      "tools": "Google AI Studio, Nano banana, Photoshop",
      "media_url": "https://i.ifh.cc/a4KDzs.jpg",
      "thumbnail_url": "https://i.ifh.cc/a4KDzs.jpg",
      "impact": "",
      "sort_order": 10
    },
    {
      "id": "xxmtpith5",
      "type": "image",
      "platform": "other",
      "category": "other",
      "title": "프리미엄 100% 땅콩버터 브랜딩 상세페이지 제작",
      "short_desc": "100% 땅콩 원료의 USP를 중심으로\n차별성, 활용 장면, 영양 신뢰 요소를 단계적으로 설계한 상세페이지입니다.\n강한 첫 화면 후킹과 감성 카피를 결합해\n구매 전환을 유도하도록 제작했습니다.",
      "role": "전체 기획·제작",
      "tools": "Google AI Studio, Nano banana, Photoshop",
      "media_url": "https://i.ifh.cc/x9nwZN.jpg",
      "thumbnail_url": "https://i.ifh.cc/x9nwZN.jpg",
      "impact": "",
      "sort_order": 11
    },
    {
      "id": "vnni61lmm",
      "type": "image",
      "platform": "other",
      "category": "other",
      "title": "저자극 시카 앰플 전환 최적화 상세페이지 기획·제작",
      "short_desc": "진정·장벽·저자극 테스트를 중심으로\n과학적 신뢰와 제형 체감 컷을 결합해 설계한 시카 앰플 상세페이지입니다.\n감성 이미지와 기능 메시지를 균형 있게 배치해\n구매 전환을 유도하도록 제작했습니다.",
      "role": "전체 기획·제작",
      "tools": "AI Studio, Nano banana, Photoshop",
      "media_url": "https://i.ifh.cc/A2BK9F.jpg",
      "thumbnail_url": "https://i.ifh.cc/A2BK9F.jpg",
      "impact": "",
      "sort_order": 12
    },
    {
      "id": "e4o9f12u3",
      "type": "image",
      "platform": "other",
      "category": "6atxz31um",
      "title": "AI 푸드 비주얼 리디자인 (스트로베리)",
      "short_desc": "기존 단일 제품 컷 이미지를 기반으로,\nAI를 활용해 광고 비주얼 콘셉트로 재구성한 작업입니다.\n따뜻한 자연광 톤과 딸기·잼 소품을 추가해\n제품의 신선함과 달콤한 질감을 강조했고,\n단면 컷을 활용해 시각적 몰입도와 구매 욕구를 높이는 구성으로 연출했습니다.",
      "role": "전체 기획·제작",
      "tools": "Nano banana, Photoshop",
      "media_url": "https://i.ifh.cc/X0gQb8.jpg",
      "thumbnail_url": "https://i.ifh.cc/X0gQb8.jpg",
      "impact": "",
      "sort_order": 13
    },
    {
      "id": "no5xg8d0b",
      "type": "image",
      "platform": "other",
      "category": "6atxz31um",
      "title": "AI 푸드 비주얼 리디자인 (바닐라 로투스)",
      "short_desc": "기존 단순 누끼 기반 제품 이미지를\nAI를 활용해 브랜드 광고 비주얼 콘셉트로 재구성한 작업입니다.\n비스코프 쿠키와 화이트 초콜릿 소품을 배치해\n제품의 맛 콘셉트를 직관적으로 전달하도록 구성했으며,\n따뜻한 자연광 톤과 우드 텍스처를 활용해\n카페 감성의 브랜딩 분위기를 연출했습니다.",
      "role": "전체 기획·제작",
      "tools": "AI Studio, Nano banana, Photoshop",
      "media_url": "https://i.ifh.cc/BFwtWO.jpg",
      "thumbnail_url": "https://i.ifh.cc/BFwtWO.jpg",
      "impact": "",
      "sort_order": 14
    },
    {
      "id": "ab77c8pyr",
      "type": "image",
      "platform": "other",
      "category": "6atxz31um",
      "title": "AI 푸드 비주얼 리디자인 (샌드위치)",
      "short_desc": "화이트 배경의 단독 제품 컷 이미지를 기반으로,\nAI를 활용해 카페 브랜드 광고 콘셉트의 푸드 비주얼로 재구성한 작업입니다.\n우드 보드와 자연광 톤을 활용해 따뜻한 카페 무드를 강조했으며,\n토마토·햄·치즈 레이어의 볼륨감을 부각시켜\n제품의 신선함과 식감을 직관적으로 전달하도록 구성했습니다.\n",
      "role": "전체 기획·제작",
      "tools": "Google AI Studio, Nano banana, Photoshop",
      "media_url": "https://i.ifh.cc/oxky4V.jpg",
      "thumbnail_url": "https://i.ifh.cc/oxky4V.jpg",
      "impact": "",
      "sort_order": 16
    },
    {
      "id": "j9b1aau1f",
      "type": "video",
      "platform": "tiktok",
      "category": "commerce",
      "title": "AI 동물 숏폼 제작 (패러디)",
      "short_desc": "넷플릭스 오징어 게임의 상징적인 장면을 패러디해,\n야생 곰과 ‘무궁화 꽃이 피었습니다’ 콘셉트를 결합한 AI 기반 동물 숏폼 콘텐츠입니다.\n현실감 있는 CCTV 시점으로 연출하여\n우연히 포착된 상황처럼 보이도록 구성했으며,\n긴장감과 유머가 동시에 전달되도록 초반 3초 후킹 구조에 집중해 제작했습니다.",
      "role": "전체 기획·제작",
      "tools": "Veo3, Nano banana, Capcut ",
      "media_url": "https://www.tiktok.com/@animalnpick/video/7570329745603300615?is_from_webapp=1&sender_device=pc&web_id=7612835398944261650",
      "thumbnail_url": "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oIIj2oSAmF7a2VpPGDEfwHL8GYACcAefINIQvs~tplv-tiktokx-origin.image?dr=14575&x-expires=1772672400&x-signature=g%2B1IIMXTGDkVJA3LkyTqiSmW6Ek%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my",
      "impact": "",
      "sort_order": 16
    },
    {
      "id": "tu4cu3exy",
      "type": "video",
      "platform": "tiktok",
      "category": "commerce",
      "title": "AI 동물 숏폼 제작 (유머)",
      "short_desc": "AI 영상 생성 툴을 활용해\n한국 농가 마당의 분위기, 김장 소품 디테일,\n개의 움직임을 자연스럽게 표현했으며,\n초반 안정감 → 후반 반전이라는 숏폼 최적화 구조로 제작했습니다.",
      "role": "전체 기획·제작",
      "tools": "Sora2",
      "media_url": "https://www.tiktok.com/@animalnpick/video/7585096917420494101?is_from_webapp=1&sender_device=pc&web_id=7612835398944261650",
      "thumbnail_url": "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oEswQjrlAPaBd7U0K7PBg99pUiImEAiDABAofB~tplv-tiktokx-origin.image?dr=14575&x-expires=1772672400&x-signature=EaEWwF5vYZYM9709UyLo%2FvOy9K0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my",
      "impact": "",
      "sort_order": 17
    },
    {
      "id": "ckp74my3r",
      "type": "video",
      "platform": "tiktok",
      "category": "commerce",
      "title": "AI 동물 숏폼 제작 (유머)",
      "short_desc": "단 1초 만에 비굴 모드로 전환되는 반전 구조의 AI 동물 숏폼 콘텐츠입니다.\n극단적인 상황 대비를 활용한 리듬감 중심 AI 유머 콘텐츠 제작 사례입니다.",
      "role": "전체 기획·제작",
      "tools": "Sora3",
      "media_url": "https://www.tiktok.com/@animalnpick/video/7584072194217626900?is_from_webapp=1&sender_device=pc&web_id=7612835398944261650",
      "thumbnail_url": "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/o8FCeBFQAEDuowAAkoAgfGEbpAIgVB1BUASACC~tplv-tiktokx-origin.image?dr=14575&x-expires=1772672400&x-signature=wC5B19yjgARvIp7SEZgpg4l%2FSn0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my",
      "impact": "",
      "sort_order": 18
    }
  ];
  const insertWork = db.prepare(`
    INSERT INTO works (id, type, platform, category, title, short_desc, role, tools, media_url, thumbnail_url, impact, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  initialWorks.forEach(work => {
    insertWork.run(
      work.id, work.type, work.platform, work.category, work.title, 
      work.short_desc, work.role, work.tools, work.media_url, 
      work.thumbnail_url, work.impact, work.sort_order
    );
  });
}

async function getAutoThumbnail(platform: string, media_url: string, type: string): Promise<string | null> {
  if (platform === 'youtube') {
    const ytIdMatch = media_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const ytId = ytIdMatch ? ytIdMatch[1] : null;
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  } else if (platform === 'tiktok') {
    try {
      // Add User-Agent to avoid being blocked by TikTok
      const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(media_url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (response.ok) {
        const data = await response.json() as any;
        console.log("TikTok oEmbed response:", data.thumbnail_url);
        return data.thumbnail_url || null;
      } else {
        console.error("TikTok oEmbed failed:", response.status, response.statusText);
      }
    } catch (e) {
      console.error("TikTok oEmbed error:", e);
    }
  } else if (platform === 'vimeo') {
    try {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(media_url)}`);
      if (response.ok) {
        const data = await response.json() as any;
        return data.thumbnail_url || null;
      }
    } catch (e) {
      console.error("Vimeo oEmbed error:", e);
    }
  } else if (type === 'image') {
    return media_url;
  }
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Auth
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    console.log(`Login attempt with password: "${password}"`);
    
    try {
      const profile = db.prepare("SELECT admin_password FROM profile WHERE id = 1").get() as { admin_password: string };
      const storedPassword = profile?.admin_password || "3945";

      if (password && password.trim() === storedPassword.trim()) {
        console.log("Login successful");
        res.json({ success: true, token: `admin-token-${storedPassword}` });
      } else {
        console.log("Login failed: Incorrect password");
        res.status(401).json({ success: false, error: "비밀번호가 틀렸습니다." });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  });

  // API Routes
  app.get("/api/portfolio", (req, res) => {
    try {
      const profile = db.prepare("SELECT id, name, positioning, bio, email, footer_text, phone, instagram, tiktok, youtube FROM profile WHERE id = 1").get();
      const works = db.prepare("SELECT * FROM works ORDER BY sort_order ASC").all();
      const categories = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all();
      
      console.log(`Fetched portfolio: ${works.length} works, ${categories.length} categories found.`);
      
      res.json({
        profile: {
          ...profile,
          socials: {
            instagram: (profile as any).instagram,
            tiktok: (profile as any).tiktok,
            youtube: (profile as any).youtube
          }
        },
        works: works.map((w: any) => ({
          ...w,
          order: w.sort_order
        })),
        categories
      });
    } catch (error) {
      console.error("Fetch portfolio error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/profile", (req, res) => {
    const { name, positioning, bio, email, footer_text, phone, socials, admin_password } = req.body;
    try {
      if (admin_password) {
        db.prepare(`
          UPDATE profile SET 
            name = ?, positioning = ?, bio = ?, email = ?, footer_text = ?, phone = ?,
            instagram = ?, tiktok = ?, youtube = ?, admin_password = ?
          WHERE id = 1
        `).run(
          name, positioning, bio, email, footer_text, phone,
          socials.instagram, socials.tiktok, socials.youtube, admin_password
        );
      } else {
        db.prepare(`
          UPDATE profile SET 
            name = ?, positioning = ?, bio = ?, email = ?, footer_text = ?, phone = ?,
            instagram = ?, tiktok = ?, youtube = ?
          WHERE id = 1
        `).run(
          name, positioning, bio, email, footer_text, phone,
          socials.instagram, socials.tiktok, socials.youtube
        );
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all();
    res.json(categories);
  });

  app.post("/api/categories", (req, res) => {
    const { name } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    const order = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
    try {
      db.prepare("INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)").run(id, name, order.count + 1);
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM categories WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/works", async (req, res) => {
    let { 
      type, platform, category, title, short_desc, 
      role, tools, media_url, thumbnail_url, impact 
    } = req.body;
    
    // Convert Google Drive URLs to direct links
    media_url = convertGoogleDriveUrl(media_url);
    thumbnail_url = convertGoogleDriveUrl(thumbnail_url);

    const id = Math.random().toString(36).substring(2, 11);
    const sort_order = db.prepare("SELECT COUNT(*) as count FROM works").get() as { count: number };

    // Auto-generate thumbnail if not provided
    let finalThumbnail = thumbnail_url;
    if (!finalThumbnail || finalThumbnail.trim() === '') {
      const autoThumb = await getAutoThumbnail(platform, media_url, type);
      if (autoThumb) {
        finalThumbnail = autoThumb;
      }
    }

    if (!finalThumbnail || finalThumbnail.trim() === '') {
      finalThumbnail = `https://picsum.photos/seed/${id}/800/450`;
    }

    try {
      db.prepare(`
        INSERT INTO works (id, type, platform, category, title, short_desc, role, tools, media_url, thumbnail_url, impact, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, 
        type, 
        platform, 
        category, 
        title, 
        short_desc, 
        role, 
        tools, 
        media_url, 
        finalThumbnail, 
        impact, 
        sort_order.count + 1
      );
      console.log(`Created work item with ID: ${id}`);
      res.json({ success: true, id });
    } catch (error) {
      console.error("Create work error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/works/:id", async (req, res) => {
    const { id } = req.params;
    let { 
      type, platform, category, title, short_desc, 
      role, tools, media_url, thumbnail_url, impact 
    } = req.body;

    // Convert Google Drive URLs to direct links
    media_url = convertGoogleDriveUrl(media_url);
    thumbnail_url = convertGoogleDriveUrl(thumbnail_url);

    console.log(`Updating work item with ID: ${id}`);

    // Auto-generate thumbnail if not provided
    let finalThumbnail = thumbnail_url;
    if (!finalThumbnail || finalThumbnail.trim() === '') {
      const autoThumb = await getAutoThumbnail(platform, media_url, type);
      if (autoThumb) {
        finalThumbnail = autoThumb;
      }
    }

    if (!finalThumbnail || finalThumbnail.trim() === '') {
      finalThumbnail = `https://picsum.photos/seed/${id}/800/450`;
    }

    try {
      const result = db.prepare(`
        UPDATE works SET 
          type = ?, platform = ?, category = ?, title = ?, short_desc = ?, 
          role = ?, tools = ?, media_url = ?, thumbnail_url = ?, impact = ?
        WHERE id = ?
      `).run(
        type, platform, category, title, short_desc, 
        role, tools, media_url, finalThumbnail, impact, id
      );
      console.log(`Update result:`, result);
      res.json({ success: true });
    } catch (error) {
      console.error("Update work error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/works/:id", (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete work item with ID: ${id}`);
    try {
      // Use TRIM and CAST to handle potential type mismatches or hidden spaces
      const result = db.prepare("DELETE FROM works WHERE TRIM(CAST(id AS TEXT)) = TRIM(?)").run(String(id));
      console.log(`Delete result for ${id}:`, result);
      res.json({ success: true, changes: result.changes });
    } catch (error) {
      console.error(`Delete error for ${id}:`, error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.get("/api/debug/works", (req, res) => {
    const works = db.prepare("SELECT * FROM works").all();
    res.json(works);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
