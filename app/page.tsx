"use client";
import { useState } from "react";

export default function Home() {
  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [career, setCareer] = useState("no");
  const [card, setCard] = useState("none");

  // 基本料金（北海道電力）※ ← 修正済み（any削除）
  const baseTable = {
    20: 759,
    30: 1138,
    40: 1518,
    50: 1897,
    60: 2277,
  };

  const base = baseTable[amp] || 1138;

  // 従量料金
  const tier1 = 35;
  const tier2 = 41;
  const tier3 = 45;

  const calc = (k: number) => {
    if (k <= 120) return k * tier1;
    if (k <= 300) return 120 * tier1 + (k - 120) * tier2;
    return 120 * tier1 + 180 * tier2 + (k - 300) * tier3;
  };

  const hokkaido = base + calc(kwh);

  // 還元率
  let basicRate = 0.02;
  let greenRate = 0.04;

  if (career === "docomo") {
    basicRate += 0.01;
    greenRate += 0.01;
  }

  if (card === "gold") greenRate += 0.01;
  if (card === "platinum") greenRate += 0.05;

  // ポイント
  const basicPoint = hokkaido * basicRate;
  const greenPoint = (hokkaido + 500) * greenRate;

  // 実質料金
  const docomoBasic = hokkaido - basicPoint;
  const docomoGreen = hokkaido + 500 - greenPoint;

  // 他社
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
    { name: "エルピオでんき", cost: hokkaido * 0.97 },
    { name: "まちエネ", cost: hokkaido * 0.99 },
    { name: "オクトパスエナジー", cost: hokkaido * 0.96 },
    { name: "コスモでんき", cost: hokkaido * 0.98 },
    { name: "J:COMでんき", cost: hokkaido * 0.99 },
    { name: "東京ガス電気", cost: hokkaido * 0.97 },
    { name: "CDエナジー", cost: hokkaido * 0.96 },
    { name: "idemitsuでんき", cost: hokkaido * 0.98 },
    { name: "親指でんき", cost: hokkaido * 0.95 },
    { name: "あしたでんき", cost: hokkaido * 0.97 },
    { name: "ピタでん", cost: hokkaido * 0.96 },
    { name: "自然電力", cost: hokkaido * 1.02 },
    { name: "リミックスでんき", cost: hokkaido * 0.95 },
    { name: "エネワンでんき", cost: hokkaido * 0.97 },
    { name: "グランデータ", cost: hokkaido * 0.96 },
    { name: "ハルエネでんき", cost: hokkaido * 0.98 },
    { name: "新日本エネルギー", cost: hokkaido * 0.97 },
    { name: "エバーグリーン", cost: hokkaido * 0.96 },
    { name: "Japan電力", cost: hokkaido * 0.95 },
  ];

  const all = [
    ...companies,
    { name: "ドコモでんき Basic", cost: docomoBasic },
    { name: "ドコモでんき Green", cost: docomoGreen },
  ];

  const sorted = [...all].sort((a, b) => a.cost - b.cost);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-4">
          電気料金比較（北海道）
        </h1>

        {/* 入力 */}
        <input
          type="number"
          value={kwh}
          onChange={(e) => setKwh(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded"
        />

        <select
          value={amp}
          onChange={(e) => setAmp(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="20">20A</option>
          <option value="30">30A</option>
          <option value="40">40A</option>
          <option value="50">50A</option>
          <option value="60">60A</option>
        </select>

        <select
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="no">ドコモ回線なし</option>
          <option value="docomo">ドコモ回線あり</option>
        </select>

        <select
          value={card}
          onChange={(e) => setCard(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="none">カードなし</option>
          <option value="regular">dカード</option>
          <option value="gold">dカードGOLD</option>
          <option value="platinum">PLATINUM</option>
        </select>

        {/* ドコモ固定 */}
        <div className="bg-yellow-50 p-3 rounded mb-3">
          <h2 className="font-bold text-center mb-2">
            おすすめ（ドコモでんき）
          </h2>

          {["ドコモでんき Basic", "ドコモでんき Green"].map((name) => {
            const target = all.find(c => c.name === name);
            if (!target) return null;

            const rank =
              [...all].sort((a, b) => a.cost - b.cost)
              .findIndex(x => x.name === name) + 1;

            return (
              <div key={name} className="flex justify-between bg-yellow-200 font-bold p-2 rounded mb-2">
                <span>
                  {name}（{rank}位）
                  {rank === 1 && " ←最安！"}
                </span>
                <span>{target.cost.toFixed(0)}円</span>
              </div>
            );
          })}

          <p className="text-xs text-center mt-2">
            Basic還元：{basicPoint.toFixed(0)}pt / Green還元：{greenPoint.toFixed(0)}pt
          </p>
        </div>

        {/* ランキング */}
        <div className="bg-gray-50 p-3 rounded text-sm max-h-64 overflow-y-scroll">
          {sorted.map((c, i) => (
            <div
              key={i}
              className={`flex justify-between border-b py-1 px-2 ${i === 0 ? "bg-green-100 font-bold" : ""}`}
            >
              <span>{i + 1}位 {c.name}</span>
              <span>{c.cost.toFixed(0)}円</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}