var upgrades          = []
var upgradesPurchased = []

var biggerMugs = {
  htmlID: 'biggerMugs',
  cost: 15.0,
  clickChange: 1.0,
  passiveChange: 0.0,
  id: 0,
  effect: function() {
      // Applies the change in clickIncome to already purchased buildings that rely on clickIncome
      // Current buildings affected: bartenders
      passiveIncome -= (buildings[1].totalPurchased * buildings[1].passiveChange)
      buildings[1].passiveChange *= 2
      passiveIncome += (buildings[1].totalPurchased * buildings[1].passiveChange)
  }
}

upgrades.push(biggerMugs)

var bustierMaids = {
  htmlID: 'bustierMaids',
  cost: 50.0,
  clickChange: 0.0,
  passiveChange: 0.0,
  id: 1,
  effect: function() {
      passiveIncome -= (buildings[0].totalPurchased * buildings[0].passiveChange)
      buildings[0].passiveChange *= 1.25
      passiveIncome += (buildings[0].totalPurchased * buildings[0].passiveChange)
  }
}

upgrades.push(bustierMaids)
