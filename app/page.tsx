'use client';
import { useState } from 'react';

type DiscountKey =
  | 'hotWaterSnow'
  | 'hotWaterHeat'
  | 'myHomeGen'
  | 'kerosene';

type PlanType =
  | 'tier'
  | 'tier_point'
  | 'flat'
  | 'time'
  | 'fixed'
  | 'season_plus'
  | 'kitagas'
  | 'kitagas_plus'
  | 'todock';

  type Plan =
  | {
      type: 'tier';
      name: string;
      t1: number;
      t2: number;
      t3: number;
    }
  | {
      type: 'tier_point';
      name: string;
      t1: number;
      t2: number;
      t3: number;
    }
  | {
      type: 'flat';
      name: string;
      flat: number;
    }
  | {
      type: 'time';
      name: string;
      day: number;
      night: number;
    }
  | {
      type: 'fixed';
      name: string;
      limit: number;
      base: number;
      over: number;
    }
  | {
      type: 'season_plus';
      name: string;
      base: Record<number, number>;
      winter: {
        limit: number;
        base: number;
        over: number;
      };
      other: {
        limit: number;
        base: number;
        over: number;
      };
      aircon: number;
    }
  | {
      type: 'kitagas';
      name: string;
    }
  | {
      type: 'kitagas_plus';
      name: string;
    }
    | {
      type: 'todock';
      name: string;
    };
 
export default function Home() {
  const [kwh, setKwh] = useState(300);
  const [amp, setAmp] = useState(30);
  const [company, setCompany] = useState('北海道電力');
  const [plan, setPlan] = useState('従量電灯B');

  const [mode, setMode] = useState('normal');
  const [season, setSeason] = useState('normal');

  const [aircon, setAircon] = useState(false);

  const [career, setCareer] = useState('no');
  const [card, setCard] = useState('none');
  const [platinumUse, setPlatinumUse] = useState('low');

const [todockMenu, setTodockMenu] = useState<'basic' | 'renewable'>('basic');
const [todockSub, setTodockSub] = useState<'standard' | 'kerosene' | 'triple'>('standard');
const [showTodockInfo, setShowTodockInfo] = useState<
  'standard' | 'kerosene' | 'triple' | null
>(null);

  const [discounts, setDiscounts] = useState<Record<DiscountKey, boolean>>({
  hotWaterSnow: false,
  hotWaterHeat: false,
  myHomeGen: false,
  kerosene: false,
});

const [showInfo, setShowInfo] = useState<Record<DiscountKey, boolean>>({
  hotWaterSnow: false,
  hotWaterHeat: false,
  myHomeGen: false,
  kerosene: false,
});

  const nightMap: any = { night: 70, normal: 50, day: 30 };
  const nightRatio = nightMap[mode];

  const seasonType = season === 'winter' ? 'winter' : 'other';
  const seasonRate: any = { normal: 1, winter: 1.1, summer: 0.95 };

  const baseTable: any = { 20: 759, 30: 1138, 40: 1518, 50: 1897, 60: 2277 };

  const kitagasBase: any = {
    10: 418,
    15: 627,
    20: 836,
    30: 1254,
    40: 1672,
    50: 2090,
    60: 2508,
  };

  const enetokuPointBaseTable: any = {
    20: 726,
    30: 1144,
    40: 1562,
    50: 1980,
    60: 2398,
  };

  const tier = (k: number, t1: number, t2: number, t3: number) => {
    if (k <= 120) return Math.ceil(k * t1);
    if (k <= 300) return Math.ceil(120 * t1 + (k - 120) * t2);
    return Math.ceil(120 * t1 + 180 * t2 + (k - 300) * t3);
  };

  const kitagasTier = (k: number) => {
    if (k <= 120) return Math.ceil(k * 34.62);
    if (k <= 280) return Math.ceil(120 * 34.62 + (k - 120) * 40.72);
    return Math.ceil(120 * 34.62 + 160 * 40.72 + (k - 280) * 44.33);
  };

  const kitagasPlusTier = (k: number) => {
    if (k <= 120) return Math.ceil(k * 34.27);
    if (k <= 280) return Math.ceil(120 * 34.27 + (k - 120) * 40.31);
    return Math.ceil(120 * 34.27 + 160 * 40.31 + (k - 280) * 43.88);
  };

  const hokudenBase = () => {
    return (baseTable[amp] + tier(kwh, 35, 41, 45)) * seasonRate[season];
  };

  const baseDocomo = hokudenBase();

  const companies: Record<string, Plan[]> = {
    北海道電力: [
      { name: '従量電灯B', type: 'tier', t1: 35, t2: 41, t3: 45 },
      {
        name: 'エネとくポイントプラン',
        type: 'tier_point',
        t1: 35.69,
        t2: 41.98,
        t3: 45.7,
      },
      {
        name: 'エネとくシーズンプラス',
        type: 'season_plus',
        base: { 30: 1287, 40: 1716, 50: 2145, 60: 2574 },
        winter: { limit: 200, base: 7651, over: 46.88 },
        other: { limit: 200, base: 6881, over: 41.38 },
        aircon: 330,
      },
      { name: 'エネとくS', type: 'fixed', limit: 150, base: 5064, over: 45.44 },
      { name: 'エネとくM', type: 'fixed', limit: 250, base: 9280, over: 45.11 },
      {
        name: 'エネとくL',
        type: 'fixed',
        limit: 400,
        base: 15764,
        over: 44.44,
      },
    ],

    北ガス電気: [
      { name: '従量電灯B', type: 'kitagas' },
      { name: '従量電灯Bプラス', type: 'kitagas_plus' },
      { name: '従量電灯Bメイト', type: 'kitagas_plus' },
    ],

    Looopでんき: [{ name: '市場連動', type: 'flat', flat: 30 }],

    オクトパスエナジー: [{ name: 'ナイト', type: 'time', day: 42, night: 28 }],

    ENEOSでんき: [{ name: '標準', type: 'tier', t1: 34, t2: 40, t3: 44 }],

    トドック電力: [
      { name: 'トドック電力', type: 'todock' },
    ],
  };

  const selectedPlans = companies[company];

  const selectedPlan: Plan =
  selectedPlans.find((p: Plan) => p.name === plan) ||
  selectedPlans[0];
  
  const isKitagasTarget =
    company === '北ガス電気' &&
    (plan === '従量電灯Bプラス' || plan === '従量電灯Bメイト');

   type Context = {
    kwh: number;
    amp: number;
    season: string;
    seasonRate: Record<string, number>;
    nightRatio: number;
    discounts: Record<DiscountKey, boolean>;
    aircon: boolean;
  };
  
  const context: Context = {
    kwh,
    amp,
    season,
    seasonRate,
    nightRatio,
    discounts,
    aircon,
  };

const calculators: {
  [K in Plan['type']]: (
    p: Extract<Plan, { type: K }>,
    ctx: Context
  ) => number;
} = {
  tier: (p: any, ctx: any) => {
    return baseTable[ctx.amp] + tier(ctx.kwh, p.t1, p.t2, p.t3);
  },

  tier_point: (p: any, ctx: any) => {
    return (
      enetokuPointBaseTable[ctx.amp] +
      tier(ctx.kwh, p.t1, p.t2, p.t3)
    );
  },

  flat: (p: any, ctx: any) => {
    return baseTable[ctx.amp] + ctx.kwh * p.flat;
  },

  time: (p: any, ctx: any) => {
    const night = ctx.kwh * (ctx.nightRatio / 100);
    const day = ctx.kwh - night;
    return baseTable[ctx.amp] + day * p.day + night * p.night;
  },

  fixed: (p: any, ctx: any) => {
    if (ctx.kwh <= p.limit) {
      return baseTable[ctx.amp] + p.base;
    } else {
      const extra = Math.ceil((ctx.kwh - p.limit) * p.over);
      return baseTable[ctx.amp] + p.base + extra;
    }
  },

  season_plus: (p: any, ctx: any) => {
    const seasonData =
      ctx.season === 'winter' ? p.winter : p.other;

    let energy =
      ctx.kwh <= seasonData.limit
        ? seasonData.base
        : seasonData.base +
          Math.ceil(
            (ctx.kwh - seasonData.limit) * seasonData.over
          );

    let cost = ((p.base as any)[ctx.amp] || 0) + energy;

    if (ctx.aircon) {
      cost -= p.aircon!;
    }

    return cost;
  },

  kitagas: (p: any, ctx: any) => {
    return (kitagasBase[ctx.amp] || 0) + kitagasTier(ctx.kwh);
  },

  kitagas_plus: (p: any, ctx: any) => {
    let cost =
      (kitagasBase[ctx.amp] || 0) + kitagasPlusTier(ctx.kwh);

    let discount = 0;
    if (ctx.discounts.hotWaterSnow) discount += 0.01;
    if (ctx.discounts.hotWaterHeat) discount += 0.02;
    if (ctx.discounts.myHomeGen) discount += 0.03;
    if (ctx.discounts.kerosene) discount += 0.02;

    return cost * (1 - discount);
  },
  todock: (p: any, ctx: any) => {
    const table = {
      basic: {
        standard: [35.46, 41.38, 42.99],
        kerosene: [34.98, 40.78, 42.31],
        triple: [34.74, 40.48, 41.97],
      },
      renewable: {
        standard: [37.96, 43.88, 45.49],
        kerosene: [37.48, 43.28, 44.81],
        triple: [37.24, 42.98, 44.47],
      },
    };
  
    const rates = table[todockMenu][todockSub];
  
    const calc = (k: number) => {
      if (k <= 120) return Math.ceil(k * rates[0]);
      if (k <= 280) return Math.ceil(120 * rates[0] + (k - 120) * rates[1]);
      return Math.ceil(
        120 * rates[0] +
        160 * rates[1] +
        (k - 280) * rates[2]
      );
    };
  
    return baseTable[ctx.amp] + calc(ctx.kwh);
  },
};

const calcCost = (p: Plan) => {
  switch (p.type) {
    case 'tier':
      return Math.ceil(
        calculators.tier(p, context) * seasonRate[season]
      );

    case 'tier_point':
      return Math.ceil(
        calculators.tier_point(p, context) * seasonRate[season]
      );

    case 'flat':
      return Math.ceil(
        calculators.flat(p, context) * seasonRate[season]
      );

    case 'time':
      return Math.ceil(
        calculators.time(p, context) * seasonRate[season]
      );

    case 'fixed':
      return Math.ceil(
        calculators.fixed(p, context) * seasonRate[season]
      );

    case 'season_plus':
      return Math.ceil(
        calculators.season_plus(p, context) * seasonRate[season]
      );

    case 'kitagas':
      return Math.ceil(
        calculators.kitagas(p, context) * seasonRate[season]
      );

    case 'kitagas_plus':
      return Math.ceil(
        calculators.kitagas_plus(p, context) * seasonRate[season]
      );
      case 'todock':
  return Math.ceil(
    calculators.todock(p, context) * seasonRate[season]
  );

  }
};

const currentCost = calcCost(selectedPlan);

let basicRate = 0.02;
let greenRate = 0.04;

if (career === 'docomo') {
  basicRate += 0.01;
  greenRate += 0.01;
}

if (card === 'gold') greenRate += 0.01;

if (card === 'platinum') {
  if (platinumUse === 'mid') greenRate += 0.03;
  if (platinumUse === 'high') greenRate += 0.05;
}

const basicPoint = Math.ceil(baseDocomo * basicRate);
const greenPoint = Math.ceil((baseDocomo + 500) * greenRate);

const docomoBasic = Math.ceil(baseDocomo - basicPoint);
const docomoGreen = Math.ceil(baseDocomo + 500 - greenPoint);

const diffBasic = currentCost - docomoBasic;
const diffGreen = currentCost - docomoGreen;

/* ===== ranking ===== */
const ranking = Object.keys(companies).map((c) => {
  const cheapest = Math.min(
    ...companies[c].map((p: any) => calcCost(p))
  );
  return { name: c, cost: cheapest };
});

  ranking.push({ name: 'ドコモBasic', cost: docomoBasic });
  ranking.push({ name: 'ドコモGreen', cost: docomoGreen });

  const sorted = ranking.sort((a, b) => a.cost - b.cost);

  const discountDefs: {
    key: DiscountKey;
    label: string;
    rate: string;
    desc: string;
  }[] = [
    
    {
      key: 'hotWaterSnow',
      label: '給湯・暖房・融雪割',
      rate: '1%',
      desc: `給湯能力１０号以上の給湯器・ＦＦ暖房機・ロードヒーティングのいずれかを使用している。
  給湯＋暖房割と併用可能`,
    },
    {
      key: 'hotWaterHeat',
      label: '給湯＋暖房割',
      rate: '2%',
      desc: `ガスセントラルヒーティングまたは給湯器+暖房機を使用している。
  給湯・暖房・融雪割と併用可能`,
    },
    {
      key: 'myHomeGen',
      label: 'マイホーム発電割',
      rate: '3%',
      desc: `エコウィル、コレモ、エネファームのいずれかを使用している。`,
    },
    {
      key: 'kerosene',
      label: '灯油セット割',
      rate: '2%',
      desc: `家庭用として北ガスジェネックス(株) の灯油定期配送契約を締結している。
  ※灯油セット割は北ガス・北ガスジェネックスのガス利用者のみ適用可能`,
    },
  ]
  
  const todockDefs: Record<'standard' | 'kerosene' | 'triple', string> = {
  standard: '電気のみの契約',
  kerosene: '電気 ＋ 灯油定期配送の契約',
  triple: '電気 ＋ 灯油 ＋ ガスの契約',
};

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold text-center mb-3">
        電気料金シミュレーター（ベータ版）
      </h1>

      <div className="bg-blue-50 p-3 rounded mb-3">
      
        <div className="mb-2">
          <label>使用量（kWh）</label>
          <input
            type="number"
            value={kwh}
            onChange={(e) => setKwh(Number(e.target.value))}
            className="w-full border p-2"
          />
        </div>

        <div className="mb-2">
          <label>契約アンペア（A）</label>
          <select
            value={amp}
            onChange={(e) => setAmp(Number(e.target.value))}
            className="w-full border p-2"
          >
            {[20, 30, 40, 50, 60].map((a) => (
              <option key={a} value={a}>
                {a}A
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-2">
          {[
            { key: 'night', label: '夜多め' },
            { key: 'normal', label: '標準' },
            { key: 'day', label: '昼多め' },
          ].map((b) => (
            <button
              key={b.key}
              onClick={() => setMode(b.key)}
              className={`px-3 py-1 border rounded ${
                mode === b.key ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {b.label}
            </button>
          ))}
          <span className="text-xs">※わからない場合は標準</span>
        </div>

        <div className="flex gap-2 mb-2">
          {[
            { key: 'winter', label: '冬' },
            { key: 'normal', label: '通常' },
            { key: 'summer', label: '夏' },
          ].map((b) => (
            <button
              key={b.key}
              onClick={() => setSeason(b.key)}
              className={`px-3 py-1 border rounded ${
                season === b.key ? 'bg-red-500 text-white' : 'bg-white'
              }`}
            >
              {b.label}
            </button>
          ))}
          <span className="text-xs">※わからない場合は通常</span>
        </div>

        {company === '北海道電力' && plan === 'エネとくシーズンプラス' && (
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={aircon}
              onChange={(e) => setAircon(e.target.checked)}
            />
            エアコン割引（-330円）
          </label>
        )}

        <select
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
            setPlan(companies[e.target.value][0].name);
            setAircon(false);
            setDiscounts({
              hotWaterSnow: false,
              hotWaterHeat: false,
              myHomeGen: false,
              kerosene: false,
            });
            setShowInfo({
              hotWaterSnow: false,
              hotWaterHeat: false,
              myHomeGen: false,
              kerosene: false,
            });
            
          }}
          className="w-full border p-2 mb-2"
        >
          {Object.keys(companies).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

 {company !== 'トドック電力' && (
  <select
    value={plan}
    onChange={(e) => setPlan(e.target.value)}
    className="w-full border p-2 mb-2"
  >
    {selectedPlans.map((p: any) => (
      <option key={p.name}>{p.name}</option>
    ))}
  </select>
)}

{company === 'トドック電力' && (
  <div className="mb-2">
    <select
      value={todockMenu}
      onChange={(e) =>
        setTodockMenu(e.target.value as 'basic' | 'renewable')
      }
      className="w-full border p-2 mb-2"
    >
      <option value="basic">ベーシック</option>
      <option value="renewable">再エネ</option>
    </select>

    <div className="bg-green-50 p-2 rounded">
  <p className="text-xs mb-1 font-bold">セット選択</p>

  {(
  [
    { key: 'standard', label: 'スタンダード' },
    { key: 'kerosene', label: '灯油セット' },
    { key: 'triple', label: 'トリプルセット' },
  ] as const
).map((s) => (
    <div key={s.key} className="mb-1">

      <button
        onClick={() =>
          setTodockSub(s.key as 'standard' | 'kerosene' | 'triple')
        }
        className={`px-2 py-1 mr-1 border rounded ${
          todockSub === s.key ? 'bg-green-500 text-white' : 'bg-white'
        }`}
      >
        {s.label}
      </button>

      <button
        onClick={() =>
          setShowTodockInfo(
            showTodockInfo === s.key ? null : s.key
          )
        }
        className="px-2 py-1 border rounded bg-gray-100 text-xs"
      >
        ?
      </button>

      {showTodockInfo === s.key && (
        <div className="bg-white border p-1 mt-1 text-xs">
          {todockDefs[s.key]}
        </div>
      )}

    </div>
  ))}
</div>
  </div>
)}

{company === '北ガス電気' && plan === '従量電灯Bプラス' && (
  <div className="bg-yellow-50 p-2 text-xs mb-2">
    北ガスとセットのプラン
  </div>
)}
        {company === '北ガス電気' && plan === '従量電灯Bメイト' && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            道内都市ガス事業者とセットのプラン
            <br />
            ※旭川ガス、岩見沢ガス、帯広ガス、釧路ガス、滝川ガス、苫小牧ガス、美唄ガス、室蘭ガス
          </div>
        )}
        
        {isKitagasTarget && (
  <div className="bg-orange-50 p-2 text-xs mb-2 rounded">
    <p className="font-bold mb-1">ガスセット割引</p>

    {discountDefs.map((d) => (
      <div key={d.key} className="mb-1">
        <button
          onClick={() =>
            setDiscounts({
              ...discounts,
              [d.key]: !discounts[d.key],
            })
          }
          className={`px-2 py-1 mr-1 border rounded ${
            discounts[d.key] ? 'bg-green-500 text-white' : 'bg-white'
          }`}
        >
          {d.label}（{d.rate}）
        </button>

        <button
          onClick={() =>
            setShowInfo({
              ...showInfo,
              [d.key]: !showInfo[d.key],
            })
          }
          className="px-2 py-1 border rounded bg-gray-100 text-xs"
        >
          ?
        </button>

        {showInfo[d.key] && (
          <div className="bg-white border p-1 mt-1 whitespace-pre-line">
            {d.desc}
          </div>
        )}
      </div>
    ))}
  </div>
)}
       
        {company === '北海道電力' && plan === 'エネとくシーズンプラス' && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            主に夏季の冷房用・除湿用向け料金プラン。
            <br />
            夏期間（3月～10月末）の電力量料金が割安。
          </div>
        )}

        {company === '北海道電力' && plan === 'エネとくポイントプラン' && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            従量電灯Bより基本料金が110円安い
            <br />
            電気料金200円につき1ポイント付与
          </div>
        )}

        {company === '北海道電力' && plan === 'エネとくS' && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            150kWhまで定額。超過後1kWhあたり45.44円
          </div>
        )}

        {company === '北海道電力' && plan === 'エネとくM' && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            250kWhまで定額。超過後1kWhあたり45.11円
          </div>
        )}

        {company === '北海道電力' && plan === 'エネとくL' && (
          <div className="bg-yellow-50 p-2 text-xs mb-2">
            400kWhまで定額。超過後1kWhあたり44.44円
          </div>
        )}

        {company === 'トドック電力' && (
          <div className="bg-green-100 p-2 text-xs mb-2">
            363円(税込)につきコープさっぽろポイント1pt付与
            <br />
            宅配トドックのシステム手数料220円/回が無料
          </div>
        )}

        <select
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          className="w-full border p-2 mb-2"
        >
          <option value="no">ドコモ回線なし</option>
          <option value="docomo">あり</option>
        </select>

        <select
          value={card}
          onChange={(e) => setCard(e.target.value)}
          className="w-full border p-2 mb-2"
        >
          <option value="none">カードなし</option>
          <option value="regular">dカード</option>
          <option value="gold">GOLD</option>
          <option value="platinum">PLATINUM</option>
        </select>

        {card === 'platinum' && (
          <select
            value={platinumUse}
            onChange={(e) => setPlatinumUse(e.target.value)}
            className="w-full border p-2"
          >
            <option value="low">10万未満</option>
            <option value="mid">10万以上20万未満</option>
            <option value="high">20万以上・初年度</option>
          </select>
        )}
      </div>

      <div className="bg-yellow-100 p-3 text-center mb-3 rounded">
        <p>現在：{currentCost.toFixed(0)}円/月</p>

        <p className="mt-2">
          Basic：{docomoBasic.toFixed(0)}円（dポイント充当後）
          <br />月{diffBasic.toFixed(0)}円安い / 年{(diffBasic * 12).toFixed(0)}
          円
        </p>

        <p className="mt-2">
          Green：{docomoGreen.toFixed(0)}円（dポイント充当後）
          <br />月{diffGreen.toFixed(0)}円安い / 年{(diffGreen * 12).toFixed(0)}
          円
        </p>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
  　　　※燃料調整費、再エネ賦課金、ドコモでんきセット割は計算に含まれていません。
    　</p>
　　　　</div>
  );
}
