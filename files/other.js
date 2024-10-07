let achievement = [
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false
]
let m = [-1, 0]
const ss = [
  `<mo style="font-family: 'YYReset';">购买</mo>`,
  `<mo style="font-family: 'YYReset';">生成器</mo>`,
  `<mo style="font-family: 'YYReset';">基础值达到</mo>`,
  `<mo style="font-family: 'YYReset';">达到</mo>`,
  `<mo style="font-family: 'YYReset';">奖励</mo><mo>:</mo><mo style="font-family: 'YYReset';">解锁</mo>`,
  `<mo style="font-family: 'YYReset';">游玩</mo>`,
]
const table = [
  [
    `${ss[0]}<msup><mi>y</mi><mn>2</mn></msup>${ss[1]}`,
    `${ss[0]}<msup><mi>y</mi><mn>4</mn></msup>${ss[1]}`,
    `${ss[0]}<msup><mi>y</mi><mn>8</mn></msup>${ss[1]}`,
    `${ss[0]}<msup><mi>y</mi><mn>16</mn></msup>${ss[1]}`,
    `<msub><mi>y</mi><mn>1</mn></msub>${ss[2]}<mn>24</mn>`,
    `${ss[0]}<msup><mi>y</mi><mn>32</mn></msup>${ss[1]}`,
    `${ss[0]}<msup><mi>y</mi><mn>64</mn></msup>${ss[1]}`,
    `<msub><mi>y</mi><mn>1</mn></msub>${ss[2]}<mn>256</mn>`,
    `${ss[0]}<msup><mi>y</mi><mn>256</mn></msup>${ss[1]}<mo>    </mo>${ss[4]}
<mi>y</mi><mo style="font-family: 'YYReset';">商店</mo>`,
    `${ss[3]}<msup><mn>10</mn><mn>50</mn></msup><mi>y</mi>`,
    `${ss[5]}<mn>2000</mn><mo style="font-family: 'YYReset';">秒</mo>`,
    `${ss[0]}<mn>3</mn><mo style="font-family: 'YYReset';">次购买项</mo><mn>0</mn>`,
  ]
]
let time = E(0)
let _stop = true

function choose_(name, color, text, num) {
  return `
<button name="${name}" type="button" class="choose" onmousedown="choose[1] = ${num}"
  ${choose[1] == num ? `style="background: ` + color + `"` : ""}>
  <math display="block">
    ${text}
  </math>
</button>`
}

function display_choose2() {
  return [
    `
${choose_("y2ng", "#800000", `<msup><mi>y</mi><msup><mn>2</mn><mi>n</mi></msup></msup>
<mo style="font-family: 'YYReset';">生成器</mo>`, 0)}
${choose_("yb", "#800000", `<mi>y</mi><mo style="font-family: 'YYReset';">基础</mo>`, 1)}
${y2ng.maxy.gte(2 ** 128) ? 
  choose_("ys", "#800000", `<mi>y</mi><mo style="font-family: 'YYReset';">商店</mo>`, 2) : ""}`,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    `
${choose_("about", "#404040", `<mo style="font-family: 'YYReset';">关于</mo>`, 0)}
${choose_("achievement", "#404040", `<mo style="font-family: 'YYReset';">成就</mo>`, 1)}
${choose_("about", "#404040", `<mo style="font-family: 'YYReset';">推荐</mo>`, 2)}`,
  ][choose[0]]
}

function update_choose2() {
  document.querySelector("p.choose2").innerHTML = display_choose2()
}

function hard_reset() {
  for (let i = 0; i < 8; i++) {
    if (!confirm("确定吗")) return;
  }
  y2ng = {
    y: E(2.000000000000001),
    ym: 24,
    glevel: [E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0)],
    gen: [E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0)],
    maxy: E(2.000000000000001)
  }
  achievement = [
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false
  ]
  time = E(0)
  _stop = true
}

function ac() {
  let a = ""
  for (let i = 0; i < 12; i++) {
    a += (achievement[i] ? `
<math display="block" class="achievement">
  <mo style="font-family: 'YYReset';">成就</mo><mn>${i}</mn>
  <mo style="font-family: 'YYReset';">用时</mo>${format(achievement[i])}
  <mo style="font-family: 'YYReset';">秒</mo>
</math>
` : "")
  }
  return a
}

function display_about() {
  return `<math display="block" class="endgame" style="color: hsl(
    ${(new Date().getSeconds() % 12 + new Date().getMilliseconds() / 1000) * 30}, 
    100%, 50%)">
  <mo>Endgame:</mo>${format(E(2 ** 256))}
</math>
<button name="hard_reset" type="button" class="hard_reset" onmousedown="hard_reset()">
  <math display="block" class="endgame"><mo style="font-family: 'YYReset';">硬重置</mo></math>
</button>
<math display="block" class="changelog">
  <mo style="font-family: 'YYReset';">更新日志</mo><mo>:</mo>
</math>
<math display="block" class="changelog">
  <mn>2024</mn><mo>/</mo><mn>9</mn><mo>/</mo><mn>27</mn>
</math>
<math display="block" class="changelog">
  <mi>v</mi><mn>0</mn><mo>:</mo>
  <mo style="font-family: 'YYReset';">添加了</mo>
    <msup>
    <mi>y</mi>
    <msup>
      <mn>2</mn>
      <mi>n</mi>
    </msup>
  </msup>
  <mo style="font-family: 'YYReset';">生成器、</mo>
  <msub><mi>y</mi><mn>1</mn></msub>
  <mo style="font-family: 'YYReset';">基础值</mo>
</math>
<math display="block" class="changelog">
  <mn>2024</mn><mo>/</mo><mn>9</mn><mo>/</mo><mn>30</mn>
</math>
<math display="block" class="changelog">
  <mi>v</mi><mn>1</mn><mo>:</mo>
  <mo style="font-family: 'YYReset';">添加了</mo>
  <mi>z</mi>
  <mo style="font-family: 'YYReset';">星系、</mo>
  <mi>y</mi>
  <mo style="font-family: 'YYReset';">商店</mo>
</math>
<math display="block" class="changelog">
  <mn>2024</mn><mo>/</mo><mn>10</mn><mo>/</mo><mn>3</mn>
</math>
<math display="block" class="changelog">
  <mi>v</mi><mn>2</mn><mo>:</mo>
  <mo style="font-family: 'YYReset';">添加了购买项</mo>
  <mn>1</mn>
</math>
${ac()}`
}

function update_about(a = true, b = true) {
  if (!a) return;
  document.querySelector("p.main").innerHTML = display_about()
}

function display_achievement() {
  return `<math display="block" class="msg">
  <mo style="font-family: 'YYReset';">信息</mo><mo>:</mo>${m[0] == -1 ? "" : table[m[0]][m[1]]}
</math>
<table>
  <tbody>
    <tr>
      <td onmouseover="m = [0, 0]" ${achievement[0] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">不花钱</mo><mi>y</mi></math>
      </td>
      <td onmouseover="m = [0, 1]" ${achievement[1] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">又来一个</mo></math>
        <math display="block"><mo style="font-family: 'YYReset';">维度</mo></math>
      </td>
      <td onmouseover="m = [0, 2]" ${achievement[2] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">三个维度</mo></math>
      </td>
      <td onmouseover="m = [0, 3]" ${achievement[3] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">我们不需要</mo></math>
        <math display="block"><mo style="font-family: 'YYReset';">维度提升</mo></math>
      </td>
      <td onmouseover="m = [0, 4]" ${achievement[4] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">基础很牢</mo></math>
      </td>
      <td onmouseover="m = [0, 5]" ${achievement[5] ? `style="background: #ff0000"` : ""}>
        <math display="block"><msqrt><mn>25</mn></msqrt></math>
        <math display="block"><mo style="font-family: 'YYReset';">小时后更新</mo></math>
      </td>
      <td onmouseover="m = [0, 6]" ${achievement[6] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">第六个是</mo></math>
        <math display="block"><mo style="font-family: 'YYReset';">主要的</mo></math>
      </td>
      <td onmouseover="m = [0, 7]" ${achievement[7] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">基础达到了</mo></math>
        <math display="block"><msup><mn>2</mn><mn>8</mn></msup></math>
      </td>
      <td onmouseover="m = [0, 8]" ${achievement[8] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">八个全有了</mo></math>
      </td>
      <td onmouseover="m = [0, 9]" ${achievement[9] ? `style="background: #ff0000"` : ""}>
        <math display="block"><msqrt><mo style="font-family: 'YYReset';">古戈尔</mo></msqrt></math>
      </td>
      <td onmouseover="m = [0, 10]" ${achievement[10] ? `style="background: #ff0000"` : ""}>
        <math display="block"><mo style="font-family: 'YYReset';">时间都去</mo></math>
        <math display="block"><mo style="font-family: 'YYReset';">哪了</mo></math>
      </td>
      <td onmouseover="m = [0, 11]" ${achievement[11] ? `style="background: #ff0000"` : ""}>
        <math display="block" style="font-size: 20px;">
          <msup><mn>2</mn>
          <mrow>
            <mfrac>
              <msup><mn>3</mn><mn>3</mn></msup>
              <msup><mn>2</mn><mn>5</mn></msup>
            </mfrac>
          </mrow></msup>
        </math>
      </td>
    </tr>
  </tbody>
</table>`
}

function update_achievement(a = true, b = true) {
  if (b) {
    if (y2ng.gen[0].gte(1) && (achievement[0] == false)) achievement[0] = time;
    if (y2ng.gen[1].gte(1) && (achievement[1] == false)) achievement[1] = time;
    if (y2ng.gen[2].gte(1) && (achievement[2] == false)) achievement[2] = time;
    if (y2ng.gen[3].gte(1) && (achievement[3] == false)) achievement[3] = time;
    if (ybasic_1().gte(24) && (achievement[4] == false)) achievement[4] = time;
    if (y2ng.gen[4].gte(1) && (achievement[5] == false)) achievement[5] = time;
    if (y2ng.gen[5].gte(1) && (achievement[6] == false)) achievement[6] = time;
    if (ybasic_1().gte(256) && (achievement[7] == false)) achievement[7] = time;
    if (y2ng.gen[7].gte(1) && (achievement[8] == false)) achievement[8] = time;
    if (y2ng.y.gte(10 ** 50) && (achievement[9] == false)) achievement[9] = time;
    if (time.gte(2000) && (achievement[10] == false)) achievement[10] = time;
    if (ys.ba0 >= 3 && (achievement[11] == false)) achievement[11] = time;
  }
  if (!a) return;
  document.querySelector("p.main").innerHTML = display_achievement()
}

function rd(a, b) {
  return `<a href='${a}' class="recommendation">
  <math display="block">
    <mo style="font-family: 'YYReset';">${b}</mo>
  </math>
</a>`
}

function display_recommendation() {
  return `${rd("https://0i00000000a7.github.io/points-incremental-rewritten/", "点数增量")}
${rd("https://dlsdl.github.io/wind_spirit_creation/", "风灵作成")}
${rd("https://seanxlx2011.github.io/", "数据增量")}
${rd("https://veryrrdefine.github.io/MdVI-rewritten/", "多维体积增量")}
${rd("https://qqqe308.github.io/The-Rhythm-Game-Tree/", "音乐游戏树")}
${rd("https://aster131072.github.io/incremental_evolution/", "增量进化")}
${rd("https://hypcos.github.io/too-many-layers/", "太多层级")}
${rd("https://rg3072.github.io/anti-softcap-tree/111/", "反软上限树")}`
}

function update_recommendation(a = true, b = true) {
  if (!a) return;
  document.querySelector("p.main").innerHTML = display_recommendation()
}
