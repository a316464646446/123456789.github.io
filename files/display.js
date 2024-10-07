let FORMAT_DEBUG = 0
let MAX_LOGP1_REPEATS = 48
let LOG5E = 0.6213349345596119

function gcd(a, b) {
  if (b == 0) {
    return a
  }
  return gcd(b, a % b)
}

function commaFormat(num, precision) {
  if (num === null || num === undefined) return "NaN"
  let zeroCheck = num.array ? num.array[0][1] : num
  if (zeroCheck < 0.001) return (0).toFixed(precision)
  let init = num.toString()
  let portions = init.split(".")
  portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  return portions[0]
}

function regularFormat(num, precision) {
  if (isNaN(num)) return "NaN"
  let zeroCheck = num.array ? num.array[0][1] : num
  if (zeroCheck < 0.001) return (0).toFixed(precision)
  let fmt = num.toString()
  let f = fmt.split(".")
  if (precision == 0) return commaFormat(num.floor ? num.floor() : Math.floor(num))
  else if (f.length == 1) return fmt + "." + "0".repeat(precision)
  else if (f[1].length < precision) return fmt + "0".repeat(precision - f[1].length)
  else return f[0] + "." + f[1].substring(0, precision)
}

function polarize(array, smallTop=false) {
  if (FORMAT_DEBUG >= 1) console.log("Begin polarize: "+JSON.stringify(array)+", smallTop "+smallTop)
  if (array.length == 0) array = [[0,0]]
  
  let bottom = array[0][0] == 0 ? array[0][1] : 10, top = 0, height = 0
  if (!Number.isFinite(bottom)) {}
  else if (array.length <= 1 && array[0][0] == 0) {
    while (smallTop && bottom >= 10) {
      bottom = Math.log10(bottom)
      top += 1
      height = 1
    }
  }
  else {
    let elem = array[0][0] == 0 ? 1 : 0
    top = array[elem][1]
    height = array[elem][0]
    while (bottom >= 10 || elem < array.length || (smallTop && top >= 10)) {
      if (bottom >= 10) { // Bottom mode: the bottom number "climbs" to the top
        if (height == 1) {
            // Apply one increment
            bottom = Math.log10(bottom)
            if (bottom >= 10) { // Apply increment again if necessary
                bottom = Math.log10(bottom)
                top += 1
            }
        }
        else if (height < MAX_LOGP1_REPEATS) {
            // Apply the first two increments (one or two logs on first, one log on second)
            if (bottom >= 1e10) bottom = Math.log10(Math.log10(Math.log10(bottom))) + 2
            else bottom = Math.log10(Math.log10(bottom)) + 1
            // Apply the remaining increments
            for (i=2;i<height;i++) bottom = Math.log10(bottom) + 1
        }
        else bottom = 1 // The increment result is indistinguishable from 1
        
        top += 1
        if (FORMAT_DEBUG >= 1) console.log("Bottom mode: bottom "+bottom+", top "+top+", height "+height+", elem "+elem)
      }
      else { // Top mode: height is increased by one, or until the next nonzero value
        // Prevent running top mode more times than necessary
        if (elem == array.length-1 && array[elem][0] == height && !(smallTop && top >= 10)) break
        
        bottom = Math.log10(bottom) + top
        height += 1
        if (elem < array.length && height > array[elem][0]) elem += 1
        if (elem < array.length) {
          if (height == array[elem][0]) top = array[elem][1] + 1
          else if (bottom < 10) { // Apply top mode multiple times
            let diff = array[elem][0] - height
            if (diff < MAX_LOGP1_REPEATS) {
              for (i=0;i<diff;i++) bottom = Math.log10(bottom) + 1
            }
            else bottom = 1 // The increment result is indistinguishable from 1
            height = array[elem][0]
            top = array[elem][1] + 1
          }
          else top = 1
        }
        else top = 1
        if (FORMAT_DEBUG >= 1) console.log("Top mode: bottom "+bottom+", top "+top+", height "+height+", elem "+elem)
      }
    }
  }
  
  if (FORMAT_DEBUG >= 1) console.log("Polarize result: bottom "+bottom+", top "+top+", height "+height)
  return {bottom: bottom, top: top, height: height}
}

function arraySearch(array, height) {
  for (i=0;i<array.length;i++) {
    if (array[i][0] == height) return array[i][1]
    else if (array[i][0] > height) break
  }
  return height > 0 ? 0 : 10
}

function setToZero(array, height) {
  for (i=0;i<array.length;i++) {
    if (array[i][0] == height) break
  }
  if (i<array.length) array[i][1] = 0
}

function format(num, precision=2, small=false) {
  if (ExpantaNum.isNaN(num)) return "<mn>NaN</mn>"
  let precision2 = Math.max(3, precision)
  let precision3 = Math.max(4, precision)
  let precision4 = Math.max(6, precision)
  num = new ExpantaNum(num)
  let array = num.array
  if (num.abs().lt(1e-308)) return "<mn>" + (0).toFixed(precision) + "</mn>"
  if (num.sign < 0) return "<mo>-</mo>" + format(num.neg(), precision)
  if (num.isInfinite()) return "<mo>∞</mo>"
  if (num.lt("0.0001")) { return "<msup><mrow>" + format(num.rec(), precision) + "</mrow><mn>-1</mn></msup>" }
  else if (num.lt(1)) return "<mn>" + regularFormat(num, precision + (small ? 2 : 0)) + "</mn>"
  else if (num.lt(1000)) return "<mn>" + regularFormat(num, precision) + "</mn>"
  else if (num.lt(1e9)) return "<mn>" + commaFormat(num) + "</mn>"
  else if (num.lt("10^^5")) {
    let bottom = arraySearch(array, 0)
    let rep = arraySearch(array, 1)-1
    if (bottom >= 1e9) {
      bottom = Math.log10(bottom)
      rep += 1
    }
    let m = 10**(bottom-Math.floor(bottom))
    let e = Math.floor(bottom)
    let p = bottom < 1000 ? precision2 : 0
    return "<msup><mn>10</mn>".repeat(rep) + "<mrow><mn>" + regularFormat(m, p) + 
      "</mn><mo>×</mo><msup><mn>10</mn><mn>" + 
      commaFormat(e) + "</mn></msup></mrow>" + "</msup>".repeat(rep)
  }
  else if (num.lt("10^^1000000")) {
    let pol = polarize(array)
    return "<msup><mrow><mo>(</mo><mn>10</mn><mi>↑</mi><mo>)</mo></mrow><mn>" + 
      commaFormat(pol.top) + "</mn></msup><mn>" + regularFormat(pol.bottom, precision3) + "</mn>"
  }
  else if (num.lt("10^^^5")) {
    let rep = arraySearch(array, 2)
    if (rep >= 1) {
      setToZero(array, 2)
      return "<mn>10</mn><mo>↑↑</mo>".repeat(rep) + format(array, precision)
    }
    let n = arraySearch(array, 1) + 1
    if (num.gte("10^^" + (n + 1))) n += 1
    return "<mn>10</mn><mo>↑↑</mo>" + format(n, precision)
  }
  else if (num.lt("10^^^1000000")) {
    let pol = polarize(array)
    return "<msup><mrow><mo>(</mo><mn>10</mn><mi>↑↑</mi><mo>)</mo></mrow><mn>" + 
      commaFormat(pol.top) + "</mn></msup><mn>" + regularFormat(pol.bottom, precision3) + "</mn>"
  }
  else if (num.lt("10^^^^5")) {
    let rep = arraySearch(array, 3)
    if (rep >= 1) {
      setToZero(array, 3)
      return "<mn>10</mn><mo>↑↑↑</mo>".repeat(rep) + format(array, precision)
    }
    let n = arraySearch(array, 2) + 1
    if (num.gte("10^^^" + (n + 1))) n += 1
    return "<mn>10</mn><mo>↑↑↑</mo>" + format(n, precision)
  }
  else if (num.lt("10^^^^1000000")) {
    let pol = polarize(array)
    return "<msup><mrow><mo>(</mo><mn>10</mn><mi>↑↑↑</mi><mo>)</mo></mrow><mn>" + 
      commaFormat(pol.top) + "</mn></msup><mn>" + regularFormat(pol.bottom, precision3) + "</mn>"
  }
  else if (num.lt("10^^^^^5")) {
    let rep = arraySearch(array, 4)
    if (rep >= 1) {
      setToZero(array, 4)
      return "<mn>10</mn><mo>↑↑↑↑</mo>".repeat(rep) + format(array, precision)
    }
    let n = arraySearch(array, 3) + 1
    if (num.gte("10^^^^" + (n + 1))) n += 1
    return "<mn>10</mn><mo>↑↑↑↑</mo>" + format(n, precision)
  }
  else if (num.lt("J1000000")) {
    let pol = polarize(array, true)
    return "<mn>10</mn><msup><mi>↑</mi><mn>" + commaFormat(pol.height) + 
      "</mn></msup><mn>" + regularFormat(Math.log10(pol.bottom) + pol.top, precision4) + "</mn>"
  }
  else if (num.lt("J^4 10")) {
    let rep = num.layer
    if (rep >= 1) return "<mn>10</mn><mo>↑↟</mo>".repeat(rep) + format(array, precision)
    let n = array[array.length-1][0]
    if (num.gte("J" + (n + 1))) n += 1
    return "<mn>10</mn><mo>↑↟</mo>" + format(n, precision)
  }
  else if (num.lt("J^999999 10")) {
    let pol = polarize(array, true)
    let layerLess = new ExpantaNum(array)
    let layer = num.layer
    let topJ
    if (layerLess.lt("10^^10")) {
      topJ = 1 + Math.log10(Math.log10(pol.bottom) + pol.top)
      layer += 1
    }
    else if (layerLess.lt("10{10}10")) {
      topJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
      layer += 1
    }
    else {
      let nextToTopJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
      let bottom = nextToTopJ >= 1e10 ? Math.log10(Math.log10(nextToTopJ)) : Math.log10(nextToTopJ)
      let top = nextToTopJ >= 1e10 ? 2 : 1
      topJ = 1 + Math.log10(Math.log10(bottom) + top)
      layer += 2
    }
    return "<msup><mrow><mo>(</mo><mn>10</mn><mi>↑↟</mi><mo>)</mo></mrow><mn>" + 
      commaFormat(layer) + "</mn></msup><mn>" + regularFormat(topJ, precision4) + "</mn>"
  }
  let n = num.layer + 1
  if (num.gte("J^" + n + " 10")) n += 1
  return "<mn>10</mn><mo>↑↟↑</mo>" + format(n, precision)
}

let choose = [0, 0]

function display_y() {
  return `<math display="block" class="time">
  <mo style="font-family: 'YYReset';">你已经游玩了</mo>
  ${format(time)}
  <mo style="font-family: 'YYReset';">秒${_stop ? "，游戏已暂停" : ""}</mo>
</math>
<math display="block" class="y">
  <mo style="font-family: 'YYReset';">你有</mo>
  <mrow>${format(y2ng.y)}</mrow>
  <mi>y</mi>
  ${y2ng.y.gte(2 ** 256) ? `<mo style="font-family: 'YYReset';">，已达到硬上限</mo>` : ""}
</math>
<math display="block" class="yget">
  <mo style="font-family: 'YYReset';">你每秒获得</mo>
  ${format(speed(1))}
  <mi>y</mi>
</math>
${y2ng.y.gte(2 ** 256) ? `<math display="block" class="endgame" style="color: hsl(
  ${(new Date().getSeconds() % 12 + new Date().getMilliseconds() / 1000) * 30}, 
  100%, 50%)">
  <mo style="font-family: 'YYReset';">你已到达游戏结局</mo>
</math>` : ""}`
}

function update_y() {
  document.querySelector("p.head").innerHTML = display_y()
}

load()
save()

function update() {
  time = time.add(0.02 * +!_stop)
  update_y()
  update_choose2()
  update_y2n(choose[0] == 0 && choose[1] == 0, !_stop)
  update_yb(choose[0] == 0 && choose[1] == 1, !_stop)
  update_ys(choose[0] == 0 && choose[1] == 2, !_stop)
  update_about(choose[0] == 8 && choose[1] == 0)
  update_achievement(choose[0] == 8 && choose[1] == 1, !_stop)
  update_recommendation(choose[0] == 8 && choose[1] == 2, !_stop)
  setTimeout(update, 20)
}

setTimeout(update, 40)
