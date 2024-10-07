function TransformToE(object) {
  for (p in object) {
    if (typeof object[p] != "object") {
      continue
    }
    try {
      object[p] = E(object[p])
    } catch (err) {
      TransformToE(object[p])
    }
  }
}

function player() {
  return {
    y2ng: y2ng,
    yb: yb,
    ys: ys,
    achievement: achievement,
    time: time,
    _stop: _stop
  }
}

function save() {
  localStorage.setItem("YYReset", JSON.stringify(player()))
  setTimeout(save, 20)
}

function property(a, b) {
  for (let p in b) {
    a[p] = b[p]
  }
}

function load() {
  let player_ = JSON.parse(localStorage.getItem("YYReset"))
  TransformToE(player_)
  if (player_) {
    if (player_.y2ng) {
      property(y2ng, player_.y2ng)
    }
    if (player_.yb) {
      property(yb, player_.yb)
    }
    if (player_.ys) {
      property(ys, player_.ys)
    }
    if (player_.achievement) {
      achievement = player_.achievement
    }
    if (player_.time) {
      time = player_.time
    }
    if (player_._stop) {
      _stop = player_._stop
    }
  }
}
