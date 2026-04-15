"use client";
import { useState } from "react";
import { plansData } from "../data/plans";

export default function Home() {
  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [company, setCompany] = useState("北海道電力");

  const calcPlan = (plan: any) => {
    if (plan.type === "docomoBasic") {
      return kwh * 40 * 0.97;
    }

    if (plan.type === "docomoGreen") {
      return kwh * 40 + 500 - kwh * 40 * 0.1;
    }

    if (plan.flat) {
      return kwh * plan.flat;
    }

    if (plan.rate) {
      return kwh * 40 * plan.rate;
    }

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

  const selected = plansData[company];
  const results = selected.plans.map((p: any) => ({
    ...p,
    cost: calcPlan(p),
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">

        <h1 className="text-xl font-bold text-center mb-4">
          電気料金比較（完全版）
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
          className="w-full border p-2 mb-4 rounded">
          {Object.keys(plansData).map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="space-y-3">
          {results.map((p:any,i:number)=>(
            <div key={i} className="bg-gray-50 p-3 rounded border">

              <div className="flex justify-between font-bold">
                <span>{p.name}</span>
                <span>{p.cost.toFixed(0)}円</span>
              </div>

              <p className="text-xs mt-1">特徴：{p.feature}</p>

              <ul className="text-xs text-green-600">
                {p.pros?.map((pro:string,idx:number)=>(
                  <li key={idx}>・{pro}</li>
                ))}
              </ul>

              <ul className="text-xs text-red-500">
                {p.cons?.map((con:string,idx:number)=>(
                  <li key={idx}>・{con}</li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        {/* 🔥 注意書き */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          ※燃料費調整額・再生可能エネルギー発電促進賦課金・でんきセット割は計算に含まれていません
        </p>

      </div>
    </div>
  );
}