// Holds information for loading and saving.
var saveState = {}

// Holds information pertaining to the amount of every built building. See: main.updateBuildings().
var buildList = []

// Defines click income: updates the player's gold total and updates HTML.
function updateGoldClick(id)  {
  trueGold = trueGold + clickIncome
  id.innerHTML = 'Gold: ' + gold
}

// Purchases an upgrade: subtracts its cost from the player's gold total, updates click/passive income, updates HTML.
function purchaseUpgrade(id) {
  if(trueGold < upgrades[id].cost) {
    return
  }
  trueGold -= upgrades[id].cost
  clickIncome += upgrades[id].clickChange
  passiveIncome += upgrades[id].passiveChange
  upgradesPurchased[id] = true
  if(document.getElementById(upgrades[id].htmlID) != null) {
    document.getElementById(upgrades[id].htmlID).remove()
  }
  upgrades[id].effect()
}

// Purchases a building: subtracts its cost from the player's gold total, updates click/passive income, updates HTML.
function purchaseBuilding(id) {
  var buildingCost = buildings[id].baseCost * Math.pow(1.15, buildings[id].totalPurchased)
  if(trueGold < buildingCost) {
    return
  }
  trueGold -= buildingCost
  clickIncome += buildings[id].clickChange
  passiveIncome += buildings[id].passiveChange
  buildings[id].totalPurchased++
  document.getElementById(buildings[id].htmlID).innerHTML = buildings[id].updateString + (buildingCost) + ' gold<br>' + buildings[id].description
  updateBuildings(id)
}

// Updates the list of buildings that have been purchased: handles singular/plural, builds the building list, excluding null values, then updates HTML.
function updateBuildings(id) {
  if(buildings[id].totalPurchased > 1) {
    buildList[id] = buildings[id].totalPurchased + buildings[id].buildListP + '<br>'
  } else if (buildings[id].totalPurchased == 1) {
    buildList[id] = buildings[id].totalPurchased + buildings[id].buildListS + '<br>'
  }
  updateBuildingsHTML()
}

// Updates HTML of purchased buildings when a building is purchased or on game load.
function updateBuildingsHTML() {
  buildStr = ''
  for(var i = 0; i < buildList.length; i++) {
    if(buildList[i] != null) {
      buildStr += buildList[i]
      var newHTML = buildings[i].updateString + Math.trunc(buildings[i].baseCost * Math.pow(1.15, buildings[i].totalPurchased)) + ' gold<br>' + buildings[i].description
      document.getElementById(buildings[i].htmlID).innerHTML = newHTML
    }
  }
  document.getElementById('buildingList').innerHTML = buildStr
}

// Updates HTML of purchased upgrades on game load.
function updateUpgradesHTML() {
  for(var i = 0; i < upgradesPurchased.length; i++) {
    if(upgradesPurchased[i] == true && document.getElementById(upgrades[i].htmlID) != null) {
      document.getElementById(upgrades[i].htmlID).remove()
    }
  }
}

// Rebuilds building data when a new version is detected on game load.
function rebuildBuildingData() {
  for(var i = 0; i < buildings.length; i++) {
    var totalPurchased = saveState.buildings[i].totalPurchased
    clickIncome += (buildings[i].clickChange * totalPurchased)
    passiveIncome += (buildings[i].passiveChange * totalPurchased)
    buildings[i].totalPurchased = totalPurchased
    updateBuildings(i)
  }
}

// Rebuilds upgrade data when a new version is detected on game load.
function rebuildUpgradeData() {
  for(var i = 0; i < upgrades.length; i++) {
    if(saveState.upgradesPurchased[i]) {
      clickIncome += upgrades[i].clickChange
      passiveIncome += upgrades[i].passiveChange
      upgrades[i].effect()
      if(document.getElementById(upgrades[i].htmlID) != null) {
        document.getElementById(upgrades[i].htmlID).remove()
      }
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
  saveState.upgrades = upgrades
  saveState.version = version
  localStorage.setItem('save', JSON.stringify(saveState))
  console.log('Game saved.')
}

// Loads the game. Checks for a new player (if no saveState is present) or if a new version is present.
function loadGame() {
    saveState = JSON.parse(localStorage.getItem('save'))
    if(saveState == null) { // If no save is present (i.e. it's the first time the game is loaded), load nothing.
      document.getElementById('mainBody').style.display = 'block'
      return
    }
    if(version != saveState.version) {
      console.log('New version detected.')
      rebuildBuildingData()
      rebuildUpgradeData()
      updateUpgradesHTML()
      upgradesPurchased = saveState.upgradesPurchased
      gold = saveState.gold
      trueGold = saveState.trueGold
    } else {
      gold = saveState.gold
      trueGold = saveState.trueGold
      passiveIncome = saveState.passiveIncome
      clickIncome = saveState.clickIncome
      buildList = saveState.buildList
      buildings = saveState.buildings
      upgradesPurchased = saveState.upgradesPurchased
      updateBuildingsHTML()
      updateUpgradesHTML()
    }
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
