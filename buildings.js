var buildings = []

var moreMaids = {
    updateString: 'More Maids: ',
    description: 'Produces 1 gold per second',
    htmlID: 'moreMaids',
    buildListS: ' maid tending to customers',
    buildListP: ' maids tending to customers',
    baseCost: 10.0,
    clickChange: 0.0,
    passiveChange: 1.0,
    totalPurchased: 0
}

buildings.push(moreMaids)

var barkeepers = {
  updateString: 'Barkeepers: ',
  description: 'Autobrews every 0.5 seconds',
  htmlID: 'barkeepers',
  buildListS: ' barkeeper slinging brew',
  buildListP: ' barkeepers slinging brew',
  baseCost: 10.0,
  clickChange: 0.0,
  passiveChange: (clickIncome/2),
  totalPurchased: 0
}

buildings.push(barkeepers)
