"use client";
import { useState } from "react";
import { plansData } from "../data/plans";

export default function Home() {
  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [company, setCompany] = useState("北海道電力");
  const [career, setCareer] = useState("no");
  const [card, setCard] = useState("none");

  const calcPlan = (plan: any) => {
    if (plan.flat) return kwh * plan.flat;
    if (plan.rate) return kwh * 40 * plan.rate;

    if (plan.tiers) {
      let total = plan.base[amp] || 0;
      let remaining = kwh;
      let last = 0;

      for (const t of plan.tiers) {
        const use = Math.min(remaining, t.upTo - last);
        total += use * t.rate;
        remaining -= use;
        last = t.upTo;
        if (remaining <= 0) break;
      }
      return total;
    }

    return 0;
  };

  // 現在料金
  const currentCompany = plansData[company];
  const currentCost = Math.min(
    ...currentCompany.plans.map((p: any) => calcPlan(p))
  );

  // 還元率
  let basicRate = 0.02;
  let greenRate = 0.04;

  if (career === "docomo") {
    basicRate += 0.01;
    greenRate += 0.01;
  }

  if (card === "gold") greenRate += 0.01;
  if (card === "platinum") greenRate += 0.05;

  // ドコモ料金
  const base = currentCost;

  const basicPoint = base * basicRate;
  const greenPoint = (base + 500) * greenRate;

  const docomoBasic = base - basicPoint;
  const docomoGreen = base + 500 - greenPoint;

  const bestDocomo = Math.min(docomoBasic, docomoGreen);

  // 差額
  const diff = currentCost - bestDocomo;
  const yearly = diff * 12;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">

        <h1 className="text-xl font-bold text-center mb-4">
          ドコモでんき比較（営業用）
        </h1>

        <input
          type="number"
          value={kwh}
          onChange={(e) => setKwh(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded"
        />

        <select value={amp} onChange={(e)=>setAmp(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded">
          {[20,30,40,50,60].map(a=>(
            <option key={a}>{a}A</option>
          ))}
        </select>

        <select value={company} onChange={(e)=>setCompany(e.target.value)}
          className="w-full border p-2 mb-2 rounded">
          {Object.keys(plansData).map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <select value={career} onChange={(e)=>setCareer(e.target.value)}
          className="w-full border p-2 mb-2 rounded">
          <option value="no">ドコモ回線なし</option>
          <option value="docomo">ドコモ回線あり</option>
        </select>

        <select value={card} onChange={(e)=>setCard(e.target.value)}
          className="w-full border p-2 mb-4 rounded">
          <option value="none">カードなし</option>
          <option value="regular">dカード</option>
          <option value="gold">dカードGOLD</option>
          <option value="platinum">PLATINUM</option>
        </select>

        {/* 結果 */}
        <div className="bg-yellow-50 p-4 rounded text-center">

          <p className="text-sm">現在の電気代</p>
          <p className="text-lg font-bold mb-2">
            {currentCost.toFixed(0)}円
          </p>

          <p className="text-sm">ドコモでんき（最安）</p>
          <p className="text-lg font-bold mb-2">
            {bestDocomo.toFixed(0)}円
          </p>

          {diff > 0 ? (
            <>
              <p className="text-xl font-bold text-red-500">
                👉 月 {diff.toFixed(0)}円お得！
              </p>
              <p className="text-lg font-bold text-green-600">
                👉 年 {yearly.toFixed(0)}円お得！
              </p>
            </>
          ) : (
            <p className="text-gray-500">
              👉 安くならない可能性あり
            </p>
          )}

        </div>

        {/* 注意書き */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          ※燃料費調整額・再エネ賦課金・でんきセット割は含まれていません
        </p>

      </div>
    </div>
  );
}