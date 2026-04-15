"use client";
import { useState } from "react";

export default function Home() {
  const [kwh, setKwh] = useState<number>(300);
  const [amp, setAmp] = useState<number>(30);
  const [career, setCareer] = useState<string>("no");
  const [card, setCard] = useState<string>("none");
  const [current, setCurrent] = useState<string>("北海道電力");
  const [plan, setPlan] = useState<string>("従量電灯B");

  // 🔥 電力会社＋プランDB
  const companies: any = {
    "北海道電力": {
      plans: [
        {
          name: "従量電灯B",
          rate: 1.0,
          feature: "一般家庭向け標準",
          pros: ["安定", "シンプル"],
          cons: ["高くなりやすい"],
        },
        {
          name: "エネとくシーズンプラス",
          rate: 0.95,
          feature: "使用量多いほどお得",
          pros: ["ヘビーユーザー向け"],
          cons: ["変動あり"],
        },
      ],
    },

    "北ガス電気": {
      plans: [
        {
          name: "従量電灯B",
          rate: 0.98,
          feature: "標準プラン",
          pros: ["切替しやすい"],
          cons: ["大きく安くならない"],
        },
        {
          name: "ガスセット",
          rate: 0.95,
          feature: "ガス併用で安い",
          pros: ["セットで安い"],
          cons: ["ガス必須"],
        },
      ],
    },

    "コープでんき": {
      plans: [
        {
          name: "標準プラン",
          rate: 0.97,
          feature: "安心志向",
          pros: ["信頼性高い"],
          cons: ["最安ではない"],
        },
      ],
    },

    // 🔥 その他（簡易）
    "Looopでんき": { plans: [{ name: "スマート", rate: 0.95 }] },
    "ENEOSでんき": { plans: [{ name: "Vプラン", rate: 0.98 }] },
    "楽天でんき": { plans: [{ name: "シンプル", rate: 1.0 }] },
    "auでんき": { plans: [{ name: "でんきM", rate: 0.98 }] },
    "ソフトバンクでんき": { plans: [{ name: "おうちでんき", rate: 0.99 }] },
    "HTBエナジー": { plans: [{ name: "ベーシック", rate: 0.97 }] },
    "シンエナジー": { plans: [{ name: "きほん", rate: 0.96 }] },
    "ミツウロコでんき": { plans: [{ name: "標準", rate: 0.98 }] },
    "オクトパスエナジー": { plans: [{ name: "グリーン", rate: 0.96 }] },
    "CDエナジー": { plans: [{ name: "ベーシック", rate: 0.96 }] },
    "エネワンでんき": { plans: [{ name: "通常", rate: 0.97 }] },
    "Japan電力": { plans: [{ name: "通常", rate: 0.95 }] },
  };

  const baseTable: Record<number, number> = {
    20: 759, 30: 1138, 40: 1518, 50: 1897, 60: 2277,
  };

  const base = baseTable[amp] ?? 1138;

  const calc = (k: number) => {
    if (k <= 120) return k * 35;
    if (k <= 300) return 120 * 35 + (k - 120) * 41;
    return 120 * 35 + 180 * 41 + (k - 300) * 45;
  };

  const hokkaido = base + calc(kwh);

  // 🔥 現在の会社＋プラン
  const selectedCompany = companies[current];
  const selectedPlan = selectedCompany.plans.find((p:any)=>p.name===plan) || selectedCompany.plans[0];

  const currentCost = hokkaido * selectedPlan.rate;

  // 🔥 ドコモ
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

  const yearlyBasic = (currentCost - docomoBasic) * 12;
  const yearlyGreen = (currentCost - docomoGreen) * 12;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">

        <h1 className="text-xl font-bold text-center mb-4">
          電気料金比較（営業特化）
        </h1>

        <input type="number" value={kwh} onChange={(e)=>setKwh(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded" />

        <select value={amp} onChange={(e)=>setAmp(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded">
          {[20,30,40,50,60].map(a=><option key={a}>{a}A</option>)}
        </select>

        <select value={current} onChange={(e)=>{
          setCurrent(e.target.value);
          setPlan(companies[e.target.value].plans[0].name);
        }}
          className="w-full border p-2 mb-2 rounded">
          {Object.keys(companies).map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* 🔥 プラン選択 */}
        <select value={plan} onChange={(e)=>setPlan(e.target.value)}
          className="w-full border p-2 mb-2 rounded">
          {selectedCompany.plans.map((p:any)=>(
            <option key={p.name}>{p.name}</option>
          ))}
        </select>

        {/* 🔥 プラン説明 */}
        {selectedPlan.feature && (
          <div className="bg-gray-50 p-2 rounded text-xs mb-3">
            <p>特徴：{selectedPlan.feature}</p>
            <p className="text-green-600">
              {selectedPlan.pros?.map((p:string,i:number)=><span key={i}>・{p} </span>)}
            </p>
            <p className="text-red-500">
              {selectedPlan.cons?.map((c:string,i:number)=><span key={i}>・{c} </span>)}
            </p>
          </div>
        )}

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
        <div className="bg-yellow-100 p-4 rounded text-center font-bold">
          <p>現在：{currentCost.toFixed(0)}円/月</p>

          <p className="mt-2 text-red-600 text-lg">
            👉 年間最大 {Math.max(yearlyBasic, yearlyGreen).toFixed(0)}円 お得
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          ※燃料費調整額・再エネ賦課金・でんきセット割は計算に含まれていません
        </p>

      </div>
    </div>
  );
}