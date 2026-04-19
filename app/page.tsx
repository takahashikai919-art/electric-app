"use client";
import { useState } from "react";

export default function Home() {

  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [company, setCompany] = useState("北海道電力");
  const [plan, setPlan] = useState("従量電灯B");

  const [mode, setMode] = useState("normal");
  const [season, setSeason] = useState("normal");
  const [gas, setGas] = useState(false);

  const [career, setCareer] = useState("no");
  const [card, setCard] = useState("none");
  const [platinumUse, setPlatinumUse] = useState("low");

  const nightMap:any = { night:70, normal:50, day:30 };
  const nightRatio = nightMap[mode];

  const seasonRate:any = { normal:1, winter:1.1, summer:0.95 };

  const baseTable:any = {
    20:759,30:1138,40:1518,50:1897,60:2277
  };

  const tier = (k:number,t1:number,t2:number,t3:number)=>{
    if(k<=120) return k*t1;
    if(k<=300) return 120*t1+(k-120)*t2;
    return 120*t1+180*t2+(k-300)*t3;
  };

  const hokudenBase = ()=>{
    return (baseTable[amp] + tier(kwh,35,41,45)) * seasonRate[season];
  };

  const baseDocomo = hokudenBase();

  const companies:any = {
    "北海道電力":[
      {name:"従量電灯B",type:"tier",t1:35,t2:41,t3:45},
      {name:"エネとくL",type:"tier",t1:33,t2:39,t3:43}
    ],
    "北ガス電気":[
      {name:"従量",type:"tier",t1:34,t2:40,t3:44}
    ],
    "Looopでんき":[
      {name:"市場連動",type:"flat",flat:30}
    ],
    "オクトパスエナジー":[
      {name:"ナイト",type:"time",day:42,night:28}
    ],
    "ENEOSでんき":[
      {name:"標準",type:"tier",t1:34,t2:40,t3:44}
    ]
  };

  const selectedPlans = companies[company];
  const selectedPlan =
    selectedPlans.find((p:any)=>p.name===plan) || selectedPlans[0];

  const calcCost = (p:any)=>{
    let cost = 0;

    if(p.type==="tier"){
      cost = baseTable[amp] + tier(kwh,p.t1,p.t2,p.t3);
    }

    if(p.type==="flat"){
      cost = baseTable[amp] + kwh*p.flat;
    }

    if(p.type==="time"){
      const nightKwh = kwh*(nightRatio/100);
      const dayKwh = kwh - nightKwh;
      cost = baseTable[amp] + dayKwh*p.day + nightKwh*p.night;
    }

    cost *= seasonRate[season];

    if(company==="北ガス電気" && gas){
      cost *= 0.95;
    }

    return cost;
  };

  const currentCost = calcCost(selectedPlan);

  // 🔥 ドコモ計算
  let basicRate=0.02;
  let greenRate=0.04;

  if(career==="docomo"){
    basicRate+=0.01;
    greenRate+=0.01;
  }

  if(card==="gold") greenRate+=0.01;

  if(card==="platinum"){
    if(platinumUse==="low") greenRate+=0.03;
    if(platinumUse==="mid") greenRate+=0.05;
    if(platinumUse==="high") greenRate+=0.07;
  }

  const basicPoint=baseDocomo*basicRate;
  const greenPoint=(baseDocomo+500)*greenRate;

  const docomoBasic=baseDocomo-basicPoint;
  const docomoGreen=baseDocomo+500-greenPoint;

  // 🔥 差額
  const diffBasic = currentCost - docomoBasic;
  const diffGreen = currentCost - docomoGreen;

  const yearlyBasic = diffBasic * 12;
  const yearlyGreen = diffGreen * 12;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">

      <h1 className="text-lg font-bold text-center mb-3">
        電気料金シミュレーター(ベータ版)
      </h1>

      {/* 使用量 */}
      <input type="number" value={kwh}
        onChange={e=>setKwh(Number(e.target.value))}
        className="w-full border p-2 mb-2"/>

      {/* アンペア */}
      <select value={amp}
        onChange={e=>setAmp(Number(e.target.value))}
        className="w-full border p-2 mb-2">
        {[20,30,40,50,60].map(a=>(
          <option key={a} value={a}>{a}A</option>
        ))}
      </select>

      {/* 昼夜 */}
      <div className="flex items-center gap-2 mb-2">
        {[
          { key: "night", label: "夜多め" },
          { key: "normal", label: "標準" },
          { key: "day", label: "昼多め" }
        ].map(b => (
          <button
            key={b.key}
            onClick={() => setMode(b.key)}
            className={`px-3 py-1 border rounded
              ${mode === b.key ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {b.label}
          </button>
        ))}
        <span className="text-xs text-gray-500">
          ※わからない場合は標準を選択
        </span>
      </div>

      {/* 季節 */}
      <div className="flex items-center gap-2 mb-2">
        {[
          { key: "winter", label: "冬" },
          { key: "normal", label: "通常" },
          { key: "summer", label: "夏" }
        ].map(b => (
          <button
            key={b.key}
            onClick={() => setSeason(b.key)}
            className={`px-3 py-1 border rounded
              ${season === b.key ? "bg-red-500 text-white" : "bg-white"}`}
          >
            {b.label}
          </button>
        ))}
        <span className="text-xs text-gray-500">
          ※わからない場合は通常を選択
        </span>
      </div>

      {/* ガス */}
      {company==="北ガス電気" && (
        <label className="block mb-2">
          <input type="checkbox"
            checked={gas}
            onChange={(e)=>setGas(e.target.checked)}
          />
          ガスセット割
        </label>
      )}

      {/* 電力会社 */}
      <select value={company}
        onChange={e=>{
          setCompany(e.target.value);
          setPlan(companies[e.target.value][0].name);
          setGas(false);
        }}
        className="w-full border p-2 mb-2">
        {Object.keys(companies).map(c=>(
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* プラン */}
      <select value={plan}
        onChange={e=>setPlan(e.target.value)}
        className="w-full border p-2 mb-3">
        {selectedPlans.map((p:any)=>(
          <option key={p.name}>{p.name}</option>
        ))}
      </select>

      {/* ドコモ条件 */}
      <select value={career} onChange={(e)=>setCareer(e.target.value)}
        className="w-full border p-2 mb-2">
        <option value="no">ドコモ回線なし</option>
        <option value="docomo">あり</option>
      </select>

      <select value={card} onChange={(e)=>setCard(e.target.value)}
        className="w-full border p-2 mb-2">
        <option value="none">カードなし</option>
        <option value="regular">dカード</option>
        <option value="gold">GOLD</option>
        <option value="platinum">PLATINUM</option>
      </select>

      {card==="platinum" && (
        <select value={platinumUse}
          onChange={(e)=>setPlatinumUse(e.target.value)}
          className="w-full border p-2 mb-3">
          <option value="low">10万未満</option>
          <option value="mid">10万以上20万未満</option>
          <option value="high">20万以上・初年度</option>
        </select>
      )}

      {/* 結果 */}
      <div className="bg-yellow-100 p-3 text-center">
        <p>現在：{currentCost.toFixed(0)}円/月</p>

        <p>
          Basic：{docomoBasic.toFixed(0)}円  
          👉 月{diffBasic.toFixed(0)}円 / 年{yearlyBasic.toFixed(0)}円
        </p>

        <p>
          Green：{docomoGreen.toFixed(0)}円  
          👉 月{diffGreen.toFixed(0)}円 / 年{yearlyGreen.toFixed(0)}円
        </p>
      </div>

    </div>
  );
}