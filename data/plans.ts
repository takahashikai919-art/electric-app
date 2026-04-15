export const plansData: any = {
  "北海道電力": {
    plans: [
      {
        name: "従量電灯B",
        base: {20:759,30:1138,40:1518,50:1897,60:2277},
        tiers: [
          { upTo:120, rate:35 },
          { upTo:300, rate:41 },
          { upTo:Infinity, rate:45 },
        ],
        feature: "一般家庭向けの標準プラン",
        pros: ["料金体系がシンプル", "多くの家庭で利用"],
        cons: ["使用量が多いと割高"]
      },
      {
        name: "エネとくシーズンプラス",
        base: {30:1138,40:1518,50:1897,60:2277},
        tiers: [
          { upTo:120, rate:33 },
          { upTo:300, rate:39 },
          { upTo:Infinity, rate:43 },
        ],
        feature: "季節変動型で割安になるプラン",
        pros: ["使用量が多いと安い"],
        cons: ["料金が読みにくい"]
      },
    ],
  },

  "北ガス電気": {
    plans: [
      {
        name: "従量電灯B",
        base: {30:1100,40:1480,50:1860,60:2240},
        tiers: [
          { upTo:120, rate:34 },
          { upTo:300, rate:40 },
          { upTo:Infinity, rate:44 },
        ],
        feature: "標準的な家庭向けプラン",
        pros: ["切替しやすい"],
        cons: ["大幅な節約は難しい"]
      },
      {
        name: "ガスセット",
        base: {30:1000,40:1400,50:1800,60:2200},
        tiers: [
          { upTo:120, rate:33 },
          { upTo:300, rate:39 },
          { upTo:Infinity, rate:43 },
        ],
        feature: "ガスとセットで安くなる",
        pros: ["ガス利用者に有利"],
        cons: ["単体だと微妙"]
      },
    ],
  },

  "コープでんき": {
    plans: [
      {
        name: "標準プラン",
        base: {30:1100,40:1500,50:1900,60:2300},
        tiers: [
          { upTo:120, rate:34 },
          { upTo:300, rate:40 },
          { upTo:Infinity, rate:44 },
        ],
        feature: "安心志向の電力",
        pros: ["信頼性が高い"],
        cons: ["最安ではない"]
      },
    ],
  },

  "ドコモでんき": {
    plans: [
      {
        name: "Basic",
        type: "docomoBasic",
        feature: "ポイント還元型",
        pros: ["dポイント付与"],
        cons: ["料金自体は最安でない場合あり"]
      },
      {
        name: "Green",
        type: "docomoGreen",
        feature: "高還元＋再エネ",
        pros: ["還元率が高い"],
        cons: ["+500円あり"]
      },
    ],
  },

  // 簡易30社
  "Looopでんき": { plans:[{ name:"スマート", flat:30, feature:"基本料なし", pros:["シンプル"], cons:["変動リスク"] }] },
  "ENEOSでんき": { plans:[{ name:"Vプラン", rate:0.98, feature:"車連携", pros:["ガソリン割"], cons:["単体弱い"] }] },
  "楽天でんき": { plans:[{ name:"シンプル", flat:30, feature:"楽天連携", pros:["ポイント"], cons:["単価高め"] }] },
};