"use client";
import { useState } from "react";

export default function Home() {

  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [company, setCompany] = useState("北海道電力");
  const [plan, setPlan] = useState("従量電灯B");

  const [mode, setMode] = useState("normal");
  const [season, setSeason] = useState("normal");

  const [aircon, setAircon] = useState(false);

  const [career, setCareer] = useState("no");
  const [card, setCard] = useState("none");
  const [platinumUse, setPlatinumUse] = useState("low");

  const nightMap:any = { night:70, normal:50, day:30 };
  const nightRatio = nightMap[mode];

  const seasonType = season==="winter" ? "winter" : "other";
  const seasonRate:any = { normal:1, winter:1.1, summer:0.95 };

  const baseTable:any = { 20:759,30:1138,40:1518,50:1897,60:2277 };

  const kitagasBase:any = {
    10:418,15:627,20:836,30:1254,40:1672,50:2090,60:2508
  };

  const enetokuPointBaseTable:any = {
    20:726,30:1144,40:1562,50:1980,60:2398
  };

  const tier = (k:number,t1:number,t2:number,t3:number)=>{
    if(k<=120) return Math.ceil(k*t1);
    if(k<=300) return Math.ceil(120*t1+(k-120)*t2);
    return Math.ceil(120*t1+180*t2+(k-300)*t3);
  };

  const kitagasTier = (k:number)=>{
    if(k<=120) return Math.ceil(k*34.62);
    if(k<=280) return Math.ceil(120*34.62+(k-120)*40.72);
    return Math.ceil(120*34.62+160*40.72+(k-280)*44.33);
  };

  const hokudenBase = ()=>{
    return (baseTable[amp] + tier(kwh,35,41,45)) * seasonRate[season];
  };

  const baseDocomo = hokudenBase();

  const companies:any = {

    "北海道電力":[
      {name:"従量電灯B",type:"tier",t1:35,t2:41,t3:45},
      {name:"エネとくポイントプラン",type:"tier_point",t1:35.69,t2:41.98,t3:45.70},
      {
        name:"エネとくシーズンプラス",
        type:"season_plus",
        base:{30:1287,40:1716,50:2145,60:2574},
        winter:{limit:200,base:7651,over:46.88},
        other:{limit:200,base:6881,over:41.38},
        aircon:330
      },
      {name:"エネとくS",type:"fixed",limit:150,base:5064,over:45.44},
      {name:"エネとくM",type:"fixed",limit:250,base:9280,over:45.11},
      {name:"エネとくL",type:"fixed",limit:400,base:15764,over:44.44}
    ],

    "北ガス電気":[
      {name:"従量電灯B",type:"kitagas"}
    ],

    "Looopでんき":[
      {name:"市場連動",type:"flat",flat:30}
    ],

    "オクトパスエナジー":[
      {name:"ナイト",type:"time",day:42,night:28}
    ],

    "ENEOSでんき":[
      {name:"標準",type:"tier",t1:34,t2:40,t3:44}
    ],

    "トドック電力":[
      {name:"ベーシック",type:"tier",t1:34,t2:40,t3:44},
      {name:"再エネ",type:"tier",t1:36,t2:42,t3:46},
      {name:"スタンダード",type:"tier",t1:34,t2:40,t3:44},
      {name:"灯油セット",type:"tier",t1:33,t2:39,t3:43},
      {name:"トリプルセット",type:"tier",t1:32,t2:38,t3:42}
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

    if(p.type==="tier_point"){
      cost = enetokuPointBaseTable[amp] + tier(kwh,p.t1,p.t2,p.t3);
    }

    if(p.type==="flat"){
      cost = baseTable[amp] + kwh*p.flat;
    }

    if(p.type==="time"){
      const nightKwh = kwh*(nightRatio/100);
      const dayKwh = kwh - nightKwh;
      cost = baseTable[amp] + dayKwh*p.day + nightKwh*p.night;
    }

    if(p.type==="fixed"){
      if(kwh <= p.limit){
        cost = baseTable[amp] + p.base;
      }else{
        const extra = Math.ceil((kwh - p.limit) * p.over);
        cost = baseTable[amp] + p.base + extra;
      }
    }

    if(p.type==="season_plus"){
      const seasonData = seasonType==="winter" ? p.winter : p.other;

      let energy = kwh <= seasonData.limit
        ? seasonData.base
        : seasonData.base + Math.ceil((kwh - seasonData.limit) * seasonData.over);

      cost = (p.base[amp] || 0) + energy;

      if(aircon){
        cost -= p.aircon;
      }
    }

    if(p.type==="kitagas"){
      cost = (kitagasBase[amp] || 0) + kitagasTier(kwh);
    }

    cost *= seasonRate[season];

    return Math.ceil(cost);
  };

  const currentCost = calcCost(selectedPlan);

  let basicRate=0.02;
  let greenRate=0.04;

  if(career==="docomo"){
    basicRate+=0.01;
    greenRate+=0.01;
  }

  if(card==="gold") greenRate+=0.01;

  if(card==="platinum"){
    if(platinumUse==="mid") greenRate+=0.03;
    if(platinumUse==="high") greenRate+=0.05;
  }

  const basicPoint=Math.ceil(baseDocomo*basicRate);
  const greenPoint=Math.ceil((baseDocomo+500)*greenRate);

  const docomoBasic=Math.ceil(baseDocomo-basicPoint);
  const docomoGreen=Math.ceil(baseDocomo+500-greenPoint);

  const diffBasic = currentCost - docomoBasic;
  const diffGreen = currentCost - docomoGreen;

  const ranking = Object.keys(companies).map(c=>{
    const cheapest=Math.min(...companies[c].map((p:any)=>calcCost(p)));
    return {name:c,cost:cheapest};
  });

  ranking.push({name:"ドコモBasic",cost:docomoBasic});
  ranking.push({name:"ドコモGreen",cost:docomoGreen});

  const sorted=ranking.sort((a,b)=>a.cost-b.cost);

  return (
    <div className="p-4 max-w-md mx-auto">

      <h1 className="text-lg font-bold text-center mb-3">
        電気料金シミュレーター（ベータ版）
      </h1>

      <div className="bg-blue-50 p-3 rounded mb-3">

        {/* ===== 元UI完全維持 ===== */}

        <div className="mb-2">
          <label>使用量（kWh）</label>
          <input type="number" value={kwh}
            onChange={e=>setKwh(Number(e.target.value))}
            className="w-full border p-2"/>
        </div>

        <div className="mb-2">
          <label>契約アンペア（A）</label>
          <select value={amp}
            onChange={e=>setAmp(Number(e.target.value))}
            className="w-full border p-2">
            {[20,30,40,50,60].map(a=>(
              <option key={a} value={a}>{a}A</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-2">
          {[{ key:"night",label:"夜多め"},{ key:"normal",label:"標準"},{ key:"day",label:"昼多め"}].map(b=>(
            <button key={b.key} onClick={()=>setMode(b.key)}
              className={`px-3 py-1 border rounded ${mode===b.key?"bg-blue-500 text-white":"bg-white"}`}>
              {b.label}
            </button>
          ))}
          <span className="text-xs">※わからない場合は標準</span>
        </div>

        <div className="flex gap-2 mb-2">
          {[{ key:"winter",label:"冬"},{ key:"normal",label:"通常"},{ key:"summer",label:"夏"}].map(b=>(
            <button key={b.key} onClick={()=>setSeason(b.key)}
              className={`px-3 py-1 border rounded ${season===b.key?"bg-red-500 text-white":"bg-white"}`}>
              {b.label}
            </button>
          ))}
          <span className="text-xs">※わからない場合は通常</span>
        </div>

        {company==="北海道電力" && plan==="エネとくシーズンプラス" && (
          <label className="block mb-2">
            <input type="checkbox" checked={aircon}
              onChange={(e)=>setAircon(e.target.checked)}/>
            エアコン割引（-330円）
          </label>
        )}

        <select value={company}
          onChange={e=>{
            setCompany(e.target.value);
            setPlan(companies[e.target.value][0].name);
            setAircon(false);
          }}
          className="w-full border p-2 mb-2">
          {Object.keys(companies).map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <select value={plan}
          onChange={e=>setPlan(e.target.value)}
          className="w-full border p-2 mb-2">
          {selectedPlans.map((p:any)=>(
            <option key={p.name}>{p.name}</option>
          ))}
        </select>

        {/* 説明UI完全維持 */}
        {company==="北海道電力" && plan==="エネとくシーズンプラス" && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            主に夏季の冷房用・除湿用向け料金プラン。<br/>
            冬期間（11月～翌2月末）以外の電力量料金が割安。
          </div>
        )}

        {company==="北海道電力" && plan==="エネとくポイントプラン" && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            従量電灯Bより基本料金が110円安い<br/>
            電気料金200円につき1ポイント付与
          </div>
        )}

        {company==="北海道電力" && plan==="エネとくS" && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            150kWhまで定額。超過後1kWhあたり45.44円
          </div>
        )}
        {company==="北海道電力" && plan==="エネとくM" && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            250kWhまで定額。超過後1kWhあたり45.11円
          </div>
        )}
        {company==="北海道電力" && plan==="エネとくL" && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            400kWhまで定額。超過後1kWhあたり44.44円
          </div>
        )}

        {company === "トドック電力" && (
          <div className="bg-green-100 p-2 text-xs mb-2">
            363円(税込)につきコープさっぽろポイント1pt付与<br/>
            宅配トドックのシステム手数料220円/回が無料
          </div>
        )}

        <select value={career} onChange={e=>setCareer(e.target.value)} className="w-full border p-2 mb-2">
          <option value="no">ドコモ回線なし</option>
          <option value="docomo">あり</option>
        </select>

        <select value={card} onChange={e=>setCard(e.target.value)} className="w-full border p-2 mb-2">
          <option value="none">カードなし</option>
          <option value="regular">dカード</option>
          <option value="gold">GOLD</option>
          <option value="platinum">PLATINUM</option>
        </select>

        {card==="platinum" && (
          <select value={platinumUse} onChange={e=>setPlatinumUse(e.target.value)} className="w-full border p-2">
            <option value="low">10万未満</option>
            <option value="mid">10万以上20万未満</option>
            <option value="high">20万以上・初年度</option>
          </select>
        )}

      </div>

      <div className="bg-yellow-100 p-3 text-center mb-3 rounded">
        <p>現在：{currentCost.toFixed(0)}円/月</p>

        <p className="mt-2">
          Basic：{docomoBasic.toFixed(0)}円（dポイント充当後）<br/>
          月{diffBasic.toFixed(0)}円安い / 年{(diffBasic*12).toFixed(0)}円
        </p>

        <p className="mt-2">
          Green：{docomoGreen.toFixed(0)}円（dポイント充当後）<br/>
          月{diffGreen.toFixed(0)}円安い / 年{(diffGreen*12).toFixed(0)}円
        </p>
      </div>

      <div className="bg-gray-100 p-3 text-sm rounded">
        {sorted.map((c,i)=>(
          <div key={i} className={`flex justify-between ${i===0?"text-green-600 font-bold":""}`}>
            <span>{i+1}位 {c.name}</span>
            <span>{c.cost.toFixed(0)}円</span>
          </div>
        ))}
      </div>

    </div>
  );
}