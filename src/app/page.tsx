import React from 'react';
import { ShieldAlert, Zap, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-5xl bg-white border border-slate-300 p-8 md:p-12 shadow-sm">

        {/* 상단 2단 레이아웃 */}
        <div className="flex flex-col md:flex-row gap-12">

          {/* 좌측: 텍스트 및 사양 */}
          <div className="md:w-1/2 flex flex-col justify-start">

            {/* 제품군 */}
            <div className="border border-slate-800 px-4 py-1.5 inline-block text-xs font-bold text-slate-800 uppercase tracking-widest self-start mb-6">
              Molded Case Circuit Breaker
            </div>

            {/* 시리즈명 */}
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 border-b-2 border-slate-900 pb-4 tracking-tight">
              UL Smart MCCB
            </h1>

            {/* 제품 설명 */}
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
              UL Smart MCCB is a UL-certified molded case circuit breaker that provides reliable power protection along with real-time monitoring and data analytics, enabling efficient energy management and smarter facility operation.
            </p>

            {/* 픽토그램 */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 border border-slate-300 bg-slate-50 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                <ShieldAlert className="w-4 h-4 text-blue-900" /> 대표 픽토그램
              </div>
              <div className="flex items-center gap-2 border border-slate-300 bg-slate-50 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                <Activity className="w-4 h-4 text-blue-900" /> 대표 픽토그램
              </div>
              <div className="flex items-center gap-2 border border-slate-300 bg-slate-50 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                <Zap className="w-4 h-4 text-blue-900" /> 대표 픽토그램
              </div>
            </div>
          </div>

          {/* 우측: 대표 이미지 */}
          <div className="md:w-1/2 flex flex-col">
            <div className="w-full h-full min-h-[300px] border border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 font-medium">
              <p>제품 대표 이미지</p>
              <p className="text-sm">Or 라인업</p>
            </div>
          </div>
        </div>

        {/* 하단 사양 및 특징 */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col gap-8">

          {/* 제품 핵심 키워드 */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest pl-3 border-l-4 border-blue-900 mb-6">
              제품 핵심 키워드
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-slate-300 bg-slate-50 py-6 flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 font-semibold mb-1">Voltage Class</span>
                  <span className="text-base font-bold text-slate-900">Up to 27kV</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-4">
            <div className="border border-slate-800 px-4 py-1.5 inline-block text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 bg-slate-50">
              Features
            </div>
            <ul className="text-sm text-slate-700 space-y-2.5 list-none pl-1">
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-black mt-0.5">•</span>
                Up to 800kV and 1,500MVA
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-black mt-0.5">•</span>
                발전용(Generator Step-up) 변압기(신재생 및 원자력)
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-black mt-0.5">•</span>
                송전용(Transmission network) 변압기
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-black mt-0.5">•</span>
                배전용(Distribution) 중소형 변압기
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
