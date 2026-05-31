import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, Zap, Layers, Play, StopCircle, CheckCircle, 
  AlertTriangle, AlertOctagon, Compass, Video, 
  HelpCircle, Accessibility, Activity, Volume2, 
  VolumeX, RefreshCw, Eye, Landmark, Navigation2, LogIn,
  Sliders, X, Users, TrendingUp, Info, Search, MapPin, Check, Sparkles
} from 'lucide-react';

interface MobilityTabProps {
  onAnnounce: (msg: string) => void;
  highContrast: boolean;
}

interface EnhancedFloorDetail {
  title: string;
  desc: string;
  pathway: string;
  elevator: string;
  toilet: string;
  hazards: string;
  visualPathNodes: Array<{ x: number; y: number; label: string; type: 'path' | 'toilet' | 'elevator' | 'hazard' }>;
}

export interface VenueDetail {
  id: string;
  name: string;
  location: string;
  distance: string;
  accessibility: string;
  ratingHex: string;
  desc: string;
  floors: Record<number, EnhancedFloorDetail>;
}

export const VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  "univ-hall": { lat: 37.58245, lng: 127.00185 },    // 대학로 복합 예술홀 (혜화역 4번출구)
  "arko-art": { lat: 37.58071, lng: 127.00263 },     // 아르코예술극장
  "hakjeon-blue": { lat: 37.58204, lng: 127.00310 },  // 학전블루 소극장
  "ilsong-art": { lat: 37.8864, lng: 127.7371 },      // 일송아트홀 한림대학교
  "baekryeong-art": { lat: 37.8702, lng: 127.7441 },   // 백령아트센터 강원대학교
  "sangsang-chuncheon": { lat: 37.8735, lng: 127.7025 } // KT&G 상상마당 춘천 아트센터
};

// Haversine distance in meters
export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Compact and neat database of diverse regional performance halls
export const VENUES_DATA: VenueDetail[] = [
  {
    id: "univ-hall",
    name: "대학로 복합 예술홀",
    location: "서울특별시 종로구 대학로 120 (혜화동)",
    distance: "45m",
    accessibility: "매우 우수",
    ratingHex: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    desc: "진턱 단차가 전혀 없는 평탄형 설계 플로어가 특징인 혜화역 배리어프리 거점.",
    floors: {
      4: {
        title: "4F [대학로 예술홀 메인 관람석]",
        desc: "기어 단차가 전혀 없는 평탄 구조 플로어. 휠체어 전용 발코니 특별석이 마려되어 있습니다.",
        pathway: "🗺️ 안심 동선: 특대 엘리베이터 승차 후 점자 트랙을 따라 직진 15m ➡️ 소홀 자동문 통과",
        elevator: "🛗 승강시설: [서편 메인 침대형 특대 승강기] 정상 운행 중",
        toilet: "🚻 장애인 화장실: [대강당 전정 서편] 원터치 전동식 슬라이딩 다목적 해피룸 구비",
        hazards: "⚠️ 특정 요철 기둥: 중앙 콘솔 후열 음향 케이블 배선 고정용 경사 가릴막 턱 존재",
        visualPathNodes: [
          { x: 30, y: 80, label: "🛗 서편 특대형 엘리베이터", type: "elevator" },
          { x: 50, y: 60, label: "🚶 유도 점자 트랙", type: "path" },
          { x: 68, y: 48, label: "⚠️ 음향 선로 보호 덮개 턱", type: "hazard" },
          { x: 82, y: 72, label: "🚻 영유아 겸용 특설 화장실", type: "toilet" }
        ]
      },
      3: {
        title: "3F [배리어프리 공연지원 라운지]",
        desc: "다양한 무장벽 센서 및 휠체어 관리, 배리어프리 전용 쉼터가 구비된 중앙 통합 대합 공간입니다.",
        pathway: "🗺️ 안심 동선: 커넥트 타워 엘리베이터 정면 하차 ➡️ 평탄 매트 라운지를 지나 중앙 대합실 진로",
        elevator: "🛗 승강시설: [커넥트 타워 안심 중앙 스마트 엘리베이터] 정상 가동",
        toilet: "🚻 장애인 화장실: [가이드라인 대합실 맞은편] 음성가이드 및 비상 도움벨 탑재 장애인 안심 화장실",
        hazards: "⚠️ 특정 요철: 무대 보조 연결부 알루미늄 슬라브 마감 6mm 완곡 보강 턱",
        visualPathNodes: [
          { x: 25, y: 75, label: "🛗 커넥트 타워 안심 승강기", type: "elevator" },
          { x: 48, y: 55, label: "🚶 배리어프리 평탄 안심 라운지", type: "path" },
          { x: 64, y: 50, label: "⚠️ 무대 연결 전원 배선 덮개 턱", type: "hazard" },
          { x: 80, y: 68, label: "🚻 라운지 장애인 안심 화장실", type: "toilet" }
        ]
      },
      2: {
        title: "2F [무장벽 매표 카운터 & 촉지도]",
        desc: "저상 키오스크 및 무장벽 실시간 자막 음성 수어 전용 상담 데스크가 운영되는 로비홀입니다.",
        pathway: "🗺️ 안심 동선: 승강설비 복도 출입 ➡️ 촉지도 음성 촉지판 수취 안내 ➡️ 통합 프론트 데스크",
        elevator: "🛗 승강시설: [중앙 통로 와이드 리프트 엘리베이터] 연계 정상 가용",
        toilet: "🚻 장애인 화장실: [수어 프론트 데스크 우코너 전방] 수평수직 점자 유도형 화장실",
        hazards: "⚠️ 특정 요철 기둥: 안내 번호 대기 라인 벨트 파이프 기둥 (푹신 충돌 방지 폼 시공)",
        visualPathNodes: [
          { x: 18, y: 72, label: "🛗 와이드 리프트 승강기", type: "elevator" },
          { x: 38, y: 56, label: "👁️ 음성 유도 촉지도 존", type: "path" },
          { x: 58, y: 44, label: "⚠️ 이동식 승객 가이드 봉", type: "hazard" },
          { x: 80, y: 70, label: "🚻 프론트 보완 장애 화장실", type: "toilet" }
        ]
      },
      1: {
        title: "1F [지상 정합 로비 및 혜화역 연계로]",
        desc: "혜화역 대합실부터 단차 유합 없이 완전히 평탄하게 마감된 대형 출입구입니다.",
        pathway: "🗺️ 안심 동선: 혜화역 4번출구 하차 ➡️ 로비 통합 안심 게이트 통과 ➡️ 서측 승강기 즉시 탑승",
        elevator: "🛗 승강시설: [지하철역 출구 연계 완벽 배리어프리 전용 리프트] 운행",
        toilet: "🚻 장애인 화장실: [메인 출입 로비 1층 중앙 특실] 인공지능 음성 가이드 화장실 완비",
        hazards: "⚠️ 특정 요철 기둥: 공용 정수기 하단부 바닥 급배수 구관 라인 6mm 고정 가이드 턱",
        visualPathNodes: [
          { x: 15, y: 75, label: "🛗 지하철 연동 고속 리프트", type: "elevator" },
          { x: 40, y: 60, label: "🚪 로비 무장벽 오픈 게이트", type: "path" },
          { x: 62, y: 46, label: "⚠️ 벽변 급수 배관 노출 가이드", type: "hazard" },
          { x: 82, y: 72, label: "🚻 1층 메인 음성감지 안심실", type: "toilet" }
        ]
      }
    }
  },
  {
    id: "arko-art",
    name: "아르코예술극장",
    location: "서울특별시 종로구 대학로 8길 7",
    distance: "120m",
    accessibility: "우수",
    ratingHex: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    desc: "야외 마당 예술 마당과 실내 로비 경선이 보행 휠체어 전용 연성 고점 마감된 역사깊은 대극장.",
    floors: {
      4: {
        title: "4F [아르코 2층 객석 휠체어 테라스]",
        desc: "완만한 휠체어 회전 반경과 안전 보호 펜스가 정밀하게 보완 완성된 객석 구역.",
        pathway: "🗺️ 안심 동선: 메인 엘리베이터 하자 ➡️ 테라스 보호 우드레일 직영 주행 ➡️ 발코니 특별 지정석",
        elevator: "🛗 승강시설: [남동측 주 전용 엘리베이터 1호기] 정상 운행",
        toilet: "🚻 장애인 화장실: [2층 관객홀 동편] 와이드 오토 전동 유도 안심 대변기 특실",
        hazards: "⚠️ 특정 요철 기둥: 벽체 야간 정밀 가이드 소방등 브레킷 돌출 돌출부",
        visualPathNodes: [
          { x: 20, y: 80, label: "🛗 메인 엘리베이터 1호기", type: "elevator" },
          { x: 42, y: 60, label: "🚶 소홀 연결 목재 안심 난간", type: "path" },
          { x: 65, y: 50, label: "⚠️ 비상 안전 조명등 벽체 돌출부", type: "hazard" },
          { x: 80, y: 70, label: "🚻 객석 전용 도어 자동 화장실", type: "toilet" }
        ]
      },
      3: {
        title: "3F [아르코 연습 소장 및 옥외 가든]",
        desc: "연습 공간과 아틀리에 전시 존을 이어주는 와이드 목재 슬로프를 배치한 배리어프리 존.",
        pathway: "🗺️ 안심 동선: 아틀리에 출구 진로 ➡️ 전면 목재 완완사 경사 기점 직진 ➡️ 옥외 정원 데크 통과",
        elevator: "🛗 승강시설: [주차 타워 연계 광폭 전동 엘리베이터] 정상 가용",
        toilet: "🚻 장애인 화장실: 3층 아틀리에 전정 남여 안심 촉지 다목적 화장실 완비",
        hazards: "⚠️ 특정 요철 기둥: 가든 가변 우드 단차 턱 (전동 휠체어 바퀴 안심 러버 패드 시공)",
        visualPathNodes: [
          { x: 18, y: 74, label: "🛗 주차 아연 엘리베이터", type: "elevator" },
          { x: 45, y: 55, label: "🚶 야외 아웃도어 데크 코스", type: "path" },
          { x: 62, y: 48, label: "⚠️ 우드데크 모퉁이 완화 러버 가드", type: "hazard" },
          { x: 82, y: 72, label: "🚻 아틀리에 음성 촉지 화장실", type: "toilet" }
        ]
      },
      2: {
        title: "2F [소극장 로비 대합실 & 자막 전용 패드]",
        desc: "저상 키오스크 매표기와 실시간 무선 배리어프리 자막 패드 수령 대여처입니다.",
        pathway: "🗺️ 안심 동선: 중앙 엘리베이터 승차 하차 ➡️ 대합 카운터 수어 키오스크 ➡️ 우대 발권 도달",
        elevator: "🛗 승강시설: [중앙 계단 안측 스마트 음성 유도 구동 승강기] 가동",
        toilet: "🚻 장애인 화장실: [2층 서편 소강 유도홀 초입] 전동식 미닫이 휠체어 대응실",
        hazards: "⚠️ 특정 요철 기둥: 계단 진인 구역 시각 점자 유도 타일 경계 스틸 프레임 턱 (5mm)",
        visualPathNodes: [
          { x: 22, y: 70, label: "🛗 중앙 음성 유도 엘리베이터", type: "elevator" },
          { x: 40, y: 55, label: "🚶 배리어프리 수어 발권소", type: "path" },
          { x: 60, y: 46, label: "⚠️ 시각 점자블록 금속 마감 프레임", type: "hazard" },
          { x: 80, y: 72, label: "🚻 로비 초입 전동식 안심 화장실", type: "toilet" }
        ]
      },
      1: {
        title: "1F [메인 예술 광폭 로비 & 마당 슬로프]",
        desc: "실평면 콘크리트 및 안심 점점 브레이크 블록 트랙으로 야외 마당에서 곧장 인바운드 진로가 확보된 로비.",
        pathway: "🗺️ 안심 동선: 야외 예술마당 경사 슬라이더 ➡️ 1층 광폭 유리 정문 게이트 통과 ➡️ 메인 플로어 안착",
        elevator: "🛗 승강시설: [지상 연계 주 진입 경량 리프트 설비] 연동 작동 중",
        toilet: "🚻 장애인 화장실: [안내 데스크 우측 코너 방향] 완전 개방 수직 지지 안전 바 설치완료",
        hazards: "⚠️ 특정 요철 기둥: 야외 스틸 배너 홍보 입간판 하부 고정용 사각 중철 받침턱",
        visualPathNodes: [
          { x: 15, y: 76, label: "🛗 야외 마당 경량 안심 리프트", type: "elevator" },
          { x: 38, y: 62, label: "🚪 1층 광폭 글래스 자동 게이트", type: "path" },
          { x: 64, y: 48, label: "⚠️ 야외 배너 지중 스틸 철판 받침대", type: "hazard" },
          { x: 82, y: 72, label: "🚻 데스크 우코너 원터치 장애인실", type: "toilet" }
        ]
      }
    }
  },
  {
    id: "hakjeon-blue",
    name: "학전블루 소극장",
    location: "서울특별시 종로구 대학로 12길 46",
    distance: "280m",
    accessibility: "보통",
    ratingHex: "bg-amber-500/10 text-amber-405 border-amber-500/25",
    desc: "진로의 물리 단턱 배제를 위해 이동형 고무 휠체어 램프가 상설 거치되어 있는 아담한 대학로 원조 소극장.",
    floors: {
      4: {
        title: "4F [학전 세미나 소극장 기획 회의존]",
        desc: "실내 보도 폭이 협소하여 전동 휠체어 회전 시 사전 유도 선로 체크가 요구되는 소강당.",
        pathway: "🗺️ 안심 동선: 계단실 경사 리프트 하차 ➡️ 난간 추종 일자 직진 ➡️ 세미나 회의실 게이트",
        elevator: "🛗 승강시설: [계단 측벽 수동 결착 가변 구동 휠체어 리프트] (예약제)",
        toilet: "🚻 장애인 화장실: 4층에는 장애인 대응 안심 편의실이 부재하여, 1층 화장실 미리 가용을 권장",
        hazards: "⚠️ 특정 요철 기둥: 복도 벽면 소방 호수 연결 파이프 모서리 강성 턱 요철",
        visualPathNodes: [
          { x: 25, y: 78, label: "🛗 계단 벽부 가변 리프트", type: "elevator" },
          { x: 50, y: 55, label: "🚶 벽부 안심 스테인리스 난간 트랙", type: "path" },
          { x: 70, y: 48, label: "⚠️ 소방관 소화전 마디 돌출 기둥", type: "hazard" }
        ]
      },
      3: {
        title: "3F [갤러리 안심 아카이브]",
        desc: "기존의 소형 턱들을 나무 합판 완수 경판으로 꼼꼼히 덮어 평형 주행성을 확보한 전시장.",
        pathway: "🗺️ 안심 동선: 전동 리프트 데크 ➡️ 나무 비탈 램프 보도 주행 ➡️ 원형 무장벽 점자 촉판",
        elevator: "🛗 승강시설: [계단 철제 레일 장착식 휠체어 리프트] (원터치 구동 신형 교체 완료)",
        toilet: "🚻 장애인 화장실: [갤러리 메인 전면 동코너 내부] 원터치 미닫이 대응실 가용",
        hazards: "⚠️ 특정 요철 기둥: 아카이브 소품 장식장 하단 지지 플레이트 돌출부 턱 (스펀지 범퍼 마감)",
        visualPathNodes: [
          { x: 18, y: 75, label: "🛗 계단 레일 전동 휠체어 리프트", type: "elevator" },
          { x: 42, y: 60, label: "🚶 갤러리 목재 안심 평탄 덮개 슬로프", type: "path" },
          { x: 65, y: 48, label: "⚠️ 유물 장식 스탠드 모서리 턱", type: "hazard" },
          { x: 80, y: 70, label: "🚻 갤러리 동코너 배리어프리 화장실", type: "toilet" }
        ]
      },
      2: {
        title: "2F [연습 기획 보도 및 마그네틱 촉지 안내]",
        desc: "자석형 점자 안내 도판이 부착되어 전방 지체 장애인 연습실 진입을 케어하는 소극장 복도.",
        pathway: "🗺️ 안심 동선: 수직 서편 리프트 탈착 ➡️ 마그네틱 자석 점자 트랙 직진 ➡️ 사무연습실 문",
        elevator: "🛗 승강시설: [실내 서측 탑재형 휠체어 전용 수직 리프트기] 정상 가동",
        toilet: "🚻 장애인 화장실: [자석 안내도 좌측 기획 부속실] 수직가변 세면대 손잡이 대용량 화장실",
        hazards: "⚠️ 특정 요철 기둥: 연습 존 방화용 오토 셔터 마디 걸림 턱 (12mm 경량 알루미늄 슬라이더 완화)",
        visualPathNodes: [
          { x: 15, y: 72, label: "🛗 복도 수직형 휠체어 전동 리프트", type: "elevator" },
          { x: 38, y: 58, label: "🚶 가이트 마그네틱 점자 가이드 라벨", type: "path" },
          { x: 58, y: 46, label: "⚠️ 오토 방화 셔터 마디 알루미늄 턱", type: "hazard" },
          { x: 82, y: 72, label: "🚻 기획실 다목적 수직 안심 화장실", type: "toilet" }
        ]
      },
      1: {
        title: "1F [학전 주 게이트 & 램프 완비 매표소]",
        desc: "마찰 계수가 높은 안전 벌집 형태의 고무 완사판이 대문 턱에 완전 결박 시공된 지상 입구.",
        pathway: "🗺️ 안심 동선: 혜화 골목 완만 보도 ➡️ 야외 고무 비탈 슬라이드 ➡️ 1층 수업 매표소 안착",
        elevator: "🛗 승강시설: [정문 안심 경사 고무 비탈 램프 트랙] 상시 개장",
        toilet: "🚻 장애인 화장실: [로비 엘리베이터 동편 주 다용실] 음성 스위치 도움 제어 스마트 소홀",
        hazards: "⚠️ 특정 요철 기둥: 낙수 방지 그레이팅 보도 쇠창 바닥 배수구 (바퀴 완벽 빠짐 방지 스틸 그물망 시공)",
        visualPathNodes: [
          { x: 14, y: 76, label: "🛗 정문 경사용 고무 안심 램프", type: "elevator" },
          { x: 36, y: 64, label: "🚪 1층 턱배제 메인 자동문 입구", type: "path" },
          { x: 60, y: 50, label: "⚠️ 우수 배수구 스틸 그물 그레이팅", type: "hazard" },
          { x: 80, y: 74, label: "🚻 로비 메인 음성감지 스마트 소홀", type: "toilet" }
        ]
      }
    }
  },
  {
    id: "ilsong-art",
    name: "일송아트홀",
    location: "강원특별자치도 춘천시 한림대학길 1 (옥천동)",
    distance: "100m",
    accessibility: "매우 우수",
    ratingHex: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    desc: "진입 슬로프와 배리어프리 전용 휠체어석이 완비된 다목적 문화강당.",
    floors: {
      4: {
        title: "4F [공연장 상부 조종실 & 휠체어 대기석]",
        desc: "경사가 완만하고 휠체어 단차 극복 경사판이 시공된 쾌적한 4층 대기역.",
        pathway: "🗺️ 안심 동선: 전용 엘리베이터 하차 후 휠체어 트랙 진입",
        elevator: "🛗 승강시설: 현대식 배리어프리 전용 고속 엘리베이터 완비",
        toilet: "🚻 장애인 화장실: 원터치 센서가 구비된 현대식 화장실",
        hazards: "⚠️ 특정 요철: 복도 측면 소화전 마감 트랙 돌출",
        visualPathNodes: [
          { x: 30, y: 80, label: "🛗 배리어프리 고속 엘리베이터", type: "elevator" },
          { x: 50, y: 60, label: "🚶 휠체어 안심 유도선", type: "path" }
        ]
      },
      3: {
        title: "3F [중층 객석 진입로]",
        desc: "미끄럼 방지 패드와 보강 난간이 깔끔하게 부착된 동선 영역.",
        pathway: "🗺️ 안심 동선: 로비 광폭 경사로를 통해 객석 입구로 이동",
        elevator: "🛗 승강시설: 휠체어로 탑승 가능한 2호기 항시 정상작동",
        toilet: "🚻 장애인 화장실: 미닫이식 자동문 화장실 가용",
        hazards: "⚠️ 특정 요철: 미세 턱 (완화 고무패드 부착 완료)",
        visualPathNodes: [
          { x: 25, y: 75, label: "🛗 수평 엘리베이터", type: "elevator" },
          { x: 64, y: 50, label: "⚠️ 미세 단차 완화 구간", type: "hazard" }
        ]
      },
      2: {
        title: "2F [종합 안내 촉지도 및 매표 데스크]",
        desc: "저상형 촉지도 및 수어 전용 카운터가 위치한 로비홀.",
        pathway: "🗺️ 안심 동선: 정문 진입 슬로프를 지나 우측 안내 데스크 도착",
        elevator: "🛗 승강시설: 주 진입용 넓은 리프트 엘리베이터 가동",
        toilet: "🚻 장애인 화장실: 시각/청각 피드백 시스템 화장실 구비",
        hazards: "⚠️ 특정 요철: 가변 대기 로프 지지봉",
        visualPathNodes: [
          { x: 18, y: 72, label: "🛗 주 진입용 광폭 리프트", type: "elevator" },
          { x: 38, y: 56, label: "👁️ 저상 촉지도", type: "path" }
        ]
      },
      1: {
        title: "1F [지상 입구 및 외부 경사 슬로프]",
        desc: "한림대학교 메인 보도에서 바로 연결되는 단차 없는 무장벽 진입로.",
        pathway: "🗺️ 안심 동선: 정문 완만 경사로 통과하여 로비 진입",
        elevator: "🛗 승강시설: 휠체어 리프트 대기 항시 정상가동",
        toilet: "🚻 장애인 화장실: 안전 지지대 탑재형 패밀리 화장실 완비",
        hazards: "⚠️ 특정 요철: 정수기 급배수 점검 턱",
        visualPathNodes: [
          { x: 15, y: 75, label: "🚶 지상 완만 경사로", type: "path" }
        ]
      }
    }
  },
  {
    id: "baekryeong-art",
    name: "백령아트센터",
    location: "강원특별자치도 춘천시 강원대학길 1 (효자동)",
    distance: "250m",
    accessibility: "우수",
    ratingHex: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    desc: "강원대학교 내 대형 공연시설로, 풍부한 배리어프리 좌석과 우수한 슬로프 진입 시설을 자랑합니다.",
    floors: {
      4: {
        title: "4F [백령아트센터 음향 제어석 및 상실]",
        desc: "계단 리프트 연계로 휠체어 승하차가 가능한 관람 보지 구역.",
        pathway: "🗺️ 안심 동선: 휠체어 리프트를 통해 안전 구역 이동",
        elevator: "🛗 승강시설: 계단 장착식 휠체어 리프트 가동 중",
        toilet: "🚻 장애인 화장실: 현대식 장애인 화장실",
        hazards: "⚠️ 특정 요철: 소방 배관 박스 돌출",
        visualPathNodes: [
          { x: 20, y: 80, label: "🛗 계단 휠체어 리프트", type: "elevator" }
        ]
      },
      3: {
        title: "3F [중앙 테라스 및 매점]",
        desc: "장애인과 노약자가 무리 없이 이동할 수 있도록 평탄화된 휴게 라운지.",
        pathway: "🗺️ 안심 동선: 엘리베이터 하자 후 평탄 매트 존 진입",
        elevator: "🛗 승강시설: 통유리형 승객용 엘리베이터 정상 복구",
        toilet: "🚻 장애인 화장실: 촉지도 연계 전용 화장실 가용",
        hazards: "⚠️ 특정 요철: 출입문 하단 가이드 틈새",
        visualPathNodes: [
          { x: 25, y: 75, label: "🚶 평탄 라운지 매트 존", type: "path" }
        ]
      },
      2: {
        title: "2F [메인 매표 데스크 & 촉지도]",
        desc: "저상 키오스크와 음성 촉지 안내 장치가 설치되어 있습니다.",
        pathway: "🗺️ 안심 동선: 주출입구 슬로프 진입 후 정면 촉지도 확인",
        elevator: "🛗 승강시설: 휠체어 우대로비 전용 리프트 운행",
        toilet: "🚻 장애인 화장실: 자동 미닫이 안심 변기 특실",
        hazards: "⚠️ 특정 요철: 매표 대기 가이드라인",
        visualPathNodes: [
          { x: 38, y: 56, label: "👁️ 음성 유도 촉지도", type: "path" }
        ]
      },
      1: {
        title: "1F [지상 보완 광장 및 메인 게이트]",
        desc: "평탄화 마감된 강원대학교 캠퍼스 지상 입구 구역.",
        pathway: "🗺️ 안심 동선: 캠퍼스 인도 인도 슬로프로 진입 ➡️ 1층 정문 게이트",
        elevator: "🛗 승강시설: 대형 배리어프리 램프 트랙 운영",
        toilet: "🚻 장애인 화장실: 로비 중앙 통합 화장실",
        hazards: "⚠️ 특정 요철: 그레이팅 배수 트렌치",
        visualPathNodes: [
          { x: 15, y: 76, label: "🚪 1층 메인 정문 게이트", type: "path" }
        ]
      }
    }
  },
  {
    id: "sangsang-chuncheon",
    name: "KT&G 상상마당 춘천 아트센터",
    location: "강원특별자치도 춘천시 스포츠타운길399번길 25 (삼천동)",
    distance: "420m",
    accessibility: "매우 우수",
    ratingHex: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    desc: "의암호 호숫가 자연 풍광과 어우러진 붉은 벽돌의 배리어프리 전원형 문화 공간.",
    floors: {
      4: {
        title: "4F [호수 전망대 및 야외 테라스]",
        desc: "계단 없이 평탄한 안심 경사로 슬로프로 옥상 전경을 볼 수 있는 연계 코스.",
        pathway: "🗺️ 안심 동선: 옥외 지상 완만 램프 트랙을 통해 직접 옥상 도달",
        elevator: "🛗 승강시설: 현대적 통유리형 스마트 전망 승강기 운행",
        toilet: "🚻 장애인 화장실: 원터치 안심 센서 스마트실 구비",
        hazards: "⚠️ 특정 요철: 야외 데크 가식 조인트 틈",
        visualPathNodes: [
          { x: 18, y: 74, label: "🛗 통유리 스마트 승강기", type: "elevator" }
        ]
      },
      3: {
        title: "3F [전시장 & 크리에이티브 홀]",
        desc: "턱이 완벽히 마감되고 휠체어 회전 반경이 시원스럽게 확보된 아트홀 전시장.",
        pathway: "🗺️ 안심 동선: 전시홀 엘리베이터 내려서 목재 램프 코스로 진입",
        elevator: "🛗 승강시설: 전시관 내부 승객 우대용 넓은 승강기",
        toilet: "🚻 장애인 화장실: 점자 및 음성안내 지원 독립 화장실",
        hazards: "⚠️ 특정 요철: 가변 파티션 이동 레일 턱",
        visualPathNodes: [
          { x: 45, y: 55, label: "🚶 전시장 목재 안심 길", type: "path" }
        ]
      },
      2: {
        title: "2F [상상 라이브 홀 & 카페]",
        desc: "라이브 스페이스 및 통로에 점자형 유도 타일과 안심 도어가 작동하는 쾌적한 구간.",
        pathway: "🗺️ 안심 동선: 카페 정문 램프 통과 후 라이브 홀 입구 도달",
        elevator: "🛗 승강시설: 안심 복지 전용 엘리베이터 상시 운행",
        toilet: "🚻 장애인 화장실: 다용도 안전 바 설치 대형 화장실",
        hazards: "⚠️ 특정 요철: 전력 배선 정합용 바닥 보호 몰딩",
        visualPathNodes: [
          { x: 22, y: 70, label: "🚶 라이브홀 자석 점자 트랙", type: "path" }
        ]
      },
      1: {
        title: "1F [의암호 수변 보도 진입 데크 및 야외광장]",
        desc: "자연 지형을 슬기롭게 극복한 완만한 호숫가 전용 목재 데크 램프 입구.",
        pathway: "🗺️ 안심 동선: 삼천동 수변 전용 보도 ➡️ 슬라이드 슬로프 ➡️ 광폭 로비 진입",
        elevator: "🛗 승강시설: 수평 전동 리프트 데크 운행",
        toilet: "🚻 장애인 화장실: 야외 보조 화장실 다목적 룸 가용",
        hazards: "⚠️ 특정 요철: 야외 가든 자갈 배수로",
        visualPathNodes: [
          { x: 15, y: 76, label: "🚪 수변 목재 안심 전 주차장 연결로", type: "path" }
        ]
      }
    }
  }
];

export default function MobilityTab({ onAnnounce, highContrast }: MobilityTabProps) {
  // Real GPS and Location States
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAddress, setGpsAddress] = useState<string>("서울특별시 종로구 대학로 120 (혜화동)");
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>("");
  const [gpsConsent, setGpsConsent] = useState<'pending' | 'granted' | 'declined'>('granted');

  const connectRealLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('브라우저가 위치 정보를 지원하지 않습니다.');
      onAnnounce('❌ 실패: 기기 또는 웹 브라우저가 GPS 정보 접근을 지원하지 않습니다.');
      return;
    }

    setGpsStatus('locating');
    onAnnounce('📡 GPS: 실시간 기기 정밀 위치를 탐색 중입니다...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsLocation({ lat: latitude, lng: longitude });
        setGpsStatus('success');

        const precisionText = accuracy ? `오차 범위 ±${accuracy.toFixed(1)}m` : '정밀 수신 완료';
        onAnnounce(`🎯 내 GPS 연동 성공! 위도:${latitude.toFixed(5)}, 경도:${longitude.toFixed(5)} (${precisionText})`);

        // Reverse geocoding via OpenStreetMap Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'ko'
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              const addr = data.address;
              let readableAddr = "";
              if (addr) {
                const city = addr.city || addr.province || addr.metropolitan || addr.municipality || "";
                const borough = addr.borough || addr.suburb || addr.quarter || addr.district || "";
                const road = addr.road || "";
                const house = addr.house_number || "";
                if (city || borough || road) {
                  readableAddr = `${city} ${borough} ${road} ${house}`.trim().replace(/\s+/g, ' ');
                }
              }
              if (!readableAddr) {
                readableAddr = data.display_name.split(',').reverse().join(' ').trim();
              }
              setGpsAddress(readableAddr);
              onAnnounce(`📍 지리 좌표가 주소로 변환되었습니다: ${readableAddr}`);
            }
          }
        } catch (err) {
          console.warn("Reverse lookup failed, keeping raw coords as address:", err);
          setGpsAddress(`위도: ${latitude.toFixed(5)}, 경도: ${longitude.toFixed(5)}`);
        }
      },
      (error) => {
        setGpsStatus('error');
        let errorMsg = '위치 권한을 거부했거나 연결할 수 없습니다.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = '사용자가 위치 정보 권한 요청을 거부했습니다.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = '네트워크 연결 상태로 인해 위치 확인이 불가합니다.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = '위치 측정 대기 초과 오류가 발생하였습니다.';
        }
        setGpsErrorMsg(errorMsg);
        onAnnounce(`❌ GPS 호출 실패: ${errorMsg}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleGpsConsent = (agree: boolean) => {
    if (agree) {
      setGpsConsent('granted');
      connectRealLocation();
    } else {
      setGpsConsent('declined');
      setGpsStatus('idle');
      onAnnounce('👤 위치 사용에 부동의하였습니다. 학전 극장 근처의 기본 위치(혜화동 대학로 120)로 탐색을 유지합니다.');
    }
  };

  // Instantly auto-connect real GPS on mount!
  useEffect(() => {
    connectRealLocation();
  }, []);

  const getVenueDistanceStr = (venueId: string, staticDistance: string) => {
    if (!gpsLocation) return staticDistance;
    const coords = VENUE_COORDS[venueId];
    if (!coords) return staticDistance;

    const meters = getHaversineDistance(gpsLocation.lat, gpsLocation.lng, coords.lat, coords.lng);
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  // NEW STATE: Venue selection, search and dynamic filter configuration
  const [selectedVenue, setSelectedVenue] = useState<VenueDetail>(VENUES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccFilter, setSelectedAccFilter] = useState("all");

  const filteredVenues = VENUES_DATA.filter(v => {
    const isChuncheon = gpsAddress.includes("춘천") || gpsAddress.includes("Chuncheon");
    if (isChuncheon) {
      const chuncheonIds = ["ilsong-art", "baekryeong-art", "sangsang-chuncheon"];
      if (!chuncheonIds.includes(v.id)) return false;
    } else {
      const defaultIds = ["univ-hall", "arko-art", "hakjeon-blue"];
      if (!defaultIds.includes(v.id)) return false;
    }

    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAcc = selectedAccFilter === 'all' || v.accessibility === selectedAccFilter;
    return matchesSearch && matchesAcc;
  });

  useEffect(() => {
    const isChuncheon = gpsAddress.includes("춘천") || gpsAddress.includes("Chuncheon");
    if (isChuncheon) {
      if (!["ilsong-art", "baekryeong-art", "sangsang-chuncheon"].includes(selectedVenue.id)) {
        const found = VENUES_DATA.find(v => v.id === "ilsong-art");
        if (found) setSelectedVenue(found);
      }
    } else {
      if (!["univ-hall", "arko-art", "hakjeon-blue"].includes(selectedVenue.id)) {
        const found = VENUES_DATA.find(v => v.id === "univ-hall");
        if (found) setSelectedVenue(found);
      }
    }
  }, [gpsAddress]);

  const [selectedFloor, setSelectedFloor] = useState(3);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [simulatedEnvironment, setSimulatedEnvironment] = useState<'safe' | 'step' | 'obstacle'>('safe');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [isVibratingEffect, setIsVibratingEffect] = useState(false);
  const [isElevatorBroken, setIsElevatorBroken] = useState(false);
  const [isShowMobileSpecs, setIsShowMobileSpecs] = useState(false);

  // Dynamic congestion stats depending on selected venue
  const [congestionList, setCongestionList] = useState<Array<any>>([]);

  // Active Context resolution helpers
  const activeVenue = selectedVenue;
  const DETAILED_3D_FLOORS = activeVenue.floors;

  // Track location state updates dynamically inside a tailored layout
  useEffect(() => {
    // Auto-align default selectedFloor to a floor detail matching selected venue
    const floorAvailable = Object.keys(selectedVenue.floors).map(v => parseInt(v));
    if (floorAvailable.length > 0 && !floorAvailable.includes(selectedFloor)) {
      setSelectedFloor(floorAvailable[0]);
    }

    const isUniv = selectedVenue.id === 'univ-hall';
    const isArko = selectedVenue.id === 'arko-art';
    const isHakjeon = selectedVenue.id === 'hakjeon-blue';
    const isIlsong = selectedVenue.id === 'ilsong-art';
    const isBaekryeong = selectedVenue.id === 'baekryeong-art';
    const isSangsang = selectedVenue.id === 'sangsang-chuncheon';
    
    const initialCongestions = [
      { 
        id: 'b1', 
        area: isUniv ? "혜화역 B1 지하철 연결 안심 통로" 
          : isArko ? "아르코 야외 마당 진입 경선" 
          : isHakjeon ? "학전 주차 골목 인도 진로"
          : isIlsong ? "한림대 야외 대운동장 진입 램프"
          : isBaekryeong ? "강원대 백령 동측 주차 도보 연결로"
          : "의암호 호변 데크 하부 연계 슬로프", 
        level: "smooth", 
        density: 15, 
        text: "🟢 원활", 
        desc: "안심 접근 도움벨 연동 양호. 정체 유발 요소 없음", 
        color: "from-green-500/10 to-emerald-500/10", 
        borderColor: "border-green-500/30", 
        textCol: "text-green-400" 
      },
      { 
        id: 'f1', 
        area: isUniv ? "1F 메인 무장벽 출입 로비 및 안내소" 
          : isArko ? "1F 메인 유리 로비 및 촉판 촉지도" 
          : isHakjeon ? "1F 고무 비탈 입구 안심 로비"
          : isIlsong ? "1F 일송 로비 무장벽 통합 데스크"
          : isBaekryeong ? "1F 백령 중앙 현관 및 배리어프리 게이트"
          : "1F 상상마당 입구 무경계 유리로비", 
        level: "normal", 
        density: 42, 
        text: "🟡 보통", 
        desc: "티켓 대역 부근 소폭 인원 혼잡 발생중", 
        color: "from-amber-500/10 to-yellow-500/10", 
        borderColor: "border-amber-500/30", 
        textCol: "text-amber-400" 
      },
      { 
        id: 'f2', 
        area: isUniv ? "2F 안심 매표소 및 종합 점자 촉지도 존" 
          : isArko ? "2F 소극장 대합실 및 복지 패드 대형처" 
          : isHakjeon ? "2F 연습실 복도 수어 대면 데스크"
          : isIlsong ? "2F 다목적 객석 안내 카운터"
          : isBaekryeong ? "2F 백령 무장벽 발권 키오스크 스페이스"
          : "2F 상상 복지 전용 라이브 스페이스 복도", 
        level: "smooth", 
        density: 20, 
        text: "🟢 원활", 
        desc: "유효 통로 정체 부재. 휠체어 전용 승강구 진입 정상", 
        color: "from-green-500/10 to-emerald-500/10", 
        borderColor: "border-green-500/30", 
        textCol: "text-green-400" 
      },
      { 
        id: 'f3', 
        area: isUniv ? "3F 실외 연결 입체 안심 브리지 통로" 
          : isArko ? "3F 아틀리에 회랑 및 디카프 야외 가든" 
          : isHakjeon ? "3F 대기 갤러리 아카이브 완사구"
          : isIlsong ? "3F 일송 소회의실 앞 완사 정렬 경사판"
          : isBaekryeong ? "3F 휴게 배리어프리 리프팅 도크"
          : "3F 크리에이티브 홀 목재 안심 패드 통로", 
        level: "smooth", 
        density: 8, 
        text: "🟢 매우 원활", 
        desc: "통로 수평 유지 완벽. 안전회전 및 통행 가능", 
        color: "from-green-500/10 to-emerald-500/10", 
        borderColor: "border-green-500/30", 
        textCol: "text-green-400" 
      },
      { 
        id: 'f4', 
        area: isUniv ? "4F 객석 1층 대강당 대기홀 우회로" 
          : isArko ? "4F 2층 객석 테라스 보행 보호 난간" 
          : isHakjeon ? "4F 오피스 복도 서측 가변 리프팅"
          : isIlsong ? "4F 객석 특별 휠체어 구역 보호 펜스"
          : isBaekryeong ? "4F 상부 관람 제어 발코니 진로"
          : "4F 호수전망 야외 경사 슬라이더 램프", 
        level: "crowded", 
        density: 88, 
        text: "🔴 혼잡", 
        desc: "퇴장 인파 성행. 휠체어 유저는 전용 우회 안심 트랙 참고", 
        color: "from-red-500/10 to-rose-500/10", 
        borderColor: "border-red-500/30", 
        textCol: "text-rose-450" 
      }
    ];
    setCongestionList(initialCongestions);
  }, [selectedVenue]);

  // TTS Helper
  const speakText = (text: string) => {
    // Suppressed audio vocalization per user request
    console.log("TTS Suppressed:", text);
  };

  const handleRefreshCongestion = () => {
    const updated = congestionList.map(item => {
      const change = Math.floor(Math.random() * 31) - 15;
      const nextDensity = Math.max(5, Math.min(100, item.density + change));
      let nLevel = "smooth";
      let nText = "🟢 원활";
      let nTextCol = "text-green-450";
      let nColor = "from-green-500/10 to-emerald-500/10";
      let nBorder = "border-green-500/20";

      if (nextDensity >= 70) {
        nLevel = "crowded";
        nText = "🔴 혼잡";
        nTextCol = "text-rose-400";
        nColor = "from-red-500/10 to-rose-500/10";
        nBorder = "border-red-500/20";
      } else if (nextDensity >= 35) {
        nLevel = "normal";
        nText = "🟡 보통";
        nTextCol = "text-amber-400";
        nColor = "from-amber-500/10 to-yellow-500/10";
        nBorder = "border-amber-500/20";
      }

      return {
        ...item,
        density: nextDensity,
        level: nLevel,
        text: nText,
        textCol: nTextCol,
        color: nColor,
        borderColor: nBorder
      };
    });

    setCongestionList(updated);
    onAnnounce(`📡 속보: [${activeVenue.name}] 실시간 센서 밀집도 통계를 갱신 가설 수집했습니다.`);
    speakText("실시간 혼잡 분석 센서 데이터를 갱신 탑정 수신했습니다.");
  };

  const handleAreaClick = (area: string, level: string, density: number, desc: string) => {
    onAnnounce(`${area}의 혼잡도를 터치 확인하셨습니다. 현재 ${level === 'crowded' ? '매우 혼잡함' : level === 'normal' ? '보통' : '교통 양호 원활'} 상탭니다. 밀집율 ${density}% 로서 ${desc}`);
    speakText(`${area} 확인. 밀집율 ${density} 퍼센트. ${desc}`);
  };

  // High-fidelity 3D structural states
  const [is3DActive, setIs3DActive] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'hazard' | 'radius'>('default');
  const [rotationX, setRotationX] = useState(55);
  const [rotationZ, setRotationZ] = useState(-18);
  const [scaling, setScaling] = useState(0.85);

  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [dragMode, setDragMode] = useState<'rotate' | 'pan'>('rotate');
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotZ: number; panX: number; panY: number; isDragging: boolean }>({
    x: 0,
    y: 0,
    rotX: 55,
    rotZ: -18,
    panX: 0,
    panY: 0,
    isDragging: false
  });

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleDragDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      rotX: rotationX,
      rotZ: rotationZ,
      panX: panX,
      panY: panY,
      isDragging: true
    };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current.isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    if (dragMode === 'rotate') {
      setRotationX(Math.max(20, Math.min(85, dragStartRef.current.rotX - deltaY * 0.4)));
      setRotationZ(dragStartRef.current.rotZ + deltaX * 0.5);
    } else {
      setPanX(dragStartRef.current.panX + deltaX * 0.8);
      setPanY(dragStartRef.current.panY + deltaY * 0.8);
    }
  };

  const handleDragUp = () => {
    setIsDragging(false);
    dragStartRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in on wheel scroll up (deltaY < 0), zoom out on wheel scroll down (deltaY > 0)
    const zoomDirection = e.deltaY < 0 ? 1 : -1;
    const zoomAmount = 0.05;
    setScaling((prev) => {
      const next = prev + zoomDirection * zoomAmount;
      return Math.max(0.3, Math.min(3.0, next));
    });
  };

  const render3DBlock = (x: number, y: number, w: number, h: number, text: string, type: 'normal' | 'accent' | 'hazard' = 'normal') => {
    const depth = 3.5;
    
    // Premium department store board styling colors (light steel grays and creams)
    let topColor = '#D2D4D9'; 
    let bevelColor = '#8A8C92';
    let textColor = '#131418';
    let textWeight = '900';

    if (type === 'accent') {
      topColor = '#C1F8FF'; // Ice blue active highlight
      bevelColor = '#00B8D4';
    } else if (type === 'hazard') {
      topColor = '#FFE0E0'; // Red caution/hazard highlight
      bevelColor = '#E53935';
    }

    return (
      <g key={text}>
        {/* 3D bevel / thickness drop layer */}
        <rect x={x} y={y + depth} width={w} height={h} rx="4" fill={bevelColor} />
        {/* Main top cap face */}
        <rect x={x} y={y} width={w} height={h} rx="4" fill={topColor} stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* Centered label text */}
        <text 
          x={x + w / 2} 
          y={y + h / 2 + 1.8} 
          fill={textColor} 
          fontSize="4.5" 
          fontWeight={textWeight} 
          textAnchor="middle" 
          fontFamily="Inter, system-ui, sans-serif"
          className="select-none pointer-events-none"
        >
          {text}
        </text>
      </g>
    );
  };

  const render3DFloorSVGCompact = (floorNum: number) => {
    return (
      <g>
        {/* Dark Board Base - Matching Lotte Dept Store Board Style */}
        <rect x="15" y="15" width="310" height="170" rx="12" fill="#18191E" stroke="#2D2E36" strokeWidth="1.5" />
        
        {/* Fine inner accent border */}
        <rect x="20" y="20" width="300" height="160" rx="9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        
        {/* Top/Header Divider Line */}
        <line x1="25" y1="36" x2="315" y2="36" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        
        {/* Decorative corner labels */}
        <text x="30" y="30" fill="rgba(255,255,255,0.35)" fontSize="5" fontWeight="bold" fontFamily="monospace">TOILET 🚻</text>
        <text x="170" y="29" fill="#EAECEF" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.8" fontFamily="Inter, sans-serif">
          {floorNum}F DIRECTORY & CONNECT MAP
        </text>
        <text x="310" y="30" fill="#FF5252" fontSize="5" fontWeight="bold" textAnchor="end" fontFamily="monospace">📍 HERE</text>

        {/* 3F DETAIL: Exact replica map based on user's image */}
        {floorNum === 3 && (
          <g>
            {/* Top row main restaurant */}
            {render3DBlock(120, 42, 100, 14, "주무대")}
            
            {/* Left side column */}
            {render3DBlock(25, 42, 32, 68, "보관소")}
            {render3DBlock(25, 114, 32, 12, "화장실 🚻", "accent")}
            
            {/* Middle Row (Connect Zone / Deli & Dining) */}
            {render3DBlock(62, 58, 28, 14, "피트")}
            {render3DBlock(93, 58, 28, 14, "음향실")}
            {render3DBlock(124, 58, 28, 14, "안내소")}
            {render3DBlock(155, 58, 28, 14, "매표소")}
            {render3DBlock(186, 58, 28, 14, "대여소")}
            {render3DBlock(217, 58, 30, 32, "특별석 ♿")}
            
            {/* Middle Inside Layer */}
            {render3DBlock(62, 75, 28, 14, "라운지")}
            {render3DBlock(62, 92, 28, 14, "촉지도")}
            {render3DBlock(93, 75, 28, 31, "도움소")}
            
            {/* Compact block nested group */}
            {render3DBlock(124, 75, 28, 10, "배부처")}
            {render3DBlock(124, 86, 28, 10, "충전소")}
            {render3DBlock(124, 97, 28, 10, "대피소")}
            
            {/* Right middle group */}
            {render3DBlock(155, 75, 28, 10, "조명실")}
            {render3DBlock(155, 86, 28, 21, "대기실")}
            {render3DBlock(186, 75, 28, 31, "⚠️ 단차", "hazard")}
            
            {/* Dotted outlines identifying Zone partitions */}
            <rect x="60" y="55" width="190" height="58" rx="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="1.5,1.5" />
            <text x="155" y="117" fill="rgba(255,255,255,0.25)" fontSize="4" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              Universal Performance Center [ Lobby Area ]
            </text>

            {/* Bottom Row (Connect Park / Dessert & Cafe) */}
            {render3DBlock(45, 126, 50, 15, "갤러리")}
            {render3DBlock(100, 126, 50, 15, "쉼터")}
            {render3DBlock(155, 126, 50, 15, "반납소")}
            {render3DBlock(210, 126, 55, 15, "소원나무 🌳", "accent")}
            
            {/* Bottom Connect Park thin category border */}
            <rect x="40" y="123" width="228" height="21" rx="3" fill="none" stroke="rgba(255,255,255,0.05)" />
            
            {/* Bottom connecting access bridge */}
            {render3DBlock(25, 147, 290, 14, "안심브리지", "accent")}
          </g>
        )}

        {/* 1F DETAIL */}
        {floorNum === 1 && (
          <g>
            {render3DBlock(110, 42, 120, 14, "지상 1F 배리어프리 메인게이트", "accent")}
            {render3DBlock(25, 42, 32, 68, "지하철 연동 램프")}
            {render3DBlock(25, 114, 32, 12, "화장실 🚻", "accent")}
            
            {/* Desk and welcome lounge */}
            {render3DBlock(62, 58, 65, 18, "로비 리셉션")}
            {render3DBlock(132, 58, 65, 18, "안내 데스크")}
            {render3DBlock(202, 58, 48, 18, "행사장 대기존")}
            
            {/* Wheelchair lounge area */}
            {render3DBlock(62, 82, 110, 24, "휠체어 가벼운 쉼터 ♿", "accent")}
            {render3DBlock(178, 82, 72, 24, "수평 광장 공간")}
            {render3DBlock(255, 55, 60, 51, "장애인 안심화장실 🚻", "accent")}
            
            {/* Bottom areas */}
            {render3DBlock(45, 126, 80, 15, "수어 자동 키오스크")}
            {render3DBlock(130, 126, 80, 15, "특설 촉지도 촉판", "accent")}
            {render3DBlock(215, 126, 80, 15, "⚠️ 급배수 파이프 턱", "hazard")}
            
            {/* Bottom street link */}
            {render3DBlock(25, 147, 290, 14, "1F STREET 진입로 및 대학로 마당", "accent")}
          </g>
        )}

        {/* 2F DETAIL */}
        {floorNum === 2 && (
          <g>
            {render3DBlock(110, 42, 120, 14, "실시간 자막 디스플레이실")}
            {render3DBlock(25, 42, 32, 68, "2F 중앙 안내 램프")}
            {render3DBlock(25, 114, 32, 12, "화장실 🚻", "accent")}
            
            {/* Tickets and kiosks */}
            {render3DBlock(62, 58, 65, 18, "저상 무인 키오스크")}
            {render3DBlock(132, 58, 65, 18, "특설 배리어프리 매표소", "accent")}
            {render3DBlock(202, 58, 48, 18, "소극장 로비 대합실")}
            
            {/* Counselors */}
            {render3DBlock(62, 82, 110, 24, "장애인 1:1 상담 안내센터", "accent")}
            {render3DBlock(178, 82, 72, 24, "로비 예술품 전시존")}
            {render3DBlock(255, 55, 60, 51, "다목적 휠체어 대응실 🚻", "accent")}
            
            {/* Bottom connections */}
            {render3DBlock(45, 126, 80, 15, "수어 상담 지원서")}
            {render3DBlock(130, 126, 80, 15, "중앙 와이드 리프트 엘리베이터", "accent")}
            {render3DBlock(215, 126, 80, 15, "⚠️ 이동식 대기라인 벨트봉", "hazard")}
            
            {/* Bottom-most */}
            {render3DBlock(25, 147, 290, 14, "2F 매표 로비 무장벽 통합 정정 라운지", "accent")}
          </g>
        )}

        {/* 4F DETAIL */}
        {floorNum === 4 && (
          <g>
            {render3DBlock(110, 42, 120, 14, "메인 관람 무대 및 연출 스테이지")}
            {render3DBlock(25, 42, 32, 68, "4F 객석 입구 슬로프")}
            {render3DBlock(25, 114, 32, 12, "화장실 🚻", "accent")}
            
            {/* Sound mixers */}
            {render3DBlock(62, 58, 65, 18, "음향 조정실")}
            {render3DBlock(132, 58, 65, 18, "무대 조명 통제실")}
            {render3DBlock(202, 58, 48, 18, "⚠️ 동선 돌출 난간 턱", "hazard")}
            
            {/* Wheelchair seat balcony */}
            {render3DBlock(62, 82, 110, 24, "휠체어 전용 발코니 특별석 ♿", "accent")}
            {render3DBlock(178, 82, 72, 24, "A열 뒤쪽 배선 안착구역")}
            {render3DBlock(255, 55, 60, 51, "객석 4F 장애인 화장실 🚻", "accent")}
            
            {/* Bottom connectors */}
            {render3DBlock(45, 126, 80, 15, "예술단 테라스 쉘터")}
            {render3DBlock(130, 126, 80, 15, "서편 특대 침대형 와이드 리프트", "accent")}
            {render3DBlock(215, 126, 80, 15, "정밀 점자 유도 가이드 트랙", "accent")}
            
            {/* Bottom-most */}
            {render3DBlock(25, 147, 290, 14, "4F 대학로 예술홀 메인 관객 라운지", "accent")}
          </g>
        )}
      </g>
    );
  };

  const assignVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      try {
        if (el.srcObject !== streamRef.current) {
          el.srcObject = streamRef.current;
        }
      } catch (err) {
        console.warn("Failed to attach live stream to video element:", err);
      }
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Turn Camera AR On/Off safely
  const handleCameraToggle = async () => {
    if (isCameraActive) {
      stopCameraStream();
      setIsCameraActive(false);
      onAnnounce("실시간 AI 보행로 비전 스캔 길안내 기능을 정지했습니다.");
      speakText("AR 카메라 안내를 안정 종료합니다.");
    } else {
      setIsCameraActive(true);
      onAnnounce("실시간 AI 보행로 비전 안내 카메라 가동을 중비 시동했습니다. 장치 탑재 카메라 가설 검측을 수집합니다.");
      speakText("실시간 보도 비전 비디오 스트림을 대칭 기동합니다.");
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        setCameraPermissionGranted(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera grant failed or was blocked by standard I-Frame security sandbox constraints:", err);
        setCameraPermissionGranted(false);
      }
    }
  };

  const handleCameraRetry = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setCameraPermissionGranted(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      onAnnounce("카메라 장치 연동이 거부되었습니다. 보안 권한 확보를 위해 화면 우상단 독립창 발권을 눌러 가동하십시오.");
    }
  };

  const triggerSimulationAlert = (type: 'safe' | 'step' | 'obstacle') => {
    setSimulatedEnvironment(type);
    if (type !== 'safe') {
      setIsVibratingEffect(true);
      setTimeout(() => setIsVibratingEffect(false), 900);
    }
  };
  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* 1. AR 길찾기 (AI AR 카메라 스마트 길안내) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <Video className="w-6 h-6 text-[#00E5FF] shrink-0" />
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            AI AR 카메라 스마트 길안내 <span className="text-[10px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded animate-pulse">AR 길찾기</span>
          </h2>
        </div>

        {isCameraActive ? (
          /* FULL IMMERSIVE TAKE-OVER AR CAMERA VIEW */
          <div className="fixed inset-0 z-50 bg-[#060608] flex flex-col justify-between overflow-hidden">
            
            {/* Web camera block or animated simulator fallback */}
            <div className="absolute inset-0 w-full h-full bg-[#121214]">
              {cameraPermissionGranted === true ? (
                <video
                  ref={assignVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82] contrast-[1.08]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                /* Dynamic Simulated Space background showing theater lobby look */
                <div className="absolute inset-0 bg-[#0d0d10] flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#00E5FF_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-5 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                      <Landmark className="w-96 h-96 text-white" />
                    </div>
                    
                    <div className="relative w-32 h-32 rounded-full bg-slate-800/20 border border-slate-700/20 flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
                        <Video className="w-6 h-6 text-[#00E5FF]" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-w-sm z-10 bg-slate-900/95 p-5 rounded-3xl border border-slate-850 backdrop-blur-sm shadow-2xl">
                      <p className="text-sm font-black text-[#00E5FF] tracking-tight flex items-center justify-center gap-1.5 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
                        카메라 연동 시뮬레이션 작동
                      </p>
                      <p className="text-[11px] text-zinc-400 font-bold leading-relaxed">
                        IFrame 연동 권한으로 인해 실제 카메라가 막혔다면, 아래 시뮬레이터를 이용하여 사설 단차 및 장애 스캔을 연습하실 수 있으며, 정식 권한은 <span className="text-white underline font-bold">Launch in new tab</span> 독립창에서 기동됩니다.
                      </p>
                      <button
                        onClick={handleCameraRetry}
                        className="w-full py-3 px-4 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-950 font-black rounded-xl text-[11px] uppercase transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
                      >
                        🎥 실제 기기 카메라 강제 승인하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Red/Green converging line overlays */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {simulatedEnvironment === 'step' && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="none">
                  <polygon points="80,750 320,750 220,380 180,380" fill="url(#redGradient)" className="opacity-30 animate-pulse" />
                  <line x1="80" y1="750" x2="180" y2="380" stroke="#EF4444" strokeWidth="3.5" />
                  <line x1="320" y1="750" x2="220" y2="380" stroke="#EF4444" strokeWidth="3.5" />
                  <circle cx="200" cy="380" r="30" fill="none" stroke="#EF4444" strokeWidth="2" className="animate-ping" />
                  <circle cx="200" cy="380" r="14" fill="#EF4444" className="opacity-75" />
                  <defs>
                    <linearGradient id="redGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {simulatedEnvironment === 'obstacle' && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="none">
                  <polygon points="50,750 180,320 230,320 100,750" fill="rgba(239, 68, 68, 0.2)" className="animate-pulse" />
                  <line x1="50" y1="750" x2="180" y2="320" stroke="#EF4444" strokeWidth="4.5" />
                </svg>
              )}

              {simulatedEnvironment === 'safe' && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="none">
                  <polygon points="100,750 300,750 215,320 185,320" fill="url(#greenGradient)" className="opacity-25" />
                  <line x1="100" y1="750" x2="185" y2="320" stroke="#10B981" strokeWidth="4.5" />
                  <line x1="300" y1="750" x2="215" y2="320" stroke="#10B981" strokeWidth="4.5" />
                  <defs>
                    <linearGradient id="greenGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>

            {/* HUD Bar controls */}
            <div className="relative z-20 flex items-center justify-between p-5 bg-gradient-to-b from-black/90 to-transparent">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-650 animate-ping"></span>
                <span className="text-xs font-black text-rose-500 tracking-wide">● 실시간 AI 지형 혼잡 비전스캔 중</span>
              </div>
              
              <button 
                onClick={() => {
                  stopCameraStream();
                  setIsCameraActive(false);
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Centered Warnings popup */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
              <AnimatePresence mode="wait">
                {simulatedEnvironment === 'step' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1c090a]/90 border border-red-500/40 p-6 rounded-2xl max-w-xs text-center shadow-2xl backdrop-blur-md">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
                    <h4 className="text-red-500 text-[10px] font-black tracking-wider uppercase">장애 경고</h4>
                    <h3 className="text-white text-base font-black py-0.5">전방 2m 앞 단단 턱 (15cm)</h3>
                    <p className="text-zinc-505 text-[9px] font-bold">휠체어 우도 전용 완사구로 우회 바랍니다.</p>
                  </motion.div>
                )}

                {simulatedEnvironment === 'obstacle' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1c090a]/90 border border-red-500/40 p-6 rounded-2xl max-w-xs text-center shadow-2xl backdrop-blur-md">
                    <AlertOctagon className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
                    <h4 className="text-red-500 text-[10px] font-black tracking-wider">안행 불가 구역</h4>
                    <h3 className="text-white text-base font-black py-0.5">금속 철제 통행 라인 차단</h3>
                  </motion.div>
                )}

                {simulatedEnvironment === 'safe' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-950/90 border border-emerald-500/30 p-5 rounded-2xl text-center shadow-xl">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white text-xs font-black">전안 보행로 수평 안정 감지 완료</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Manual trigger controller block */}
            <div className="relative z-25 mx-4 mb-3 p-4 bg-black/90 rounded-2xl border border-zinc-800 flex flex-col gap-2.5 shadow-2xl">
              <span className="text-[10px] font-black text-[#00E5FF] block">스캐너 장애 검출 시뮬레이터</span>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => triggerSimulationAlert('step')} className={`py-2 rounded-xl text-xs font-black border tracking-tight ${simulatedEnvironment==='step' ? 'bg-red-500/20 border-red-500 text-red-200':'bg-[#14151a] border-slate-800 text-slate-400'}`}>⚠️ 15cm 단턱</button>
                <button onClick={() => triggerSimulationAlert('obstacle')} className={`py-2 rounded-xl text-xs font-black border tracking-tight ${simulatedEnvironment==='obstacle' ? 'bg-red-500/20 border-red-500 text-red-200':'bg-[#14151a] border-slate-800 text-slate-400'}`}>🚧 철제차단</button>
                <button onClick={() => triggerSimulationAlert('safe')} className={`py-2 rounded-xl text-xs font-black border tracking-tight ${simulatedEnvironment==='safe' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-250':'bg-[#14151a] border-slate-800 text-slate-400'}`}>🟢 평평로</button>
              </div>
            </div>

            {/* AR Footer */}
            <div className="relative z-20 p-5 bg-gradient-to-t from-black to-transparent text-left">
              <div className="bg-[#121214] border border-[#1d1d20] rounded-3xl p-4.5 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">도착 예정지</span>
                  <p className="text-white font-black text-sm">{selectedVenue.name} 객석 전용 도어</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 block uppercase">중격 잔여</span>
                  <p className="text-white font-black text-sm"><span className="text-blue-400 font-mono">15m</span> / 1분</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* COMPACT AR CARD */
          <div className="bg-[#121214] border border-[#212124] rounded-3xl p-6 shadow-xl relative text-left">
            <div className="space-y-2">
              <h3 className="text-base font-black text-white tracking-tight">카메라 비전 기반 실도로 장애 스캔</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                카메라 렌즈를 비추면 AI 지형 추적 모듈이 {selectedVenue.name} 주변의 <span className="text-cyan-400 font-extrabold">단차, 보장벽 요소, 바닥 배수구</span>를 즉각 감지해 통행 안전을 정합합니다.
              </p>
            </div>
            
            <button
              onClick={handleCameraToggle}
              className="w-full bg-[#1e61f6] hover:bg-[#154fc1] text-white py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 mt-5 cursor-pointer shadow-lg transition-all"
            >
              <Video className="w-4 h-4" />
              <span>실시간 AI AR 카메라 길안내 가동</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. 내 위치 (검색) & 3. 주변 공연장 리스트 */}
      <div className="hc-card rounded-3xl bg-[#1c2333] border border-slate-700/80 p-5 space-y-4 text-left shadow-2xl relative overflow-hidden">
        {/* Dynamic Background visual pulses */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-750/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-750/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header GPS Telemetry Row (내 위치) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 border-b border-slate-755 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
              <span className="relative w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>
            
            <div className="space-y-0.5 text-left font-sans">
              <span className="text-[9px] text-[#00E5FF] font-black uppercase tracking-wider block flex items-center gap-1.5">
                내 위치 (검색)
                {gpsStatus === 'locating' && <span className="text-amber-400 text-[8.5px] font-bold animate-pulse">(위치 찾는 중...)</span>}
                {gpsStatus === 'success' && <span className="text-emerald-400 text-[8.5px] font-bold">(실시간 GPS 연동 완료)</span>}
                {gpsStatus === 'error' && <span className="text-rose-400 text-[8.5px] font-bold">⚠️ GPS 연결 안 됨 (기본값)</span>}
              </span>
              <p className="text-sm font-black text-white tracking-tight flex items-center gap-1">
                <MapPin className={`w-4 h-4 shrink-0 transition-all ${gpsStatus === 'locating' ? 'text-amber-400 animate-bounce' : 'text-[#00E5FF]'}`} />
                <span>{gpsAddress}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar Interface */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-350 tracking-tight">공연장 검색</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="목적지 공연장명, 주소를 직접 입력하세요... (예: 아르코, 학전, 세종)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#202738] text-white border border-slate-700/80 focus:border-cyan-500 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold outline-none placeholder:text-zinc-500 transition-all font-sans"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-black"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          {/* Dynamic filtered list of Concert halls (주변 공연장 리스트) */}
          <div className="space-y-2 pt-1.5">
            <span className="text-[10px] text-zinc-400 font-extrabold block">내 위치 기준 극장 목록 ({filteredVenues.length}개 발견)</span>
            
            <div className="grid grid-cols-1 gap-2.5">
              {filteredVenues.map((venue) => {
                const isSelected = selectedVenue?.id === venue.id;
                return (
                  <button
                    key={venue.id}
                    onClick={() => {
                      setSelectedVenue(venue);
                      onAnnounce(`목적지 공연장 배리어프리 분석 대상을 [${venue.name}]으로 변경 설정 완료했습니다. 아래 S-MAP 및 군중 분석기가 통제 연계됩니다.`);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-center space-y-1.5 cursor-pointer min-h-[84px] ${
                      isSelected
                        ? 'bg-[#2b3a55] border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)] ring-2 ring-cyan-500/30'
                        : 'bg-[#202738] hover:bg-[#273247] border-slate-700/60'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold text-[#00E5FF] font-mono tracking-wide block">
                      📍 {getVenueDistanceStr(venue.id, venue.distance)}
                    </span>
                    
                    <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                      {venue.name}
                      {isSelected && <Check className="w-4 h-4 text-[#00E5FF]" />}
                    </h4>
                  </button>
                );
              })}
            </div>

            {filteredVenues.length === 0 && (
              <div className="p-8 text-center bg-[#202738]/60 rounded-2xl border border-slate-700 space-y-2">
                <p className="text-xs text-zinc-400 font-bold">검색어 주위의 적정 배리어프리 공연 시설이 없습니다.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedAccFilter("all");
                  }} 
                  className="px-3 py-1 text-[10px] bg-[#273247] text-cyan-400 font-bold rounded-lg"
                >
                  기본값 전환 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 현재 설정된 약자 동선 분석 대상 타겟 고지 바 */}
      <div className="hc-card rounded-2xl bg-[#202738] border border-slate-700/80 p-3.5 flex items-center justify-between gap-3 my-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
          <div className="text-left font-sans">
            <h4 className="text-xs font-black text-white leading-none">
              현재 설정된 약자 동선 분석 대상: <span className="text-[#00E5FF] underline font-extrabold">{selectedVenue.name}</span>
            </h4>
            <p className="text-[10px] text-zinc-400 font-bold mt-1">현 위치에서 {getVenueDistanceStr(selectedVenue.id, selectedVenue.distance)} • 장애 편의 지지도 {selectedVenue.accessibility}</p>
          </div>
        </div>
      </div>

            {/* SUB-SECTION B: S-MAP 실시간 3D 공간 연계 시뮬레이터 (Isometric Architectural Floor map) */}
            <div className="hc-card rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-lg text-left">
              <div className="space-y-1">
                <span className="text-[9px] bg-cyan-500/15 text-[#00E5FF] border border-cyan-500/30 px-2 py-0.5 rounded font-black tracking-wider uppercase inline-block">
                  S-MAP 3D REAL-TIME TWIN
                </span>
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2 font-sans">
                  <Layers className="w-5 h-5 text-[#00E5FF]" />
                  S-MAP 실시간 3D 공간 연계 시뮬레이터
                </h3>
                <p className="text-xs text-slate-400 leading-normal font-sans font-medium">
                  {selectedVenue.name} 내부 및 지상 혜화인도 게이트의 가변 지형 물리 단면을 투시하여 휠체어 전동 회전 반경 통과 성을 모의 점검 가설합니다.
                </p>
              </div>

              <div className="flex justify-center pt-1 pb-1">
                <button
                  onClick={() => {
                    setIs3DActive(true);
                    onAnnounce(`[${selectedVenue.name}] S-MAP 3D 가상 펜스 레이어 통합 모의판이 가동되었습니다. 드래그 제어로 3D 각도 연출이 지원됩니다.`);
                  }}
                  className="w-full bg-[#00E5FF] hover:bg-cyan-400 text-slate-950 font-black py-4 px-6 rounded-2xl text-xs tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(0,229,255,0.25)] hover:shadow-[0_4px_30px_rgba(0,229,255,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  3D 정밀 투시 시뮬레이터 가동
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <p className="text-[10.5px] text-slate-400 font-sans font-bold text-center">
                  💡 상단 기동 버튼 터치 시 [{selectedVenue.name}] 전용 입체 3차원 투시도가 대수 기동하여 다각도로 요철 체크가 가능합니다.
                </p>
              </div>
            </div>

            {/* SUB-SECTION C: 실시간 현장 혼잡도 및 통제 차단 분석 (Placed at the bottom of standard list) */}
            <div className="hc-card rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-left shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] bg-cyan-500/15 text-[#00E5FF] border border-cyan-500/30 px-2 rounded font-black tracking-widest uppercase inline-block animate-pulse">
                    LIVE RADAR MATRIX
                  </span>
                  <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2 font-sans">
                    <Users className="w-5 h-5 text-[#00E5FF]" />
                    실시간 현장 혼잡도 및 통제 차단 분석
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    [{selectedVenue.name}] 지상 진입구부터 각 층별 장애 화장실 편의홀 및 객석 우대석 직결로까지의 실시간 혼잡 밀도입니다.
                  </p>
                </div>

                <button
                  onClick={handleRefreshCongestion}
                  className="p-3.5 bg-[#121214] hover:bg-slate-800 text-[#00E5FF] border border-[#00E5FF]/30 rounded-xl transition-all flex items-center justify-center active:scale-95 shrink-0 cursor-pointer"
                  title="안심 현황 갱신"
                  aria-label="안심 현황 갱신"
                >
                  <RefreshCw className="w-4 h-4 text-[#00E5FF]" />
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {congestionList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAreaClick(item.area, item.level, item.density, item.desc)}
                    className={`p-3.5 rounded-2xl border bg-gradient-to-r ${item.color} ${item.borderColor} hover:opacity-90 transition-all cursor-pointer space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono font-black text-slate-400 border border-slate-850 uppercase">
                          {item.id.toUpperCase()}
                        </span>
                        <span className="text-[11.5px] font-extrabold text-white tracking-tight">
                          {item.area}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[10.5px] font-black ${item.textCol}`}>
                          {item.text}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-[11px] font-mono font-black text-white">
                          {item.density}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div
                          style={{ width: `${item.density}%` }}
                          className={`h-full transition-all duration-500 rounded-full ${
                            item.level === 'crowded' ? 'bg-rose-500' :
                            item.level === 'normal' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans font-bold">
                        <p className="line-clamp-1">{item.desc}</p>
                        <p className="text-[#00E5FF] hover:underline whitespace-nowrap shrink-0">TTS 가이드 🔊</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#0b0c10] rounded-xl border border-slate-850/90">
                <p className="text-[10.5px] text-zinc-400 font-sans font-bold leading-relaxed">
                  💡 개별 혼잡 분석 카드를 클릭하면, 장애 편의 바이어스 통과 시간과 안심 우회 노선을 한국어 음성 비서로 정밀 가이딩합니다.
                </p>
              </div>
            </div>



      {/* FULLSCREEN IMMERSIVE TAKE-OVER 3D DIGITAL-TWIN VIEW (S-MAP Core 3D Sandbox rendering) */}
      {is3DActive && (
        <div className="fixed inset-0 z-50 bg-[#060608] flex flex-col justify-between overflow-hidden text-left">
          
          {/* Top panel */}
          <div className="z-20 flex justify-between items-center bg-[#0d0d10] border-b border-slate-800 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 hidden sm:block">
                <Layers className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                  S-MAP 3D 디지털 공간 트윈 - {activeVenue.name}
                  <span className="text-[8px] bg-cyan-500/15 text-[#00E5FF] border border-cyan-550/30 px-1 py-0.5 rounded font-mono font-bold animate-pulse">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10.5px] text-slate-400 font-semibold select-none hidden md:block">
                  보도 구조 및 휠체어 안전 회전 반경을 (RotX {Math.round(rotationX)}°, RotZ {Math.round(rotationZ)}°) 모의 뷰어로 정밀 확인합니다.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setIs3DActive(false);
                setIsShowMobileSpecs(false);
              }}
              className="px-3 py-1.5 bg-rose-950/25 hover:bg-rose-900/40 text-rose-400 border border-rose-500/25 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>투시도 종료</span>
            </button>
          </div>

          <div className="flex-1 w-full flex flex-col md:flex-row relative overflow-hidden">
            
            {/* Left Sidebar controllers */}
            <div className="hidden md:flex w-64 border-r border-[#1a1a1f] bg-[#0c0c0e] p-5 flex flex-col justify-between shrink-0 space-y-6 overflow-y-auto select-none">
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-520 font-black tracking-wider block uppercase">층수 필터 선택</span>
                <div className="grid grid-cols-1 gap-2">
                  {[4, 3, 2, 1].map((f) => {
                    const isSelected = selectedFloor === f;
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          setSelectedFloor(f);
                          onAnnounce(`3D 도면 투사선 변경: [${f}층 복합 평형] 입체 데이터를 연동 수취했습니다.`);
                        }}
                        className={`py-3 px-3 rounded-2xl text-left border text-xs font-black transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#00E5FF] border-[#00E5FF] text-slate-950 font-black shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Floor</span>
                          <span className="text-sm font-black">{f}F</span>
                        </div>
                        <span className="text-[10px] opacity-75">
                          {f === 4 ? '관람석' : f === 3 ? '안심교량' : f === 2 ? '매표촉지도' : 'STREET진입'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Angle tuner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-800 font-extrabold uppercase">3D 렌더 각도 동조</span>
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">지선 경사 각도</span>
                      <span className="text-cyan-600 font-mono font-bold">{Math.round(rotationX)}°</span>
                    </div>
                    <input type="range" min="15" max="85" value={rotationX} onChange={(e) => setRotationX(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg accent-cyan-500" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">레이더 회전 각도</span>
                      <span className="text-cyan-600 font-mono font-bold">{Math.round(rotationZ)}°</span>
                    </div>
                    <input type="range" min="-180" max="180" value={rotationZ} onChange={(e) => setRotationZ(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg accent-cyan-500" />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setRotationX(55);
                    setRotationZ(-18);
                    setScaling(0.85);
                    setPanX(0);
                    setPanY(0);
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-bold border border-slate-200 transition-all cursor-pointer"
                >
                  투시 시야각 초기화
                </button>
              </div>
            </div>

            {/* Main Interactive render platform in the centered pane */}
            <div 
              className="flex-1 h-full relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing bg-[#090a0d]"
              onMouseDown={handleDragDown}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragUp}
              onMouseLeave={handleDragUp}
              onTouchStart={handleDragDown}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragUp}
              onWheel={handleWheel}
            >
              {/* Floating control overlay buttons */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 select-none">
                <div className="flex bg-[#111216] border border-slate-800/80 p-0.5 rounded-xl text-[10px] font-black">
                  <button onClick={() => setViewMode('default')} className={`px-2.5 py-1.5 rounded-lg transition-all ${viewMode==='default'?'bg-slate-900 text-cyan-400':'text-zinc-500 hover:text-white'}`}>일반모드</button>
                  <button onClick={() => setViewMode('hazard')} className={`px-2.5 py-1.5 rounded-lg transition-all ${viewMode==='hazard'?'bg-rose-950/40 text-red-400 border border-red-500/20':'text-zinc-500 hover:text-white'}`}>🚨 요철검출</button>
                  <button onClick={() => setViewMode('radius')} className={`px-2.5 py-1.5 rounded-lg transition-all ${viewMode==='radius'?'bg-emerald-950/40 text-emerald-450 border border-emerald-500/20':'text-zinc-500 hover:text-white'}`}>♿ 회전반경</button>
                </div>
              </div>

              {/* Dynamic SVG projection with CSS transforms */}
              <div 
                className="transition-transform duration-150 ease-out select-none"
                style={{
                  transform: `scale(${scaling}) translate(${panX}px, ${panY}px)`,
                }}
              >
                <div 
                  className="relative origin-center"
                  style={{
                    transform: `perspective(800px) rotateX(${rotationX}deg) rotateZ(${rotationZ}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)'
                  }}
                >
                  <svg 
                    width="340" 
                    height="200" 
                    viewBox="0 0 340 200" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                  >
                    {render3DFloorSVGCompact(selectedFloor)}

                    {/* Interactive Landmark path Nodes */}
                    {DETAILED_3D_FLOORS[selectedFloor]?.visualPathNodes?.map((node, idx) => {
                      const isElevator = node.type === 'elevator';
                      const isToilet = node.type === 'toilet';
                      const isHazard = node.type === 'hazard';
                      
                      let dotColor = "fill-[#00E5FF] stroke-[#00E5FF]";
                      let beaconBg = "bg-cyan-500";
                      if (isElevator) { dotColor = "fill-indigo-400 stroke-indigo-400"; beaconBg = "bg-indigo-400"; }
                      if (isToilet) { dotColor = "fill-teal-400 stroke-teal-400"; beaconBg = "bg-teal-400"; }
                      if (isHazard) { dotColor = "fill-red-500 stroke-red-500"; beaconBg = "bg-red-500"; }

                      // Compute standard isometric coordinate coordinates
                      const isoX = node.x * 2.8 + 40;
                      const isoY = node.y * 0.8 + 25;

                      return (
                        <g key={idx} className="relative cursor-pointer">
                          {/* Alert hazard overlay circle buffer if in radius check mode */}
                          {viewMode === 'radius' && (isElevator || isToilet || node.type==='path') && (
                            <circle cx={isoX} cy={isoY} r="25" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" className="opacity-45 animate-pulse" />
                          )}

                          {/* Yellow hazard glowing ring if in hazard checker mode */}
                          {viewMode === 'hazard' && isHazard && (
                            <circle cx={isoX} cy={isoY} r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
                          )}

                          <circle cx={isoX} cy={isoY} r="4.5" className={dotColor} strokeWidth="1" />
                          <circle cx={isoX} cy={isoY} r="7" fill="none" strokeWidth="1" strokeDasharray="2,2" className={`${dotColor} opacity-70 animate-spin`} style={{transformOrigin: `${isoX}px ${isoY}px`}} />
                          
                          {/* Floating text labels */}
                          <g transform={`translate(${isoX}, ${isoY - 11}) rotate(${-rotationZ}, 0, 0)`} className="select-none">
                            <rect x="-35" y="-62" width="70" height="15" rx="3" fill="#0f1115" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                            <text x="0" y="-52" fill="#ffffff" fontSize="4.8" fontWeight="bold" textAnchor="middle" className="font-sans">
                              {node.label}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Navigation help controls info */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center text-[10px] text-zinc-500 select-none bg-black/70 p-2.5 rounded-xl backdrop-blur-sm">
                <span className="hidden sm:inline">👆 마우스 클릭 또는 화면 터치 드래그로 3D 도면을 돌려볼 수 있습니다.</span>
                <span className="sm:hidden">👆 드래그로 도면을 회전할 수 있습니다.</span>
                
                <div className="flex gap-2 font-mono">
                  <button onClick={() => setScaling(prev => Math.min(3.0, prev + 0.1))} className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-white font-black">+</button>
                  <button onClick={() => setScaling(prev => Math.max(0.3, prev - 0.1))} className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-white font-black">-</button>
                </div>
              </div>
            </div>

            {/* Details panel in sidebar (Right pane) */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#1a1a1f] bg-[#0c0c0e] p-5 flex flex-col justify-between overflow-y-auto shrink-0 select-text">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#212126] pb-2.5">
                  <h4 className="text-xs font-black text-rose-500 tracking-wider flex items-center gap-1.5 select-none uppercase">
                    <Map className="w-4 h-4 text-cyan-400" />
                    {selectedFloor}F 정밀 지형 분석
                  </h4>
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 text-zinc-300 font-bold rounded">
                    안심 데이터 검측 일치
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10.5px] font-extrabold select-none block uppercase">층수 고착 요강</span>
                    <h3 className="text-white text-sm font-black mt-0.5">{DETAILED_3D_FLOORS[selectedFloor].title}</h3>
                  </div>

                  {/* Accessible Paths guide display */}
                  <div className="p-3 bg-cyan-950/15 border border-cyan-500/25 rounded-2xl text-left">
                    <p className="text-[#00E5FF] text-[10.5px] font-extrabold flex items-center gap-1 select-none"><Navigation2 className="w-3.5 h-3.5" /> 휠체어 단차 극복 권장 동선</p>
                    <p className="text-zinc-200 text-[11px] font-bold mt-1.5 leading-relaxed">{DETAILED_3D_FLOORS[selectedFloor].pathway}</p>
                  </div>

                  {/* Sub components tables (Elevators, Disabled Restrooms, Hazards) */}
                  <div className="space-y-2.5">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="text-slate-500 text-[10px] font-black uppercase">♿ 편의시설 지지도</span>
                      <p className="text-zinc-300 text-[11px] font-semibold mt-1 leading-normal">{DETAILED_3D_FLOORS[selectedFloor].toilet}</p>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="text-slate-500 text-[10px] font-black uppercase">🛗 메인 승강장 가용성</span>
                      <p className="text-zinc-300 text-[11px] font-semibold mt-1 leading-normal">{DETAILED_3D_FLOORS[selectedFloor].elevator}</p>
                    </div>

                    <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-850/60">
                      <span className="text-rose-400 text-[10px] font-black uppercase">⚠️ 돌출 펜스 / 요철 리포트</span>
                      <p className="text-zinc-300 text-[11px] font-semibold mt-1 leading-normal">{DETAILED_3D_FLOORS[selectedFloor].hazards}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TTS Read speaker */}
              <button 
                onClick={() => {
                  const speechLabel = `${selectedFloor}층 보행로 안내입니다. ${DETAILED_3D_FLOORS[selectedFloor].desc}. 안심 경로는 ${DETAILED_3D_FLOORS[selectedFloor].pathway}`;
                  speakText(speechLabel);
                  onAnnounce(`[${selectedFloor}층 보행 가이드] 안내를 한국어 TTS 음성으로 발성 개시했습니다.`);
                }}
                className="w-full mt-4 bg-slate-900 border border-cyan-500/20 hover:border-cyan-500/50 text-[#00E5FF] font-black py-3 rounded-2xl text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
              >
                <Volume2 className="w-4 h-4" />
                <span>한국어 정밀 안심 동선 음성지도(TTS) 🔊</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
