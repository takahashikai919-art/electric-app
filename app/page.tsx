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
    { name: "北海道電力", cost: hokkaido },
    { name: "Looopでんき", cost: hokkaido * 0.95 },
    { name: "ENEOSでんき", cost: hokkaido * 0.98 },
    { name: "楽天でんき", cost: hokkaido },
    { name: "auでんき", cost: hokkaido * 0.98 },
    { name: "ソフトバンクでんき", cost: hokkaido * 0.99 },
    { name: "HTBエナジー", cost: hokkaido * 0.97 },
    { name: "シンエナジー", cost: hokkaido * 0.96 },
    { name: "ミツウロコでんき", cost: hokkaido * 0.98 },
    { name: "イーレックス", cost: hokkaido * 0.97 },
    { name: "オクトパスエナジー", cost: hokkaido * 0.96 },
    { name: "CDエナジー", cost: hokkaido * 0.96 },
    { name: "エネワンでんき", cost: hokkaido * 0.97 },
    { name: "Japan電力", cost: hokkaido * 0.95 },
  ];

  const currentCompany = companies.find(c => c.name === current);

  const diffBasic = currentCompany
    ? currentCompany.cost - docomoBasic
    : 0;

  const diffGreen = currentCompany
    ? currentCompany.cost - docomoGreen
    : 0;

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
          placeholder="使用量 kWh"
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

        {/* 現在の電力会社 */}
        <select value={current} onChange={(e) => setCurrent(e.target.value)}
          className="w-full border p-2 mb-4 rounded">
          {companies.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* 比較結果 */}
        <div className="bg-yellow-100 p-3 rounded mb-3 text-center font-bold">
          <p>現在：{currentCompany?.cost.toFixed(0)}円</p>

          <p className="mt-2">
            ドコモ Basic：{docomoBasic.toFixed(0)}円  
            <br />
            👉 {diffBasic > 0 ? `${diffBasic.toFixed(0)}円お得` : "ほぼ同じ"}
          </p>

          <p className="mt-2">
            ドコモ Green：{docomoGreen.toFixed(0)}円  
            <br />
            👉 {diffGreen > 0 ? `${diffGreen.toFixed(0)}円お得` : "ほぼ同じ"}
          </p>
        </div>

      </div>
    </div>
  );
}