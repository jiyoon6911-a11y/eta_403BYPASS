import { Show, MapTheater, ReviewLog } from './types';

export const SHOWS_DATA: Show[] = [
  {
    id: 5,
    title: "오페라의 유령",
    genre: "뮤지컬",
    facility: "샤롯데씨어터",
    score: 98.0,
    elevator: true,
    toilet: true,
    toiletRating: 4.8,
    image: "https://images.unsplash.com/photo-1516307365427-30d7148c6a18?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공", "VR연동"]
  },
  {
    id: 1,
    title: "연극 '새로운 연극적 기쁨' 403호 시나리오",
    genre: "연극",
    facility: "대학로 공터 403호",
    score: 96.5,
    elevator: true,
    toilet: true,
    toiletRating: 4.9,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "음성설명", "한국어자막"]
  },
  {
    id: 6,
    title: "2026 유니버설 인디 밴드 페스티벌 (Universal Band Fest)",
    genre: "콘서트",
    facility: "올림픽공원 88잔디마당",
    score: 98.7,
    elevator: true,
    toilet: true,
    toiletRating: 5.0,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공", "수어통역"]
  },
  {
    id: 7,
    title: "노스탤지어 록 밴드 '그레이 웨이브' 컴백 콘서트",
    genre: "콘서트",
    facility: "예스24 라이브홀",
    score: 95.2,
    elevator: true,
    toilet: true,
    toiletRating: 4.7,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공", "음성설명"]
  },
  {
    id: 8,
    title: "사운드 퓨전 재즈 밴드 '블루 노트 익스프레스'",
    genre: "콘서트",
    facility: "마포아트센터 맥홀",
    score: 92.4,
    elevator: true,
    toilet: true,
    toiletRating: 4.5,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "음성설명"]
  },
  {
    id: 9,
    title: "헤비메탈 밴드 '아이언 소울' 라이브 아레나",
    genre: "콘서트",
    facility: "고척스카이돔",
    score: 89.9,
    elevator: true,
    toilet: true,
    toiletRating: 4.3,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공", "수어통역", "음성설명"]
  },
  {
    id: 10,
    title: "청춘 어쿠스틱 팝 밴드 '봄의 숲' 잔디 힐링 페스티벌",
    genre: "콘서트",
    facility: "연세대학교 노천극장",
    score: 94.1,
    elevator: true,
    toilet: true,
    toiletRating: 4.6,
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "수어통역"]
  },
  {
    id: 11,
    title: "신디사이저 테크 밴드 '네온 프리즘' 일렉트로 오디세이",
    genre: "콘서트",
    facility: "현대카드 언더스테이지",
    score: 88.5,
    elevator: true,
    toilet: true,
    toiletRating: 4.1,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
    tags: ["자막제공", "수어통역"]
  },
  {
    id: 12,
    title: "배리어프리 펑크 록 아웃크라이 연합 페스티벌",
    genre: "콘서트",
    facility: "홍대 상상마당 라이브홀",
    score: 85.0,
    elevator: true,
    toilet: false,
    toiletRating: 3.2,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600",
    tags: ["자막제공", "휠체어석"]
  },
  {
    id: 2,
    title: "뮤지컬 '한여름밤의 꿈 (배리어프리 전용 회차)'",
    genre: "뮤지컬",
    facility: "민들레 극장",
    score: 86.0,
    elevator: true,
    toilet: true,
    toiletRating: 4.2,
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공", "음성설명"]
  },
  {
    id: 3,
    title: "대학로 클래식 휠체어 전용 윈드 앙상블",
    genre: "콘서트",
    facility: "한예아트홀 2관",
    score: 67.2,
    elevator: false,
    toilet: false,
    toiletRating: 2.1,
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공"]
  },
  {
    id: 13,
    title: "연극 '갈매기' 배리어프리 특별 기념공연",
    genre: "연극",
    facility: "명동예술극장",
    score: 97.5,
    elevator: true,
    toilet: true,
    toiletRating: 4.9,
    image: "https://images.unsplash.com/photo-1503095391757-1120044b0a2a?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공", "음성설명", "수어통역"]
  },
  {
    id: 14,
    title: "뮤지컬 '빨래' 배리어프리 특화 에디션",
    genre: "뮤지컬",
    facility: "동양예술극장 1관",
    score: 93.8,
    elevator: true,
    toilet: true,
    toiletRating: 4.4,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    tags: ["휠체어석", "자막제공"]
  },
  {
    id: 15,
    title: "포스트록 밴드 '구름아래' 가상 오디오 융합 콘서트",
    genre: "콘서트",
    facility: "구름아래소극장",
    score: 91.0,
    elevator: true,
    toilet: true,
    toiletRating: 4.0,
    image: "https://images.unsplash.com/photo-1481886156534-67a1e722536b?auto=format&fit=crop&q=80&w=600",
    tags: ["자막제공", "음성설명"]
  },
  {
    id: 4,
    title: "대학로 사운드배리어 시각무대 낭독극 403-A",
    genre: "연극",
    facility: "대학로 공터 403호",
    score: 32.4,
    elevator: false,
    toilet: false,
    toiletRating: 1.0,
    image: "https://images.unsplash.com/photo-1503095391757-1120044b0a2a?auto=format&fit=crop&q=80&w=600",
    tags: ["음성설명"]
  }
];

export const MAPS_DATA: Record<string, MapTheater> = {
  theater_403: {
    header: "대학로 403 1층 대강당 안내 지도",
    milestone: "🚶 이동이 가장 빠른 출입구: 1층 대서관 로비 방면 슬라이딩 도어",
    dist: 150,
    score: "지수 96.5",
    crowd: "중부 혼잡도: 여유"
  },
  theater_dream: {
    header: "민들레 극장 2층 관람 플로어 맵",
    milestone: "♿ 엘리베이터 정면 진로 통행 및 후방 경사로 휠체어 대기소",
    dist: 340,
    score: "지수 86.0",
    crowd: "중부 혼잡도: 보통"
  },
  theater_hanye: {
    header: "한예아트홀 지하 1층 보조 약도",
    milestone: "⚠️ 리프트 우회 복도 활용 요망. 일반 비탈길 경사 6% 완만",
    dist: 480,
    score: "지수 67.2",
    crowd: "중부 혼잡도: 혼잡"
  }
};

export const INITIAL_GLOBAL_REVIEWS: ReviewLog[] = [
  {
    id: 2001,
    userId: "art_pioneer",
    userName: "백예람",
    userRole: "동행 필요 관객",
    show: "새로운 연극적 기쁨",
    rating: 5,
    text: "대학로 공터 403호 1층 정문에 턱이 없어 전동휠체어 접근 편의가 세상 완벽했습니다. 음성해설 수신기도 감도가 매우 깨끗해서 눈을 감고도 극의 긴장감이 고스란히 전해져 큰 울림을 받았습니다.",
    comments: [
      {
        id: 9001,
        authorId: "culture_helper",
        authorName: "김지민",
        text: "동석해 도와드린 스탭 중 한 명인데 예람님이 만족하셨다니 너무 행복하네요! 자막 환경 업데이트도 더 보충하겠습니다.",
        timestamp: "1시간 전"
      }
    ]
  },
  {
    id: 2002,
    userId: "culture_helper",
    userName: "김지민",
    userRole: "서포터즈",
    show: "한여름밤의 꿈 배리어프리",
    rating: 4,
    text: "민들레 극장은 경사로가 완만해 도우미 업무를 수행하면서 휠체어 관람객분을 편히 이동시켜드릴 수 있었습니다. 다만 좌석간 단차가 약간 좁으므로 동지회원분들은 좌석 지정시 D열 이후를 추천해 드려요!",
    comments: []
  },
  {
    id: 2003,
    userId: "wheel_champion",
    userName: "박정우",
    userRole: "동행 필요 관객",
    show: "배구장 휠체어 음악 앙상블",
    rating: 2,
    text: "한예아트홀 2관은 엘리베이터가 고장 나 지하 진입 시 리프트 우회 복도를 겨우 사용했습니다. 경사가 가팔라 단독 조종은 꽤 무리였습니다. 휠체어 사용자분들은 서포터 지원 신청을 필히 하고 가세요.",
    comments: [
      {
        id: 9002,
        authorId: "art_pioneer",
        authorName: "백예람",
        text: "헉, 소중한 장애 교통 정보 공유 감사드립니다! 안내맵 리프트 상태가 꼭 최신화되어 반영되어야겠네요 ㅠㅠ",
        timestamp: "30분 전"
      }
    ]
  }
];

export const FLOORS_DATA: Record<number, { title: string; desc: string; stat: string; dist: string }> = {
  1: {
    title: "1F [전용 로비 및 지하철 연계 통로]",
    desc: "지상 전용 진입 경사 램프 및 요철 마찰 안전 타일 완비. 지하철 혜화역 대합실 연계 통로 및 다이렉트 휠체어 엘리베이터 운행 중.",
    stat: "♿ 휠체어 전용 램프 진입부: 완만 경사(1/12)",
    dist: "지상 진입"
  },
  2: {
    title: "2F [중앙 매표소 및 촉지도]",
    desc: "음성 가이드 지원 점자 촉지도 배치, 배리어프리 저상 통합 매표 키오스크 운영, 수어 안내 데스크 상시 인접 배치.",
    stat: "👁️ 시각 대체 촉도: 점자 및 음성 가이드 정합",
    dist: "이동 중"
  },
  3: {
    title: "3F [배리어프리 공연지원 라운지]",
    desc: "공연 관람을 지원하는 배리어프리 전용 다목적 라운지로 무선 자막안경 대여처 및 서포터 매칭 허브가 운영 중입니다.",
    stat: "👩‍🦽 배리어프리: 오토 가이드 및 휠체어 안심 쉼터 가설",
    dist: "이동 중"
  },
  4: {
    title: "4F [대학로 복합 예술홀 403]",
    desc: "경사 보도 및 휠체어 전용 발코니 안전 대기석 완비. 비상용 방독면 마스크 및 휴대용 들것 등 인명 소방 안전함 위치.",
    stat: "♿ 안전 피난 경로 : 서쪽 엘리베이터 정합",
    dist: "설정 목적지"
  }
};
