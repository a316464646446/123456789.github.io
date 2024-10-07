let ys = {
  ba0: 0,
  ba1: 0
}
const bacost = [
  [E(2 ** 128), E(2 ** 176), E(2 ** 216), E(Infinity)],
  [E(2 ** 96), E(2 ** 160), E(Infinity)]
]

function buy_ba(n) {
  if (y2ng.y.gte(bacost[n][ys["ba" + n]])) {
    ys["ba" + n] += 1
  }
}

function display_ba(n) {
  const ba = [
    `<mo style="font-family: 'YYReset';">将每次购买乘数</mo><mo>×</mo>
<msup><mn>2</mn><mfrac><mn>1</mn><mn>32</mn></mfrac></msup>`,
    `<msup><mi>y</mi><mn>128</mn></msup>
<mo style="font-family: 'YYReset';">生成器</mo><mo>×</mo>${format(E(16))}`,
  ]
  return `<button name="ba${n}" type="button" class="ba${n}" onmousedown="buy_ba(${n})">
  <math display="block">
    <mo style="font-family: 'YYReset';">购买项</mo><mn>${n}</mn><mo>:</mo>
  </math>
  <math display="block">
    ${ba[n]}
  </math>
  <math display="block">
    <mo style="font-family: 'YYReset';">价格</mo><mo>:</mo>${format(bacost[n][ys["ba" + n]])}<mi>y</mi>
  </math>
</button>
<math display="block" class="ba${n}">
  <mo style="font-family: 'YYReset';">购买次数</mo><mo>:</mo>${format(ys["ba" + n])}
</math>`
}

function display_ys() {
  return `${display_ba(0)}
${yb.z.gte(2) ? display_ba(1) : ""}`
}

function update_ys(a = true, b = true) {
  if (!a) return;
  document.querySelector("p.main").innerHTML = display_ys()
}
