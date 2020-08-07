// Holds information for loading and saving.
var saveState = {}

// Holds information pertaining to the amount of every built building. See: updateBuildings().
var buildList = []

// Tracks all purchased upgrades.
var upgradesPurchased = []

var gold = 0.0
var trueGold = 0.0 // 'gold' is truncated in the game loop whereas 'trueGold' isn't.
var passiveIncome = 0.0
var clickIncome = 1.0

// Dictionary containing all the necessary attributes for buildings. Structure: [0] = updateString (for properly updating HTML), [1] = building description,
// [2] = cost, [3] = clickChange (change in click income), [4] = passiveChange (change in passive income), [5] = htmlID (for lookup by ID from the HTML document),
// [6] = totalPurchased (amount that building's been purchased), [7] = buildListS (a string defining how one building should be shown in the HTML building list),
// [8] = buildListP (a string defining how multiple of that building should be shown in the HTML building list).
var buildings = [
  { updateString: 'More Maids: ', buildingDescription: 'Increases passive income by 1', cost: 10.0, clickChange: 0.0, passiveChange: 1.0, htmlID: 'moreMaids',
  totalPurchased: 0, buildListS: ' maid tending to customers', buildListP: ' maids tending to customers' }, // moreMaids, id = 0.
  { updateString: 'Barkeepers: ', buildingDescription: 'Autoclicks every 0.5 seconds', cost: 10.0, clickChange: 0.0, passiveChange: (clickIncome/2.0),
  htmlID: 'barkeepers', totalPurchased: 0, buildListS: ' barkeeper slinging brew', buildListP: ' barkeepers slinging brew'} // barkeepers, id = 1.
]

// Dictionary containing all the necessary attributes for buildings. Structure: [0] = cost, [1] = clickChange (change in click income),
// [2] = passiveChange (change in passive income), [3] = htmlID (for lookup by ID from the HTML document)
// [4] = relation (defines a function if a particular upgrade has an impact on something else).
var upgrades = [
  { cost: 15.0, clickChange: 1.0, passiveChange: 0.0, htmlID: 'biggerMugs', relation: function() {
      passiveIncome -= (buildings[1].totalPurchased * buildings[1].passiveChange)
      buildings[1].passiveChange *= 2
      passiveIncome += (buildings[1].totalPurchased * buildings[1].passiveChange)
  }}, // biggerMugs, id = 0.
  { cost: 50.0, clickChange: 0.0, passiveChange: 0.0, htmlID: 'bustierMaids', relation: function() {
      passiveIncome -= (buildings[0].totalPurchased * buildings[0].passiveChange)
      buildings[0].passiveChange *= 1.25
      passiveIncome += (buildings[0].totalPurchased * buildings[0].passiveChange)
  }} // bustierMaids, id = 1.
]

// Defines click income: updates the player's gold total and updates HTML.
function updateGoldClick(id)  {
  trueGold = trueGold + clickIncome
  id.innerHTML = 'Gold: ' + gold
}

// Purchases an upgrade: subtracts its cost from the player's gold total, updates click/passive income, updates HTML.
function purchaseUpgrade(id) {
  if(trueGold < upgrades[id].cost) return
  trueGold -= upgrades[id].cost
  clickIncome += upgrades[id].clickChange
  passiveIncome += upgrades[id].passiveChange
  upgradesPurchased[id] = true
  document.getElementById(upgrades[id].htmlID).remove()
  upgrades[id].relation()
}

// Purchases a building: subtracts its cost from the player's gold total, updates click/passive income, updates the building's cost, updates HTML,
// increments the amount of times the building has been purchased.
function purchaseBuilding(id) {
  if(trueGold < buildings[id].cost) {
    return
  }
  trueGold -= buildings[id].cost
  clickIncome += buildings[id].clickChange
  passiveIncome += buildings[id].passiveChange
  buildings[id].cost = Math.trunc(buildings[id].cost * 1.2)
  document.getElementById(buildings[id].htmlID).innerHTML = buildings[id].updateString + (buildings[id].cost) + ' gold<br>' + buildings[id].buildingDescription
  updateBuildings(id)
}

// Updates the list of buildings that have been purchased: increments the total amount of that building purchased, handles singular/plural, builds the
// building list, excluding null values, then updates HTML.
function updateBuildings(id) {
  buildings[id].totalPurchased++
  if(buildings[id].totalPurchased > 1) {
    buildList[id] = buildings[id].totalPurchased + buildings[id].buildListP + '<br>'
  } else {
    buildList[id] = buildings[id].totalPurchased + buildings[id].buildListS + '<br>'
  }
  updateBuildingsHTML()
}

// Updates HTML of purchased buildings on game load.
function updateBuildingsHTML() {
  buildStr = ''
  for(var i = 0; i < buildList.length; i++) {
    if(buildList[i] != null) {
      buildStr += buildList[i]
      document.getElementById(buildings[i].htmlID).innerHTML = buildings[i].updateString + (buildings[i].cost) + ' gold<br>' + buildings[i].buildingDescription
    }
  }
  document.getElementById('buildingList').innerHTML = buildStr
}

// Updates HTML of purchased upgrades on game load.
function updateUpgradesHTML() {
  for(var i = 0; i < upgradesPurchased.length; i++) {
    if(upgradesPurchased[i] == true) {
      document.getElementById(upgrades[i].htmlID).remove()
    }
  }
}

// Saves the game.
function saveGame() {
  saveState.gold = gold
  saveState.trueGold = trueGold
  saveState.passiveIncome = passiveIncome
  saveState.clickIncome = clickIncome
  saveState.buildList = buildList
  saveState.buildings = buildings
  saveState.upgradesPurchased = upgradesPurchased
  localStorage.setItem('save', JSON.stringify(saveState))
  console.log('Game saved.')
}

// Loads the game.
function loadGame() {
    saveState = JSON.parse(localStorage.getItem('save'))
    // If no save is present (i.e. it's the first time the game is loaded), load nothing.
    if(saveState == null) {
      document.getElementById('mainBody').style.display = 'block'
      return
    }
    gold = saveState.gold
    trueGold = saveState.trueGold
    passiveIncome = saveState.passiveIncome
    clickIncome = saveState.clickIncome
    buildList = saveState.buildList
    buildings = saveState.buildings
    upgradesPurchased = saveState.upgradesPurchased
    updateBuildingsHTML()
    updateUpgradesHTML()
    if(buildList.length == 0) {
      document.getElementById('buildingList').innerHTML = 'No buildings or employees currently purchased.'
    }
    // Unused until needed
    // document.getElementById('loading').style.display = 'none'
    document.getElementById('mainBody').style.display = 'block'
}

// Deletes save data and reloads the page.
function deleteSave() {
  localStorage.setItem('save', JSON.stringify(null))
  location.reload()
}

function deleteSaveConfirmation() {
  modal = document.getElementById('deleteSaveModal')
  modal.style.display = 'block'

  document.getElementById('deleteSaveSpan').onclick = function() {
    closeDeleteSaveModal()
  }

  document.getElementById('deleteSpanNoButton').onlclick = function() {
    closeDeleteSaveModal()
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      closeDeleteSaveModal()
    }
  }
}

function closeDeleteSaveModal() {
  document.getElementById('deleteSaveModal').style.display = 'none'
}

// Game loop.
setInterval(function() {
  // Passive gold income: updates once a frame, 'trueGold' holds the real gold total, 'gold' is truncated to make the display look prettier.
  // If performance suffers, I think I should change the interval (from once a frame to something else).
  trueGold = trueGold + (passiveIncome/60.0)
  gold = Math.trunc(trueGold)
  document.getElementById('money').innerHTML = 'Gold: ' + gold
}, 16.67)

// Saves the game every 10 seconds.
// Current elements saved: gold, trueGold, passiveIncome, clickIncome, buildingList,
// buildings [internal building info], upgradesPurchased.
setInterval(function() {
  if(saveState != null) {
    saveGame()
  }
  else {
    saveState = {}
    saveGame()
  }
}, 10000)