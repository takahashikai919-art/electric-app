"use client";
import { useState } from "react";

export default function Home() {
  const [kwh, setKwh] = useState<number>(300);
  const [amp, setAmp] = useState<number>(30);
  const [career, setCareer] = useState<string>("no");
  const [card, setCard] = useState<string>("none");
  const [current, setCurrent] = useState<string>("北海道電力");

  const baseTable: Record<number, number> = {
    20: 759,
    30: 1138,
    40: 1518,
    50: 1897,
    60: 2277,
  };

  const base = baseTable[amp] ?? 1138;

  const calc = (k: number) => {
    if (k <= 120) return k * 35;
    if (k <= 300) return 120 * 35 + (k - 120) * 41;
    return 120 * 35 + 180 * 41 + (k - 300) * 45;
  };

  const hokkaido = base + calc(kwh);

  let basicRate = 0.02;
  let greenRate = 0.04;

  if (career === "docomo") {
    basicRate += 0.01;
    greenRate += 0.01;
  }

  if (card === "gold") greenRate += 0.01;
  if (card === "platinum") greenRate += 0.05;

  const basicPoint = hokkaido * basicRate;
  const greenPoint = (hokkaido + 500) * greenRate;

  const docomoBasic = hokkaido - basicPoint;
  const docomoGreen = hokkaido + 500 - greenPoint;

  const companies = [
    { name: "北海道電力", rate: 1.0 },
    { name: "北ガス電気", rate: 0.98 },
    { name: "コープでんき", rate: 0.97 }, // ←追加
    { name: "Looopでんき", rate: 0.95 },
    { name: "ENEOSでんき", rate: 0.98 },
    { name: "楽天でんき", rate: 1.0 },
    { name: "auでんき", rate: 0.98 },
    { name: "ソフトバンクでんき", rate: 0.99 },
    { name: "HTBエナジー", rate: 0.97 },
    { name: "シンエナジー", rate: 0.96 },
    { name: "ミツウロコでんき", rate: 0.98 },
    { name: "オクトパスエナジー", rate: 0.96 },
    { name: "CDエナジー", rate: 0.96 },
    { name: "エネワンでんき", rate: 0.97 },
    { name: "Japan電力", rate: 0.95 },
  ];

  const companyCosts = companies.map(c => ({
    name: c.name,
    cost: hokkaido * c.rate,
  }));

  const currentCompany = companyCosts.find(c => c.name === current);

  const diffBasic = currentCompany ? currentCompany.cost - docomoBasic : 0;
  const diffGreen = currentCompany ? currentCompany.cost - docomoGreen : 0;

  const yearlyBasic = diffBasic * 12;
  const yearlyGreen = diffGreen * 12;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-4">
          電気料金比較（北海道）
        </h1>

        <input
          type="number"
          value={kwh}
          onChange={(e) => setKwh(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded"
        />

        <select value={amp} onChange={(e) => setAmp(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded">
          <option value={20}>20A</option>
          <option value={30}>30A</option>
          <option value={40}>40A</option>
          <option value={50}>50A</option>
          <option value={60}>60A</option>
        </select>

        <select value={career} onChange={(e) => setCareer(e.target.value)}
          className="w-full border p-2 mb-2 rounded">
          <option value="no">ドコモ回線なし</option>
          <option value="docomo">ドコモ回線あり</option>
        </select>

        <select value={card} onChange={(e) => setCard(e.target.value)}
          className="w-full border p-2 mb-2 rounded">
          <option value="none">カードなし</option>
          <option value="regular">dカード</option>
          <option value="gold">dカードGOLD</option>
          <option value="platinum">PLATINUM</option>
        </select>

        <select value={current} onChange={(e) => setCurrent(e.target.value)}
          className="w-full border p-2 mb-4 rounded">
          {companies.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <div className="bg-red-100 p-4 rounded text-center font-bold mb-3">
          <p>現在：{currentCompany?.cost.toFixed(0)}円/月</p>

          <p className="mt-2 text-red-600 text-lg">
            👉 年間最大 {Math.max(yearlyBasic, yearlyGreen).toFixed(0)}円 お得になる可能性があります
          </p>

          <p className="mt-2">
            ドコモBasic：{docomoBasic.toFixed(0)}円  
            <br />
            （年間 {yearlyBasic.toFixed(0)}円差）
          </p>

          <p className="mt-2">
            ドコモGreen：{docomoGreen.toFixed(0)}円  
            <br />
            （年間 {yearlyGreen.toFixed(0)}円差）
          </p>
        </div>

        <p className="text-sm text-center text-gray-600">
          詳細はお気軽にご相談ください
        </p>

        <p className="text-xs text-gray-500 mt-3 text-center">
          ※燃料費調整額・再生可能エネルギー発電促進賦課金は計算に含まれていません
        </p>

      </div>
    </div>
  );
}