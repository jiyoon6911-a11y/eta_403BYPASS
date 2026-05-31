import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Users, 
  Check, 
  CalendarDays, 
  CheckCircle, 
  Glasses, 
  Clock, 
  BookmarkCheck, 
  CalendarPlus, 
  Trash2, 
  ChevronRight, 
  UserCheck, 
  Info, 
  Sparkles,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  Ticket,
  ArrowLeft
} from 'lucide-react';
import { Booking } from '../types';

interface VisibilityTabProps {
  bookings: Booking[];
  onAddBooking: (newB: Booking) => void;
  onCancelBooking: (id: string) => void;
  onAnnounce: (msg: string) => void;
  highContrast: boolean;
}

export default function VisibilityTab({
  bookings,
  onAddBooking,
  onCancelBooking,
  onAnnounce,
  highContrast,
}: VisibilityTabProps) {
  // Navigation SubView state: 'list' (메인 탭 홈), 'manager' (동행 매니저 전용 예약페이지), 'glass' (자막안경 대여 전용 예약페이지)
  const [subView, setSubView] = useState<'list' | 'manager' | 'glass'>('list');

  // Option fields
  const [opts, setOpts] = useState<string[]>(['휠체어 동행 지원']);
  const [customMsg, setCustomMsg] = useState('');

  // Scheduler controllers
  const [managerDate, setManagerDate] = useState('5월 24일');
  const [managerTime, setManagerTime] = useState('13:00');
  const [managerVenue, setManagerVenue] = useState('아르코예술극장 대극장');

  const [glassesDate, setGlassesDate] = useState('5월 24일');
  const [glassesTime, setGlassesTime] = useState('12:00');
  const [glassesVenue, setGlassesVenue] = useState('샤롯데씨어터');

  // Booking List Tab control
  const [activeBookingTab, setActiveBookingTab] = useState<'today' | 'upcoming' | 'past'>('upcoming');
  // Inner booking type filter for separating depths: all (전체), manager (에스코트 매니저), glass (수어/자막안경)
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'manager' | 'glass'>('all');

  // helper to toggle assistance options
  const toggleOpt = (name: string) => {
    if (opts.includes(name)) {
      setOpts(opts.filter((o) => o !== name));
      onAnnounce(`배려 옵션 [${name}]을 해제하셨습니다.`);
    } else {
      setOpts([...opts, name]);
      onAnnounce(`배려 옵션 [${name}]이 지정 보정되었습니다.`);
    }
  };

  const handleManagerBook = () => {
    const formattedNote = customMsg.trim() || '추가 특이 요망 사항 기입 없음';
    const finalDetail = opts.length > 0 ? opts.map(o => {
      if (o === '휠체어 동행 지원') return '♿ 휠체어 전용 동행';
      if (o === '시각 촉지 가이드') return '👁️ 시각 촉도 대체 해설';
      return '👂 청각 증폭 주파수 루프';
    }).join(', ') : '보편적 1:1 일대일 동행 보완';

    const newBooking: Booking = {
      id: 'manager_' + Date.now(),
      type: 'manager',
      date: managerDate,
      time: managerTime,
      detail: `📍 [${managerVenue}] 1:1 동행 - ${finalDetail}`,
      note: formattedNote,
    };

    onAddBooking(newBooking);
    setCustomMsg('');
    setSubView('list');
    alert(`🎉 접근성 매니저 사전 예약이 완료되었습니다!\n\n• 희망 극장: [${managerVenue}]\n• 예약 일시: ${managerDate} ${managerTime}\n• 지원 유형: ${finalDetail}\n\n※ 매칭이 완료된 담당 접근성 매니저가 연락처로 개별 연락을 드릴 예정입니다. 공연 시작 최소 30분 전 원하시는 미팅 포인트에서 동행 지원이 정식 시작됩니다.`);
    onAnnounce(`접근성 1:1 보행 동행 매니저 예약 성공: [${managerVenue}] - ${managerDate} ${managerTime}`);
  };

  const handleGlassesBook = () => {
    const newBooking: Booking = {
      id: 'glass_' + Date.now(),
      type: 'glass',
      date: glassesDate,
      time: glassesTime,
      detail: `🕶️ [${glassesVenue}] AR 무대 한글 해설 스마트 자막 안경 대여`,
      note: `공연장 입장 40분 전 수령 카운터 배리어프리 전용 데스크 본인 수령`,
    };

    onAddBooking(newBooking);
    setSubView('list');
    alert(`🎉 스마트 자막 안경 대여 예약이 완료되었습니다!\n\n수령지: [${glassesVenue}]\n일시: ${glassesDate} ${glassesTime}\n수령 카운터: 1층 배리어프리 임대 데스크\n\n※ 매칭 및 예약이 안심 접수되었습니다.`);
    onAnnounce(`스마트 자막 안경 현장 대여 예약 완료: ${glassesVenue} - ${glassesDate} ${glassesTime}`);
  };

  // Helper to calculate D-Day relative to May 23, 2026
  const getBookingDDayInfo = (dateStr: string) => {
    const match = dateStr.match(/(\d+)월\s*(\d+)일/);
    if (!match) {
      return { 
        dDayText: '기한 미정', 
        category: 'upcoming' as const, 
        labelClass: 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/25 px-1.5 py-0.5 rounded' 
      };
    }
    
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const refMonth = 5;
    const refDay = 23;
    
    let diff = 0;
    if (month === refMonth) {
      diff = day - refDay;
    } else if (month < refMonth) {
      diff = -99;
    } else {
      diff = 99;
    }

    if (diff === 0) {
      return {
        dDayText: 'TODAY 오늘',
        category: 'today' as const,
        labelClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
      };
    } else if (diff < 0) {
      return {
        dDayText: '이용완료 (종료)',
        category: 'past' as const,
        labelClass: 'bg-slate-800 text-slate-500 border border-slate-700/50'
      };
    } else {
      return {
        dDayText: `D-${diff} 예정`,
        category: 'upcoming' as const,
        labelClass: 'bg-blue-500/15 text-cyan-400 border border-blue-500/25'
      };
    }
  };

  // Inject 3 distinct mock bookings so user can instantly test Tab splits
  const injectDemoDataset = () => {
    const uniqueSuffix = () => Math.random().toString(36).substring(2, 8);
    const testItems: Booking[] = [
      {
        id: `test_demo_past_${uniqueSuffix()}`,
        type: 'manager',
        date: '5월 20일',
        time: '14:00',
        detail: '♿ 1:1 휠체어 리프트 대중교통 승하차 연계 가사 전정 에스코트',
        note: '대학로예술극장 매칭 시뮬레이션 완수'
      },
      {
        id: `test_demo_today_${uniqueSuffix()}`,
        type: 'glass',
        date: '5월 23일',
        time: '18:30',
        detail: '🕶️ [샤롯데씨어터] 오페라의 유령 AR 글래스 자막 대여',
        note: '공연 45분 전 현장 로비 웰컴 에스코트 부스 본인 수령'
      },
      {
        id: `test_demo_upcoming_${uniqueSuffix()}`,
        type: 'manager',
        date: '5월 25일',
        time: '17:00',
        detail: '♿ 보편적 1:1 일대일 동행 보완 사전 매칭',
        note: '혜화역 4번출구 안심 동행 서비스 예정'
      }
    ];
    testItems.forEach(b => onAddBooking(b));
    onAnnounce('테스트용 배리어프리 예약 데이터셋 3건이 실시간 탑재되었습니다.');
  };

  // Categorize standard bookings
  const categorizedBookings = {
    today: bookings.filter(b => getBookingDDayInfo(b.date).category === 'today'),
    upcoming: bookings.filter(b => getBookingDDayInfo(b.date).category === 'upcoming'),
    past: bookings.filter(b => getBookingDDayInfo(b.date).category === 'past')
  };

  const activeTabItems = categorizedBookings[activeBookingTab];

  // Helper function to render a single booking card cleanly
  const renderBookingCard = (b: Booking, idx: number) => {
    const dday = getBookingDDayInfo(b.date);
    const isManager = b.type === 'manager';
    const typeLabel = isManager ? '동행 매니저 1:1 안심매칭' : 'AR 자막안경 스마트 대여';
    
    // Color schemes depending on type
    const cardBorder = isManager 
      ? 'border-blue-600/30 bg-blue-950/[0.04]' 
      : 'border-cyan-600/30 bg-cyan-950/[0.03]';

    const iconBg = isManager
      ? 'bg-blue-600/10 text-blue-400'
      : 'bg-cyan-600/10 text-cyan-400';

    return (
      <div
        key={`${b.id}_${b.type}_${idx}`}
        className={`border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow transition-all hover:border-slate-700/85 ${cardBorder}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className={`p-2 rounded-xl shrink-0 mt-0.5 ${iconBg}`}>
              {isManager ? (
                <Users className="w-4 h-4" />
              ) : (
                <Glasses className="w-4 h-4" />
              )}
            </span>
            
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wide ${dday.labelClass}`}>
                  {dday.dDayText}
                </span>
                <span className="text-[11.5px] font-black text-slate-100">{typeLabel}</span>
              </div>
              
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-300">{b.detail}</p>
                <p className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>상세일정:</span>
                  <strong className="text-slate-200">{b.date} {b.time}</strong>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onCancelBooking(b.id);
              onAnnounce(`${typeLabel} 스케줄 예약을 정지 해지 조치했습니다.`);
            }}
            className="text-[10.5px] text-rose-400 hover:text-rose-350 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 active:scale-95 px-3 py-1.5 rounded-xl transition-all font-black whitespace-nowrap shrink-0 hc-button-secondary cursor-pointer"
          >
            예약 취소
          </button>
        </div>

        {/* Escort Guidelines subtext bar */}
        <div className="p-2.5 bg-slate-950/90 rounded-xl border border-slate-900 flex justify-between items-center text-[10px] gap-2">
          <span className="text-zinc-500 font-bold whitespace-nowrap flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            전달 안심 지침:
          </span>
          <span className="text-zinc-300 truncate max-w-[210px] font-semibold text-right flex-1">{b.note}</span>
        </div>
      </div>
    );
  };

  // Listed theaters for beautiful custom selector grid instead of plain dropdown
  const customTheaters = [
    { name: '샤롯데씨어터', icon: '🎭', tags: ['VR 연동 극장', '자막안경 연동'], count: '14대 여유', location: '잠실역 도보 5분' },
    { name: '아르코예술극장 대극장', icon: '🏛️', tags: ['대학로 거점', '수어안내 지원'], count: '8대 대여가능', location: '혜화역 2번출구' },
    { name: '대학로예술극장 소극장', icon: '🎪', tags: ['배리어프리 전용', '휠체어 접근'], count: '5대 보유', location: '혜화역 마로니에' },
    { name: '국립극장 해오름극장', icon: '🏛️', tags: ['남산 숲속', '화면 해설 동반'], count: '12대 확보', location: 'DDP 동전 셔틀' }
  ];

  return (
    <div className="space-y-6">
      {/* Header breadcrumb for SubViews */}
      {subView !== 'list' && (
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800 text-left">
          <button
            onClick={() => {
              setSubView('list');
              onAnnounce("예매 및 대여 예약 통합 안내 메인 화면으로 돌아왔습니다.");
            }}
            className="p-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>돌아오기</span>
          </button>
          <span className="text-xs text-slate-400 font-mono tracking-wider font-extrabold uppercase">
            {subView === 'manager' ? 'Accessibility Manager Reservation' : 'AI Caption Glasses Reservation'}
          </span>
        </div>
      )}

      {subView === 'list' && (
        /* ================= STEP 1: TEASER / LIST VIEW ================= */
        <div className="space-y-5">
          {/* Main Informational Header Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border border-cyan-500/10 text-left space-y-1">
            <span className="text-[9px] bg-[#00E5FF]/20 text-[#00E5FF] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Safety & Access System
            </span>
            <h2 className="text-sm font-black text-white">동행 및 자막 보조 통합 예약 시스템</h2>
            <p className="text-xs text-slate-400 leading-normal font-semibold">
              이동 장벽과 무대 정보 격차를 완전히 무장착 해제합니다. 원하는 보행 전담 매니저 에스코트 동행이나 현장 자막 수신기(스마트 글래스) 전용 예약을 체험해 보실 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-left">
            {/* Card 1 Teaser - Manager */}
            <div 
              onClick={() => {
                setSubView('manager');
                onAnnounce("접근성 동행 매니저 전용 사전 예약 작성 양식 페이지로 복제 연동합니다.");
              }}
              className="hc-card w-full rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 flex flex-col gap-3.5 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] cursor-pointer group"
            >
              {/* Line 1: Badge + Meta Text */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded font-black text-[9px] md:text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  1:1 동행
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight truncate">
                  지하철 접선 ➔ 극장 내부 안심 인도
                </span>
              </div>

              {/* Line 2: Title & Brief Description */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-100 group-hover:text-blue-400 transition-colors leading-tight">
                    접근성 1:1 보행 안심 매니저 예약
                  </h3>
                </div>
                <p className="text-[10.5px] sm:text-[11.5px] text-slate-400 leading-relaxed font-semibold">
                  지하철 개찰구 접선부터 극장 좌석 안착까지 보행 단차 극복 및 휠체어 리프트 안전 이동을 밀착 가이드합니다.
                </p>
              </div>

              {/* Line 3: Mini outline tags + styled mint-colored button inside card */}
              <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-850">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[9px] font-bold flex items-center gap-1">
                    <span>♿</span> 휠체어동행
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[9px] font-bold flex items-center gap-1">
                    <span>👁️</span> 시각가이드
                  </span>
                </div>

                <div className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00D4EC] text-slate-950 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 select-none group-hover:scale-[1.03]">
                  <span>예약하러 가기</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
              </div>
            </div>

            {/* Card 2 Teaser - Smart Glasses */}
            <div 
              onClick={() => {
                setSubView('glass');
                onAnnounce("스마트 자막 안경 현장 대여 신청 전용 스케줄러 영역으로 이동했습니다.");
              }}
              className="hc-card w-full rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 flex flex-col gap-3.5 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] cursor-pointer group"
            >
              {/* Line 1: Badge + Meta Text */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded font-black text-[9px] md:text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  스마트 기기
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight truncate">
                  로비 현장 대여 ➔ 입체 다국어 전석 씽크
                </span>
              </div>

              {/* Line 2: Title & Brief Description */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Glasses className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
                    AI 수어•무대 폐쇄 자막 스마트 안경 현장 대여
                  </h3>
                </div>
                <p className="text-[10.5px] sm:text-[11.5px] text-slate-400 leading-relaxed font-semibold">
                  투명 스마트 안경 디바이스를 통해 실시간 한글 폐쇄형 자막과 수어 해설 통역을 눈앞에 오버레이 배치합니다.
                </p>
              </div>

              {/* Line 3: Mini outline tags + styled mint-colored button inside card */}
              <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-850">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[9px] font-bold flex items-center gap-1">
                    <span>📝</span> 스크린자막
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[9px] font-bold flex items-center gap-1">
                    <span>🕶️</span> VR연동형
                  </span>
                </div>

                <div className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00D4EC] text-slate-950 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 select-none group-hover:scale-[1.03]">
                  <span>대여하러 가기</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subView === 'manager' && (
        /* ================= STEP 2: MANAGER BOOKING DETAIL FORM ================= */
        <div className="hc-card rounded-2xl bg-slate-900 border-2 border-blue-500/30 p-5 space-y-5 text-left shadow-lg animate-fadeIn">
          <div className="space-y-1 pb-2 border-b border-slate-850">
            <span className="text-[9px] bg-blue-500/15 text-cyan-400 border border-blue-500/25 px-2.5 py-0.5 rounded font-black tracking-wider uppercase hc-badge inline-block">
              STEP BY STEP BOOKING
            </span>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 pt-0.5">
              <Users className="w-4 h-4 text-blue-400" />
              접근성 매니저 사전 예약서 작성
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              각 극장 내 단차 보완, 지하철 접선부터 세부 요구 사항들을 차별 없이 배정 지원합니다.
            </p>
          </div>

          {/* Support Option Boxes Grid - MORE VISUAL */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest hc-text">
              지원 선택 (중복 터치 선택 가능)
            </label>

            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
              {[
                { id: '휠체어 동행 지원', emoji: '♿', short: '휠체어 하차 동행', long: '지하철 안전 승하차 및 기중 리프트 보행 유닛 매칭' },
                { id: '시각 촉지 가이드', emoji: '👁️', short: '시각 음성가이드', long: '음향 수신기 가설 점자 및 터치형 촉지 가이드 시사' },
                { id: '음향 증폭 루프', emoji: '👂', short: '청각 배리어프리', long: '극장 주파수 자기 보정 자석형 수신 디바이스 링크' },
              ].map((item) => {
                const isSelected = opts.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleOpt(item.id)}
                    className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/10 shadow-[0_4px_12px_rgba(37,99,235,0.15)]'
                        : 'border-slate-800 bg-slate-950/80 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{item.emoji}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-500' : 'border-slate-800 bg-slate-900'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                      </div>
                    </div>
                    <div className="text-left space-y-0.5">
                      <p className={`text-[10px] font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {item.short}
                      </p>
                      <p className="text-[8px] text-zinc-500 leading-tight">
                        {item.long}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theater selection for accessibility manager */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest hc-text">
              📍 1단계 : 동행을 접선할 희망 외부 극장 터치 선택
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {customTheaters.map((th) => {
                const isSelected = managerVenue === th.name;
                return (
                  <div
                    key={`manager_venue_${th.name}`}
                    onClick={() => {
                      setManagerVenue(th.name);
                      onAnnounce(`동행 및 접선 극장이 [${th.name}]으로 변경 협의되었습니다.`);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/10 shadow-[0_4px_12px_rgba(37,99,235,0.15)]'
                        : 'border-slate-800 bg-slate-950/80 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{th.icon}</span>
                      <div className="text-left space-y-0.5">
                        <p className={`text-[10.5px] font-black ${isSelected ? 'text-white' : 'text-slate-350'}`}>
                          {th.name}
                        </p>
                        <p className="text-[8px] text-zinc-500 font-semibold leading-none">
                          {th.location}
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 border-blue-500' : 'border-slate-800 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input box */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-black uppercase text-slate-400 tracking-wider block hc-text">
              ✍️ 2단계 : 매니저에게 전달될 필수 안심 요청 기재
            </label>
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="예: 전동 휠체어 전폭이 넓으며 혜화역 4번 엘리베이터 앞 미팅 가설 원함"
              className="w-full text-xs bg-slate-950 text-white rounded-xl border border-slate-800 px-3 py-2.5 focus:border-blue-500 focus:outline-none hc-card"
            />
          </div>

          {/* Scheduler block inline calendar display strictly following request */}
          <div className="border border-slate-850 bg-slate-955 p-3.5 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-white flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-blue-400" />
                3단계 : 동행 매니저 예약 일자 및 시간 지정
              </h4>
              <span className="text-[8px] bg-red-400/10 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded font-bold uppercase hc-badge">
                실시간 선착순 매칭
              </span>
            </div>

            {/* Calendar */}
            <div className="space-y-1.5 text-center">
              <span className="text-[9px] text-slate-400 font-black block text-left">방문 일자 조율하기 (5월)</span>
              <div className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-center">
                <div className="grid grid-cols-7 text-[8px] font-black text-slate-500 pb-1 border-b border-slate-900">
                  <div className="text-rose-500">일</div>
                  <div>월</div>
                  <div>화</div>
                  <div>수</div>
                  <div>목</div>
                  <div>금</div>
                  <div className="text-blue-500">토</div>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-1 text-[10px] font-bold">
                  <div className="h-6" /> <div className="h-6" /> <div className="h-6" /> <div className="h-6" /> <div className="h-6" />
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => {
                    const dString = `5월 ${day}일`;
                    const isSelected = managerDate === dString;
                    const textClass = (day === 3 || day === 10 || day === 17 || day === 24 || day === 31)
                      ? 'text-rose-500'
                      : (day === 2 || day === 9 || day === 16 || day === 23 || day === 30)
                      ? 'text-blue-400'
                      : 'text-slate-300';

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setManagerDate(dString);
                          onAnnounce(`매니저 동행일이 수동 변경 조정되었습니다: ${dString}`);
                        }}
                        className={`h-6 rounded-lg text-center transition-all flex items-center justify-center border text-[9px] ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600 text-white font-black shadow-sm'
                            : `border-slate-900 bg-slate-950 ${textClass} hover:bg-slate-800`
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time selection */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-400 font-black block text-left">시간 선택</span>
              <div className="grid grid-cols-2 gap-2">
                {['12:00', '14:30', '17:00', '18:00'].map((time) => {
                  const isSelected = managerTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setManagerTime(time)}
                      className={`p-2 rounded-xl text-left border text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {time}
                      <span className="float-right text-[8px] px-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-sans">
                        {isSelected ? '선택됨' : '예약가능'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleManagerBook}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>[{managerVenue}] {managerDate} {managerTime} 매니저 예약 수립 완료</span>
            </button>
          </div>
        </div>
      )}

      {subView === 'glass' && (
        /* ================= STEP 3: GLASSES BOOKING DETAIL FORM ================= */
        <div className="hc-card rounded-2xl bg-slate-900 border-2 border-cyan-500/30 p-5 space-y-5 text-left shadow-lg animate-fadeIn">
          <div className="space-y-1 pb-2 border-b border-slate-850">
            <span className="text-[9px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 px-2.5 py-0.5 rounded font-black tracking-wider uppercase hc-badge inline-block">
              HARDWARE RENTAL SCHEDULER
            </span>
            <span className="flex items-center gap-1.5 text-sm font-black text-slate-100 pt-0.5">
              <Glasses className="w-4 h-4 text-cyan-400" />
              AI 무대 자막안경 임대 신청서 작성
            </span>
            <p className="text-xs text-slate-400 font-medium">
              각 공연 인프라와 완벽 연계되어, 글래스를 착용한 채로 한글 문자 및 폐쇄 자막 안내를 보조받습니다.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10.5px] font-black uppercase text-cyan-400 tracking-wider block hc-text font-sans">
              📍 1단계 : 자막안경을 수령할 파트너십 극장 선택
            </label>
            
            <div className="space-y-2">
              {customTheaters.map((th) => {
                const isSelected = glassesVenue === th.name;
                return (
                  <div
                    key={th.name}
                    onClick={() => {
                      setGlassesVenue(th.name);
                      onAnnounce(`안경 대여 수령장소를 ${th.name}로 지정 조정했습니다.`);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/20 border-cyan-500 shadow-[0_2px_8px_rgba(6,182,212,0.12)]'
                        : 'bg-slate-955 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{th.icon}</span>
                      <div className="text-left">
                        <p className={`text-[11.5px] font-black ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                          {th.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 font-semibold leading-relaxed">
                          {th.location} • {th.tags.map(t => `#${t}`).join(' ')}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`text-[8.5px] font-black px-2 py-0.5 rounded shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-cyan-400/80 font-mono'
                    }`}>
                      {th.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-[10.5px] font-black uppercase text-cyan-400 tracking-wider block hc-text font-sans">
              📅 2단계 : 수령 희망 날짜 및 시간 확정
            </label>

            <div className="border border-slate-850 bg-slate-955 p-4 rounded-2xl space-y-4">
              {/* Calendar list */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-350 font-black block text-left">날짜 선택 (5월)</span>
                <div className="bg-slate-955 border border-slate-900 p-2 rounded-xl text-center">
                  <div className="grid grid-cols-7 text-[8px] font-black text-slate-500 pb-1 border-b border-slate-900">
                    <div className="text-rose-500">일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div className="text-blue-500">토</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-1 text-[10px] font-bold">
                    <div className="h-6" /> <div className="h-6" /> <div className="h-6" /> <div className="h-6" /> <div className="h-6" />
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => {
                      const dString = `5월 ${day}일`;
                      const isSelected = glassesDate === dString;
                      const textClass = (day === 3 || day === 10 || day === 17 || day === 24 || day === 31)
                        ? 'text-rose-500'
                        : (day === 2 || day === 9 || day === 16 || day === 23 || day === 30)
                        ? 'text-blue-400'
                        : 'text-slate-300';

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setGlassesDate(dString);
                            onAnnounce(`안경 대여 희망날짜 변경: ${dString}`);
                          }}
                          className={`h-6 rounded-lg text-center transition-all flex items-center justify-center border text-[9px] ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-600 text-white font-black shadow-sm'
                              : `border-slate-900 bg-slate-950 ${textClass} hover:bg-slate-800`
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time selection */}
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] text-zinc-350 font-black block text-left">수령 가능 예정 시간 (극장 입장 40분 전 수령 권장)</span>
                <div className="grid grid-cols-2 gap-2">
                  {['12:00', '14:30', '17:00', '19:30'].map((time) => {
                    const isSelected = glassesTime === time;
                    const isLocked = time === '19:30';

                    return (
                      <button
                        key={time}
                        disabled={isLocked}
                        type="button"
                        onClick={() => setGlassesTime(time)}
                        className={`p-2 rounded-xl text-left border text-xs font-mono font-bold transition-all ${
                          isLocked
                            ? 'bg-slate-920 border-slate-900 text-slate-500 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-cyan-600 border-cyan-500 text-white font-black'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {time}
                        {isLocked ? (
                          <span className="float-right text-[8px] px-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-sans">대여마감</span>
                        ) : (
                          <span className="float-right text-[8px] px-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-sans">
                            {isSelected ? '선택됨' : '대여가능'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGlassesBook}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>자막안경 대여 예약 확정하기 (선택됨: {glassesDate} {glassesTime})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CATEGORIZED RESERVATIONS WITH TABS & D-DAY IDENTIFIERS - PERSISTED ON THE MAIN PAGE */}
      {subView === 'list' && (
        <div className="hc-card realtime-status-container rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500/15 p-5 space-y-4 text-left shadow-xl shadow-slate-950/40">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-850">
            <div className="space-y-0.5">
              <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded font-black tracking-wider uppercase hc-badge inline-block">
                REAL-TIME STATUS MANAGEMENT
              </span>
              <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5 pt-0.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                나의 실시간 예매/대여 예약 완료 현황
              </h3>
            </div>

            {/* Quick Demo Dataset Injector Button - EXTREMELY USEFUL */}
            <button
              onClick={injectDemoDataset}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              📊 테스트용 예약 자동 가설
            </button>
          </div>

          {/* Categories Depth selection tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
            {[
              { id: 'today', label: '오늘 예약', count: categorizedBookings.today.length },
              { id: 'upcoming', label: '곧 다가올 예약', count: categorizedBookings.upcoming.length },
              { id: 'past', label: '완료 및 지난 예약', count: categorizedBookings.past.length },
            ].map((tab) => {
              const isTabActive = activeBookingTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveBookingTab(tab.id as any);
                    onAnnounce(`${tab.label} 조회를 탭 정제하였습니다. 등록 건수 ${tab.count}건입니다.`);
                  }}
                  className={`py-2 rounded-lg text-center font-bold text-[10.5px] transition-all flex items-center justify-center gap-1.5 ${
                    isTabActive
                      ? 'bg-slate-800 text-[#00E5FF] border border-[#00E5FF]/20 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-black ${
                    isTabActive ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Type classification depths / helper tabs requested by user */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-850/80">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>분류 필터:</span>
            </div>
            <div className="flex gap-1">
              {[
                { id: 'all', label: '전체 형태', count: activeTabItems.length },
                { id: 'manager', label: '♿ 매니저 사전예약', count: activeTabItems.filter(b => b.type === 'manager').length },
                { id: 'glass', label: '🕶️ 안경 대여신청', count: activeTabItems.filter(b => b.type === 'glass').length },
              ].map((subFilter) => {
                const isSubActive = activeTypeFilter === subFilter.id;
                return (
                  <button
                    key={subFilter.id}
                    onClick={() => {
                      setActiveTypeFilter(subFilter.id as any);
                      onAnnounce(`예약 종류를 ${subFilter.label}로 정렬 필터링 하였습니다.`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[9.5px] font-extrabold transition-all flex items-center gap-1 ${
                      isSubActive
                        ? subFilter.id === 'manager'
                          ? 'bg-blue-600 text-white'
                          : subFilter.id === 'glass'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-850 text-[#00E5FF] border border-[#00E5FF]/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{subFilter.label}</span>
                    <span className={`px-1 text-[8px] rounded-full font-black ${
                      isSubActive ? 'bg-black/20 text-white' : 'bg-slate-950 text-slate-500'
                    }`}>
                      {subFilter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Ticket / Reservation cards under currently expanded tab split by depth category */}
          <div className="space-y-5 pt-1">
            {activeTabItems.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-2.5">
                <CalendarPlus className="w-9 h-9 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-400 font-black hc-text">
                  이 구역에 등록된 매칭/임대 예약 건이 비어 있습니다.
                </p>
                
                {activeBookingTab === 'upcoming' && (
                  <p className="text-[10px] text-zinc-500 leading-normal font-medium max-w-xs mx-auto">
                    상단의 에스코트 지원 및 하단 AR 수령지 극장을 조합 지정하시면 실시간 스케줄이 다가올 예약으로 가설 등록됩니다.
                  </p>
                )}
                {activeBookingTab === 'today' && (
                  <p className="text-[10px] text-zinc-500 leading-normal font-medium max-w-xs mx-auto">
                    5월 23일 (오늘자) 예약 건이 존재하지 않습니다. 우측 상단의 "📊 테스트용 예약 자동 가설" 버튼을 눌러보시면 바로 활성화 기입됩니다.
                  </p>
                )}
                {activeBookingTab === 'past' && (
                  <p className="text-[10px] text-zinc-500 leading-normal font-medium max-w-xs mx-auto">
                    과거 정상 수료하거나 사용 완료 처리된 서포트 로그 대장이 존재하지 않습니다.
                  </p>
                )}
              </div>
            ) : (
              (() => {
                const filteredItems = activeTypeFilter === 'all' 
                  ? activeTabItems 
                  : activeTabItems.filter(b => b.type === activeTypeFilter);

                const managerItems = filteredItems.filter(b => b.type === 'manager');
                const glassItems = filteredItems.filter(b => b.type === 'glass');

                if (filteredItems.length === 0) {
                  return (
                    <p className="text-center text-[10px] text-zinc-500 py-4 font-bold">
                      해당 세부 필터 조건(매니저/안경) 만족 완료된 예약이 현재 탭에 존재하지 않습니다.
                    </p>
                  );
                }

                return (
                  <div className="space-y-4">
                    {/* DEPTH A: Accessibility Manager Group */}
                    {managerItems.length > 0 && (
                      <div className="space-y-2 p-1 border border-blue-500/10 bg-blue-950/[0.01] rounded-2xl">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-950/20 rounded-xl border border-blue-500/10">
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <h4 className="text-[11px] font-black text-blue-400">
                            접근성 매니저 사전 예약 ({managerItems.length}건)
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {managerItems.map((b, idx) => renderBookingCard(b, idx))}
                        </div>
                      </div>
                    )}

                    {/* DEPTH B: AI Glasses Rental Group */}
                    {glassItems.length > 0 && (
                      <div className="space-y-2 p-1 border border-cyan-500/10 bg-cyan-950/[0.01] rounded-2xl">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/20 rounded-xl border border-cyan-500/10">
                          <Glasses className="w-3.5 h-3.5 text-cyan-400" />
                          <h4 className="text-[11px] font-black text-cyan-400">
                            AI 수어·자막 안경 현장 대여 신청 ({glassItems.length}건)
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {glassItems.map((b, idx) => renderBookingCard(b, idx))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
