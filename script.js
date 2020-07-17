var gold = 0.0;
var trueGold = 0.0; // 'gold' is truncated in the game loop whereas 'trueGold' isn't.
var passiveIncome = 0.0;
var clickIncome = 1.0;
var buildListDefault = true;

// Dictionary containing all the necessary attributes for buildings. Structure: [0] = updateString (for properly updating HTML), [1] = building description,
// [2] = cost, [3] = clickChange (change in click income), [4] = passiveChange (change in passive income), [5] = htmlID (for lookup by ID from the HTML document),
// [6] = totalPurchased (amount that building's been purchased), [7] = buildList (a string defining how the building should be shown in the HTML building list).
var buildings = [
  { updateString: 'More Maids: ', buildingDescription: 'Increases passive income by 1', cost: 20.0, clickChange: 0.0, passiveChange: 1.0, htmlID: 'moreMaids',
  totalPurchased: 0, buildList: ' maids tending to customers' } // moreMaids, id = 0.
];

// Dictionary containing all the necessary attributes for buildings. Structure: [0] = cost, [1] = clickChange (change in click income),
// [2] = passiveChange (change in passive income), [3] = htmlID (for lookup by ID from the HTML document)
// [4] = relation (defines a function if a particular upgrade has an impact on something else).
var upgrades = [
  { cost: 15.0, clickChange: 1.0, passiveChange: 0.0, htmlID: 'biggerMugs', relation: function(){return;} }, // biggerMugs, id = 0.
  { cost: 50.0, clickChange: 0.0, passiveChange: 0.0, htmlID: 'bustierMaids', relation: function() {
      passiveIncome -= (buildings[0].totalPurchased * buildings[0].passiveChange);
      buildings[0].passiveChange *= 1.25;
      passiveIncome += (buildings[0].totalPurchased * buildings[0].passiveChange)
  }} // bustierMaids, id = 1.
];

function testFunction() {
  console.log('hi');
}

// Defines click income.
function updateGoldClick(id)  {
  trueGold = trueGold + clickIncome;
  id.innerHTML = 'Gold: ' + gold;
}

// Purchases an upgrade: subtracts its cost from the player's gold total, updates click/passive income, updates HTML.
function purchaseUpgrade(id) {
  if(trueGold < upgrades[id].cost) return;
  trueGold -= upgrades[id].cost;
  clickIncome += upgrades[id].clickChange;
  passiveIncome += upgrades[id].passiveChange;
  document.getElementById(upgrades[id].htmlID).remove();
  upgrades[id].relation();
}

// Purchases a building: subtracts its cost from the player's gold total, updates click/passive income, updates the building's cost, updates HTML,
// increments the amount of times the building has been purchased.
function purchaseBuilding(id) {
  if(trueGold < buildings[id].cost) return;
  trueGold -= buildings[id].cost;
  clickIncome += buildings[id].clickChange;
  passiveIncome += buildings[id].passiveChange;
  buildings[id].cost = Math.trunc(buildings[id].cost * 1.2);
  document.getElementById(buildings[id].htmlID).innerHTML = buildings[id].updateString + (buildings[id].cost) + ' gold<br>' + buildings[id].buildingDescription;
  buildings[id].totalPurchased++;
}

function updateBuildList() {
}

// Game loop.
setInterval(function() {
  // Passive gold income: updates once a frame, 'trueGold' holds the real gold total, 'gold' is truncated to make the display look prettier.
  trueGold = trueGold + (passiveIncome/60.0);
  gold = Math.trunc(trueGold);
  document.getElementById('money').innerHTML = 'Gold: ' + gold;
}, 16.67);
