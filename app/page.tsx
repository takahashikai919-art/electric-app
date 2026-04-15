"use client";
import { useState } from "react";

export default function Home() {
  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [career, setCareer] = useState("no");
  const [card, setCard] = useState("none");
  const [company, setCompany] = useState("北海道電力");
  const [plan, setPlan] = useState("従量電灯B");

  // 🔥 電力会社データ（プラン付き）
  const companies: any = {
    "北海道電力": [
      {
        name: "従量電灯B",
        calc: () => {
          const base = {20:759,30:1138,40:1518,50:1897,60:2277}[amp] || 1138;
          if (kwh <= 120) return base + kwh * 35;
          if (kwh <= 300) return base + 120*35 + (kwh-120)*41;
          return base + 120*35 + 180*41 + (kwh-300)*45;
        },
        feature: "一般家庭向け",
        pros: ["安定", "安心"],
        cons: ["高くなりやすい"]
      },
      {
        name: "エネとくシーズンプラス",
        calc: () => {
          const base = {30:1138,40:1518,50:1897,60:2277}[amp] || 1138;
          return base + kwh * 39;
        },
        feature: "使用量多い人向け",
        pros: ["安くなりやすい"],
        cons: ["変動あり"]
      }
    ],

    "北ガス電気": [
      {
        name: "従量電灯B",
        calc: () => kwh * 39,
        feature: "標準",
        pros: ["シンプル"],
        cons: ["差が小さい"]
      }
    ],

    "コープでんき": [
      {
        name: "標準プラン",
        calc: () => kwh * 38,
        feature: "安心重視",
        pros: ["信頼性"],
        cons: ["最安ではない"]
      }
    ],

    // プランなし（簡易）
    "Looopでんき": [{ name: "標準", calc: () => kwh * 30 }],
    "ENEOSでんき": [{ name: "標準", calc: () => kwh * 39 }],
    "楽天でんき": [{ name: "標準", calc: () => kwh * 40 }],
    "auでんき": [{ name: "標準", calc: () => kwh * 39 }],
    "ソフトバンクでんき": [{ name: "標準", calc: () => kwh * 39 }],
    "HTBエナジー": [{ name: "標準", calc: () => kwh * 38 }],
    "シンエナジー": [{ name: "標準", calc: () => kwh * 37 }],
    "ミツウロコでんき": [{ name: "標準", calc: () => kwh * 39 }],
    "オクトパスエナジー": [{ name: "標準", calc: () => kwh * 37 }],
    "CDエナジー": [{ name: "標準", calc: () => kwh * 37 }],
    "エネワンでんき": [{ name: "標準", calc: () => kwh * 38 }],
    "Japan電力": [{ name: "標準", calc: () => kwh * 36 }],
  };

  const selectedPlans = companies[company];
  const selectedPlan = selectedPlans.find((p:any)=>p.name===plan) || selectedPlans[0];

  const currentCost = selectedPlan.calc();

  // 🔥 ドコモ計算
  let basicRate = 0.02;
  let greenRate = 0.04;

  if (career === "docomo") {
    basicRate += 0.01;
    greenRate += 0.01;
  }

  if (card === "gold") greenRate += 0.01;
  if (card === "platinum") greenRate += 0.05;

  const basicPoint = currentCost * basicRate;
  const greenPoint = (currentCost + 500) * greenRate;

  const docomoBasic = currentCost - basicPoint;
  const docomoGreen = currentCost + 500 - greenPoint;

  const diffBasic = currentCost - docomoBasic;
  const diffGreen = currentCost - docomoGreen;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">

      <h1 className="text-lg font-bold text-center mb-3">
        ドコモでんき営業ツール
      </h1>

      <input type="number" value={kwh}
        onChange={(e)=>setKwh(Number(e.target.value))}
        className="w-full border p-2 mb-2"/>

      <select value={amp} onChange={(e)=>setAmp(Number(e.target.value))}
        className="w-full border p-2 mb-2">
        {[20,30,40,50,60].map(a=><option key={a}>{a}A</option>)}
      </select>

      <select value={company} onChange={(e)=>{setCompany(e.target.value); setPlan(companies[e.target.value][0].name);}}
        className="w-full border p-2 mb-2">
        {Object.keys(companies).map(c=><option key={c}>{c}</option>)}
      </select>

      <select value={plan} onChange={(e)=>setPlan(e.target.value)}
        className="w-full border p-2 mb-3">
        {selectedPlans.map((p:any)=><option key={p.name}>{p.name}</option>)}
      </select>

      {/* プラン説明 */}
      {selectedPlan.feature && (
        <div className="bg-gray-100 p-2 mb-3 text-sm">
          <p>特徴：{selectedPlan.feature}</p>
          <p className="text-green-600">{selectedPlan.pros?.join(" / ")}</p>
          <p className="text-red-500">{selectedPlan.cons?.join(" / ")}</p>
        </div>
      )}

      <select value={career} onChange={(e)=>setCareer(e.target.value)}
        className="w-full border p-2 mb-2">
        <option value="no">ドコモ回線なし</option>
        <option value="docomo">あり</option>
      </select>

      <select value={card} onChange={(e)=>setCard(e.target.value)}
        className="w-full border p-2 mb-3">
        <option value="none">カードなし</option>
        <option value="regular">dカード</option>
        <option value="gold">GOLD</option>
        <option value="platinum">PLATINUM</option>
      </select>

      {/* 結果 */}
      <div className="bg-yellow-100 p-3 text-center">

        <p>現在：{currentCost.toFixed(0)}円</p>

        <p className="mt-2">
          Basic → {docomoBasic.toFixed(0)}円  
          （月{diffBasic.toFixed(0)}円安い / 年{(diffBasic*12).toFixed(0)}円）
          <br />
          ポイント：{basicPoint.toFixed(0)}pt
        </p>

        <p className="mt-2">
          Green → {docomoGreen.toFixed(0)}円  
          （月{diffGreen.toFixed(0)}円安い / 年{(diffGreen*12).toFixed(0)}円）
          <br />
          ポイント：{greenPoint.toFixed(0)}pt
        </p>

      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        ※燃料費調整額・再エネ賦課金・でんきセット割は含まれていません
      </p>

    </div>
  );
}