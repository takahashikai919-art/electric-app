"use client";
import { useState } from "react";

export default function Home() {
  const [kwh, setKwh] = useState<number>(300);
  const [amp, setAmp] = useState<number>(30);

  const basePrices: { [key: number]: number } = {
    30: 858,
    40: 1144,
    50: 1430,
    60: 1716,
  };

  const pricePerKwh = 31;

  const base = basePrices[amp];
  const energy = kwh * pricePerKwh;
  const total = base + energy;

  return (
    <div style={{ padding: 20 }}>
      <h1>電気料金シミュレーター</h1>

      <div>
        <label>使用量(kWh)</label><br />
        <input
          type="number"
          value={kwh}
          onChange={(e) => setKwh(Number(e.target.value))}
        />
      </div>

      <div>
        <label>アンペア</label><br />
        <select onChange={(e) => setAmp(Number(e.target.value))}>
          <option value="30">30A</option>
          <option value="40">40A</option>
          <option value="50">50A</option>
          <option value="60">60A</option>
        </select>
      </div>

      <hr />

      <h2>月額料金</h2>
      <p>{total.toFixed(0)}円</p>

      <h2>年間</h2>
      <p>{(total * 12).toFixed(0)}円</p>
    </div>
  );
}