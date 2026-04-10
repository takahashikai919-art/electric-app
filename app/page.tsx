"use client";
import { useState } from "react";

export default function Home() {
  const [kwh, setKwh] = useState<number>(300);
  const [userType, setUserType] = useState<string>("normal");

  // 北海道電力
  const base = 900;
  const tiers = [35, 41, 45];

  const calcTier = (kwh: number) => {
    if (kwh <= 120) return kwh * tiers[0];
    if (kwh <= 300) return 120 * tiers[0] + (kwh - 120) * tiers[1];
    return 120 * tiers[0] + 180 * tiers[1] + (kwh - 300) * tiers[2];
  };

  const hokkaido = base + calcTier(kwh);

  // ドコモ還元率
  const rates: any = {
    normal: { basic: 0.02, green: 0.04 },
    docomo: { basic: 0.03, green: 0.05 },
    gold: { basic: 0.03, green: 0.06 },
    platinum: { basic: 0.04, green: 0.1 },
  };

  const r = rates[userType];

  // ドコモ計算
  const docomoBasicPoints = hokkaido * r.basic;
  const docomoGreenPoints = (hokkaido + 500) * r.green;

  const docomoBasic = hokkaido - docomoBasicPoints;
  const docomoGreen = hokkaido + 500 - docomoGreenPoints;

  // 30社（簡易）
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
  ];

  // ドコモも比較に追加
  const all = [
    ...companies,
    { name: "ドコモでんき Basic", cost: docomoBasic },
    { name: "ドコモでんき Green", cost: docomoGreen },
  ];

  const sorted = all.sort((a, b) => a.cost - b.cost);
  const best = sorted[0];

  const isDocomoWin = best.name.includes("ドコモ");

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-4">
          ドコモでんき最強診断
        </h1>

        {/* 入力 */}
        <input
          type="number"
          value={kwh}
          onChange={(e) => setKwh(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded"
          placeholder="使用量 (kWh)"
        />

        <select
          onChange={(e) => setUserType(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="normal">一般</option>
          <option value="docomo">ドコモユーザー</option>
          <option value="gold">dカードGOLD</option>
          <option value="platinum">PLATINUM</option>
        </select>

        {/* 結果 */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-center">
          <p>北海道電力：{hokkaido.toFixed(0)}円</p>
          <p>Basic（実質）：{docomoBasic.toFixed(0)}円</p>
          <p>Green（実質）：{docomoGreen.toFixed(0)}円</p>
        </div>

        {/* 勝ち負け */}
        <div className="text-center mb-4">
          <h2 className={`text-xl font-bold ${isDocomoWin ? "text-green-600" : "text-red-500"}`}>
            {isDocomoWin
              ? "👉 ドコモでんきが最安です"
              : `👉 最安は ${best.name}`}
          </h2>
        </div>

        {/* 営業トーク */}
        <div className="bg-black text-white p-4 rounded text-sm">
          {isDocomoWin ? (
            <p>
              この条件だとドコモでんきが最安です。
              ポイント還元込みで実質料金が下がるので、
              切り替えるだけで毎月お得になります。
            </p>
          ) : (
            <p>
              今の条件だと最安は{best.name}ですが、
              ドコモでんきはポイント還元があるので、
              今後の使い方次第で逆転も可能です。
            </p>
          )}
        </div>

      </div>
    </div>
  );
}