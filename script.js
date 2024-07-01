async function fetchJsonFile(filename) {
    const response = await fetch(filename);
    const data = await response.json();
    return data.objects; // Return the 'objects' array
}

let searchArray = [];

// Create a table to display the zombie's properties
let table = document.createElement('table');
table.id = 'zombieTable'; // Add an id to the table


function adjustResultsWidth() {
    let search = document.getElementById('search');
    let results = document.getElementById('results');

    // Set the width of the results div to match the width of the search input
    results.style.width = window.getComputedStyle(search).width;

    // Add an event listener to adjust the width of the results div whenever the window is resized
    window.addEventListener('resize', function() {
        results.style.width = window.getComputedStyle(search).width;
        });
        }
        
const inputElement = document.querySelector('input'); // Replace with your actual input element
inputElement.addEventListener('keyup', function(event) {
    if (event.key === 'Escape') {
        // Call your hideResults() function here
        hideResults();
    }
});

let resultsDiv = document.getElementById('results');
function hideResults() {
    resultsDiv.style.display = 'none';
}

function handleClick(alias, resultsDiv, zombieTypesData, zombiePropertiesObjectsData) {
    resultsDiv.style.display = 'none'; // Hide the results div

    // Remove the existing table if it exists
    let existingTable = document.getElementById('zombieTable');
    if (existingTable) existingTable.remove();

    // Search for the selected zombie in ZombieTypes and ZombieProperties
    let zombieType = zombieTypesData.find(z => z.aliases.includes(alias));
    let zombieProperty = zombiePropertiesObjectsData.find(p => p.aliases.includes(zombieType.objdata.Properties.slice(zombieType.objdata.Properties.indexOf('(') + 1, zombieType.objdata.Properties.indexOf('@'))));

    // Call the createTable function
    createTable(alias, zombieType, zombieProperty);
}



        
function showResults() {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    // Create a new anchor for each alias and append it to the results div
    for (let alias of searchArray) {
        let a = document.createElement('a');
        a.textContent = alias;
        a.href = '#'; // Prevent the page from refreshing when the link is clicked
        a.onclick = function() {
            handleClick(alias, resultsDiv, zombieTypesData, zombiePropertiesObjectsData);
            return false; // Prevent the default action
        };
        resultsDiv.appendChild(a);

        // Add a line break after each alias
        let br = document.createElement('br');
        resultsDiv.appendChild(br);
    }

    resultsDiv.style.display = 'block'; // Show the results div
}

function searchAliases() {
    let input = document.getElementById('search').value.toLowerCase();
    let resultsDiv = document.getElementById('results');
    resultsDiv.focus();

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Filter aliases based on input
    for (let alias of searchArray) {
        if (alias.toLowerCase().includes(input)) {
            // Create a new anchor for each matching alias and append it to the results div
            let a = document.createElement('a');
            a.textContent = alias;
            a.href = '#'; // Prevent the page from refreshing when the link is clicked
            // Modify the onclick function in showResults
            a.onclick = function() {
                handleClick(alias, resultsDiv, zombieTypesData, zombiePropertiesObjectsData);
                return false; // Prevent the default action
            };

            resultsDiv.appendChild(a);

            // Add a line break after each alias
            let br = document.createElement('br');
            resultsDiv.appendChild(br);
        }
    }

    // Show or hide results div based on whether there are any results
    resultsDiv.style.display = resultsDiv.hasChildNodes() ? 'block' : 'none';
}


function objdataHandling(object,table){
    Object.keys(object).forEach(attr => {
        if (!bannedAttributes.includes(attr)) {
            let tr = document.createElement('tr');
            if (typeof object[attr] === 'object' && object[attr] !== null) {
                for (let nestedAttr in object[attr]) {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    td1.textContent = attr + ' ' + nestedAttr;
                    tr.appendChild(td1);
                    let td2 = document.createElement('td');
                    let input;
                    if (typeof object[attr][nestedAttr] === 'boolean') {
                        input = document.createElement('input');
                        input.type = 'checkbox';
                        input.checked = object[attr][nestedAttr];
                        input.onchange = function() {
                            object[attr][nestedAttr] = input.checked;
                        };
                    } else {
                        input = document.createElement('input');
                        if (typeof object[attr][nestedAttr] === 'number')
                            {
                                input.type = 'number';
                            }
                        input.placeholder = object[attr][nestedAttr];
                        input.onchange = function() {
                            object[attr][nestedAttr] = isNaN(input.value) ? input.value : Number(input.value);
                        };
                    }
                    td2.appendChild(input);
                    tr.appendChild(td2);
                    table.appendChild(tr);
                }
            } else {
                let td1 = document.createElement('td');
                td1.textContent = attr;
                tr.appendChild(td1);
                let td2 = document.createElement('td');
                let input;
                if (typeof object[attr] === 'boolean') {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = object[attr];
                    input.onchange = function() {
                        object[attr] = input.checked;
                    };
                } else {
                    input = document.createElement('input');
                    input.placeholder = object[attr];
                    if (typeof object[attr] === 'number'){
                        input.type = 'number';
                    }
                    input.onchange = function() {
                        object[attr] = isNaN(input.value) ? input.value : Number(input.value);
                    };
                }                
                td2.appendChild(input);
                td2.appendChild(input);
                tr.appendChild(td2);

                table.appendChild(tr);
            }
        }
    });
}

let conditionImmunitiesObject = [];

function removeCondition(condition){
    debugger;
    let temp = [];
    conditionImmunitiesObject.forEach(i => {
        if (condition != i.Condition){
            temp.push(i);
        }
    })
    conditionImmunitiesObject = temp;
}

function conditionFunction(table){
    let allConditions = ["chill","freeze","stun","unsuspendable","stalled","sapped","butter","decaypoison","shrinking","shrunken","gummed","dazeystunned","stackableslow","hypnotized","potiontoughness1","potiontoughness2","potiontoughness3","speeddown1","speeddown2","speeddown3","potionspeed1","potionspeed2","potionspeed3","terrified","hungered","potionsuper1","potionsuper2","potionsuper3","stickybombed","suncarrier50","suncarrier100","suncarrier250"];
    let immuneToSlow = allConditions.slice(0, allConditions.indexOf('potiontoughness1'));
    let immuneToPotions = allConditions.slice(allConditions.indexOf('potiontoughness1') + 1);
    let trConditionImmunities = document.createElement('tr');
    let tdConditionImmunitiesLabel = document.createElement('td');
    tdConditionImmunitiesLabel.textContent = 'ConditionImmunities';
    trConditionImmunities.appendChild(tdConditionImmunitiesLabel);
    let tdConditionImmunitiesSelect = document.createElement('td');
    let selectConditionImmunities = document.createElement('select');
    selectConditionImmunities.oninput = function() {
        let selectedCondition = selectConditionImmunities.value;
        if (selectedCondition === "-") return;

        let input = document.createElement('input');
        if (immuneToSlow.includes(selectedCondition)) {
            input.classList.add('immuneToSlow');
        } else {
            input.classList.add('immuneToPotions');
        }
        input.type = 'number';
        input.min = 0;
        input.style.width = '30px';
        input.value = 1;
        input.dataset.condition = selectedCondition; // Store the condition in a data attribute
        input.onchange = function() {
            let conditionImmunity = conditionImmunitiesObject.find(ci => ci.Condition === selectedCondition);
            conditionImmunity.Percent = Number(input.value);
        };

        conditionImmunitiesObject.push({ Condition: selectedCondition, Percent: 1 });

        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.textContent = selectedCondition;
        tr.appendChild(td1);
        let td2 = document.createElement('td');
        let buttonRemove = document.createElement('button');
        buttonRemove.textContent = 'Remove condition';
        buttonRemove.classList.add('red');
        buttonRemove.dataset.condition = selectedCondition; //  Store the condition in a data attribute
        buttonRemove.onclick = function() {
            console.log(selectedCondition);
            removeCondition(selectedCondition);
            table.removeChild(tr);
        };

        td2.appendChild(input);
        td2.appendChild(buttonRemove);
        tr.appendChild(td2);
        tr.id = 'condition row';
        table.insertBefore(tr, trConditionImmunities.nextSibling);
    };

    let option = document.createElement('option');
    option.value = "";
    option.textContent = "-";
    option.defaultSelected = true; // Default selected
    option.hidden = true; // Hidden
    selectConditionImmunities.insertBefore(option, selectConditionImmunities.firstChild);
    allConditions.forEach(condition => {
        option = document.createElement('option');
        option.value = condition;
        option.textContent = condition;
        selectConditionImmunities.appendChild(option);
    });
    tdConditionImmunitiesSelect.appendChild(selectConditionImmunities);
    trConditionImmunities.appendChild(tdConditionImmunitiesSelect);
    table.appendChild(trConditionImmunities);
    let trButtons = document.createElement('tr');
    let tdButtons = document.createElement('td');
    tdButtons.colSpan = 2;
    let buttonSlow = document.createElement('button');
    buttonSlow.textContent = 'Immune to plants\' conditions';
    buttonSlow.onclick = function() {
        immuneToSlow.forEach(condition => {
            let conditionImmunity = conditionImmunitiesObject.find(ci => ci.Condition === condition);
            if (conditionImmunity) {
                conditionImmunity.Percent = 0;
                // Change the value of all input fields with the corresponding class
                let inputs = document.querySelectorAll('.immuneToSlow');
                inputs.forEach(input => {
                    input.value = 0;
                });
            } else {
                conditionImmunitiesObject.push({ Condition: condition, Percent: 0 });
            }
        });
    };
    tdButtons.appendChild(buttonSlow);
    let buttonPotions = document.createElement('button');
    buttonPotions.textContent = 'Immune to potions';
    buttonPotions.onclick = function() {
        immuneToPotions.forEach(condition => {
            let conditionImmunity = conditionImmunitiesObject.find(ci => ci.Condition === condition);
            if (conditionImmunity) {
                conditionImmunity.Percent = 0;
                // Change the value of all input fields with the corresponding class
                let inputs = document.querySelectorAll('.immuneToPotions');
                inputs.forEach(input => {
                    input.value = 0;
                });
            } else {
                conditionImmunitiesObject.push({ Condition: condition, Percent: 0 });
            }
        });
    };
    tdButtons.appendChild(buttonPotions);
    let buttonAll = document.createElement('button');
    buttonAll.textContent = 'all 0';
    buttonAll.onclick = function() {
        allConditions.forEach(condition => {
            if (!conditionImmunitiesObject.find(ci => ci.Condition === condition)) {
                conditionImmunitiesObject.push({ Condition: condition, Percent: 0 });
            }
            // Change the value of all input fields
            let inputs = document.querySelectorAll('.immuneToSlow, .immuneToPotions');
            inputs.forEach(input => {
                input.value = 0;
            });
        });
    };
    tdButtons.appendChild(buttonPotions);
    let all1 = document.createElement('button');
    all1.textContent = 'all 1';
    all1.onclick = function() {
        conditionImmunitiesObject = [];
        let rows = document.querySelectorAll(`#zombieTable tr[id="condition row"]`);
        rows.forEach(row => row.remove());
    };
    
    tdButtons.appendChild(all1);
    tdButtons.appendChild(buttonAll);
    trButtons.appendChild(tdButtons);
    table.appendChild(trButtons);
}

let listOfObjects = new Array(2);

function pushObject(object,index){
    listOfObjects[index] = (JSON.stringify(object, null, 2));
}

function rtid(value,object2){
    object2[0] = value;
    return `RTID(${value}@.)`;
}

let zombieAction;
function handleAction(table,zombieProperty,index = 0){
    listOfObjects = new Array(2 + zombieProperty.objdata.Actions.length);
    let actionTr = document.createElement('tr');
    let actionTh = document.createElement('th');
    let actionAlias = zombieProperty.objdata.Actions[index];
    zombieAction = zombieActionsData.find(p => p.aliases.includes(actionAlias.slice(actionAlias.indexOf('(') + 1,actionAlias.indexOf('@'))));
    actionTh.textContent = zombieAction.aliases[0];
    actionTh.colSpan = 2;
    actionTr.appendChild(actionTh);
    let inputRow = document.createElement('tr');
    let inputLabel = document.createElement('td');
    inputLabel.textContent = 'Action alias';
    let inputContainer = document.createElement('td');
    let inputField = document.createElement('input');
    inputField.onchange = function() {
        actionTh.textContent = inputField.value;
        if (zombieProperty.objclass === 'ZombieCarnieMagicianProps') {
            zombieProperty.objdata.Actions[index] = rtid(inputField.value, magicianObjects[index].aliases);
        }
        else zombieProperty.objdata.Actions[index] = rtid(inputField.value,zombieAction.aliases);
    }
    inputField.placeholder = zombieAction.aliases[0];
    inputContainer.appendChild(inputField);
    inputRow.appendChild(inputLabel);
    inputRow.appendChild(inputContainer);
    table.appendChild(actionTr);
    table.appendChild(inputRow);
    if (zombieProperty.objclass === 'ZombieCarnieMagicianProps'){
        objdataHandling(magicianObjects[index].objdata, table);
    }
    else objdataHandling(zombieAction.objdata,table);
}

function createCell(cellType,cellComponent){
    let temp = document.createElement(`${cellType}`);
    temp.appendChild(cellComponent);
    return temp;
}

function createOptions(arr) {
    const selectElement = document.createElement('select');

    arr.forEach((value) => {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = value;
        selectElement.appendChild(optionElement);
    });

    return selectElement;
}

let magicianObjects = new Array(3);
function simulateSelectOptions() {
    // Get the select input elements by their IDs
    var selectInput1 = document.getElementById('selectInput1');
    var selectInput2 = document.getElementById('selectInput2');
    var selectInput3 = document.getElementById('selectInput3');

    // Check if the elements exist
    if (selectInput1 && selectInput2 && selectInput3) {
        // Set the selected index for each select input
        selectInput1.selectedIndex = 1; // First option (index 0)
        selectInput2.selectedIndex = 2; // Second option (index 1)
        selectInput3.selectedIndex = 3; // Third option (index 2)

        // Trigger the change event if needed
        var event = new Event('change');
        selectInput1.dispatchEvent(event);
        selectInput2.dispatchEvent(event);
        selectInput3.dispatchEvent(event);
    } else {
        console.error("One or more select elements not found");
    }
}

let impType = [
    'ImpType',
    'SpawnImpType',
    'ChickenTypeName'
];

function findValueByKey(lists, keyToFind) {
    for (const list of lists) {
        if (list.alias === keyToFind) {
            return list.group;
        }
    }
    return null; // Key not found
}

function createTable(alias, zombieType, zombieProperty) {
    zombieProperty.objdata.ConditionImmunities = [];
    let table = document.createElement('table');
    table.id = 'zombieTable';
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.colSpan = 2;
    th.textContent = alias;
    tr.appendChild(th);
    table.appendChild(tr);
    let trCodeName = document.createElement('tr');
    let tdCodeNameLabel = document.createElement('td');
    tdCodeNameLabel.textContent = 'Code Name';
    trCodeName.appendChild(tdCodeNameLabel);
    let tdCodeNameInput = document.createElement('td');
    let inputCodeName = document.createElement('input');
    inputCodeName.value = zombieType.aliases[0];
    inputCodeName.onchange = function() {
        zombieType.aliases[0] = inputCodeName.value;
        th.textContent = inputCodeName.value;
    };
    tdCodeNameInput.appendChild(inputCodeName);
    trCodeName.appendChild(tdCodeNameInput);
    table.appendChild(trCodeName);
    let trProps = document.createElement('tr');
    let tdPropsLabel = document.createElement('td');
    tdPropsLabel.textContent = 'Props';
    trProps.appendChild(tdPropsLabel);
    let tdPropsInput = document.createElement('td');
    let inputProps = document.createElement('input');
    inputProps.value = zombieType.objdata.Properties.slice(zombieType.objdata.Properties.indexOf('(') + 1, zombieType.objdata.Properties.indexOf('@'));
    inputProps.onchange = function() {
        zombieType.objdata.Properties = rtid(inputProps.value,zombieProperty.aliases);
    };
    tdPropsInput.appendChild(inputProps);
    trProps.appendChild(tdPropsInput);
    table.appendChild(trProps);
    objdataHandling(zombieProperty.objdata,table);
    for (const key of impType) {

        if (zombieProperty.objdata.hasOwnProperty(key)) {

        let select = createOptions(massiveTypeList);
        select.value = zombieProperty.objdata[key];
        select.onchange = function () {
            zombieProperty.objdata[key] = select.value;
            debugger;
            let resource = findValueByKey(resourceGroups,select.value);
            let audio = findValueByKey(audioGroups,select.value);
            zombieType.objdata.ResourceGroups.push(...resource);
            zombieType.objdata.AudioGroups.push(...audio);
        }
        let label = document.createElement('label');
        label.textContent = key;
        let header = createCell('td', label);
        let data = createCell('td', select);
        let row = document.createElement('tr')
        row.appendChild(header);
        row.appendChild(data);
        table.appendChild(row);
        break;
        } else {
            console.log(`${key} does not exist in myObject.`);
        }
    }
    if ("JamStyle" in zombieProperty.objdata){
        let select = createOptions([
            "jam_ballad",
            "jam_metal",
            "jam_pop",
            "jam_8bit",
            "jam_rap",
            "jam_punk"
        ]);
        select.value = zombieProperty.objdata.JamStyle; 
        select.onchange = function () {
            zombieProperty.objdata.JamStyle = select.value;
        }
        let label = document.createElement('label');
        label.textContent = 'jam';
        let header = createCell('td',label);
        let data = createCell('td',select);
        let row = document.createElement('tr')
        row.appendChild(header);
        row.appendChild(data);
        table.appendChild(row);
    }
    extraAttributes.forEach(attrObj => {
        let attr = Object.keys(attrObj)[0];
        let attrValue = attrObj[attr];
        if (!zombieProperty.objdata.hasOwnProperty(attr)) {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            td1.textContent = attr;
            tr.appendChild(td1);
            let td2 = document.createElement('td');
            let input;
            if (typeof attrValue === 'boolean') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = attrValue;
                input.onchange = function() {
                    zombieProperty.objdata[attr] = input.checked;
                };
            } else {
                input = document.createElement('input');
                input.type = 'number';
                input.placeholder = attrValue;
                input.onchange = function() {
                    zombieProperty.objdata[attr] = isNaN(input.value) ? input.value : Number(input.value);
                };
            }
            td2.appendChild(input);
            tr.appendChild(td2);

            table.appendChild(tr);
        }
    });

    //condition start
    conditionFunction(table);
    //condition end


    if (zombieProperty.objdata.hasOwnProperty("Actions")){
        //let zombieProperty = zombiePropertiesObjectsData.find(p => p.aliases.includes
        //(zombieType.objdata.Properties.slice(zombieType.objdata.Properties.indexOf('(') + 1, zombieType.objdata.Properties.indexOf('@'))));
        let len = zombieProperty.objdata.Actions.length;
        if (len === 3){
            let massiveList = [];
            zombieActionsData.forEach(object => {
                if (object.aliases[0] == "ZombieDarkWizardZap" || object.aliases[0].includes("Caesar")){
                    return;
                }
                massiveList.push(object.aliases[0]);
            })
            for (let i = 0; i < 3; i++){
                let magicianRow = document.createElement('tr');
                let magicianTh = document.createElement('th');
                switch (i) {
                    case 0:
                        magicianRow.id =('action1');
                        magicianTh.textContent = '1st action:'
                        break;
                    case 1:
                        magicianRow.id = ('action2');
                        magicianTh.textContent = '2nd action:'
                        break;
                    case 2:
                        magicianRow.id = ('action3');
                        magicianTh.textContent = '3rd action:'
                        break;
                    default:
                        break;
                }
                magicianRow.appendChild(magicianTh);
                let magicianTd = document.createElement('td');
                let select = document.createElement('select');
                select.id = `selectInput${i+1}`
                let option = document.createElement('option');
                option.value = "";
                option.textContent = "-";    
                option.defaultSelected = true;
                option.hidden = true;
                select.appendChild(option);
                massiveList.forEach(condition => {
                    option = document.createElement('option');
                    option.value = condition;
                    option.textContent = condition;
                    select.appendChild(option);
                });
                //magician
                select.onchange = function () {
                    zombieProperty.objdata.Actions[i] = `RTID(${select.value}@.)`;
                    let actionAlias = zombieProperty.objdata.Actions;
                    let temp = zombieActionsData.find(p => p.aliases.includes(actionAlias[i].slice(actionAlias[i].indexOf('(') + 1,actionAlias[i].indexOf('@'))));
                    magicianObjects[i] = temp;
                    handleAction(table,zombieProperty,i);
                    table.removeChild(document.getElementById(`action${i+1}`));
                    let copyButton = document.getElementById('copyButton');
                    //yeah i got bored from thinking of variable names so i referenced the id twice
                    if (table.contains(document.getElementById('ogActions'))){
                        table.removeChild(document.getElementById('ogActions'));
                    }
                    table.appendChild(copyButton);
                }
                magicianTd.appendChild(select);
                magicianRow.appendChild(magicianTd);
                table.appendChild(magicianRow);
            }
            let button = document.createElement('button');
            button.textContent = 'Original magician actions';
            button.onclick = simulateSelectOptions;
            button.style.width = '100%';
            let buttonRow = createCell('td',button);
            buttonRow.id = 'ogActions';
            buttonRow.colSpan = 2;
            table.appendChild(buttonRow);
        }
        else {
            handleAction(table,zombieProperty);
        };
    }

    let buttonRow = document.createElement('tr');
    buttonRow.id = 'copyButton';
    let buttonCell = document.createElement('td');
    buttonCell.colSpan = 2;
    buttonCell.style.width = '100%';
    let button = document.createElement('button');
    button.textContent = 'Copy Zombie';
    button.style.width = '100%';
    button.onclick = function() {
        zombieProperty.objdata.ConditionImmunities = conditionImmunitiesObject;
        zombieType = {
            "#Made by the custom zombie tool website":0,
            ...zombieType,
        };
        pushObject(zombieType,0);
        pushObject(zombieProperty,1);
        if (zombieProperty.objdata.hasOwnProperty("Actions")){
            if (zombieProperty.objclass === 'ZombieCarnieMagicianProps'){
                pushObject(magicianObjects[0],2)
                pushObject(magicianObjects[1],3)
                pushObject(magicianObjects[2],4)
            }
            else pushObject(zombieAction,2)
        }
        let zombieDataString = listOfObjects;
        navigator.clipboard.writeText(zombieDataString).then(function() {
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    };
    buttonCell.appendChild(button);
    buttonRow.appendChild(buttonCell);
    table.appendChild(buttonRow);
    let tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.appendChild(table);
    } else {
        console.log('Error: Could not find the table container');
    }


}







let extraAttributes = [
    {"CanBePlantTossedStrong":true},
    {"FlickIsLaneRestricted":false},
    {"TimeToKillInSeconds":99999},
    {"ChillInsteadOfFreeze":false},
    {"CanBePlantTossedWeak":true},
    {"CanTriggerZombieWin":true},
    {"FireDamageMultiplier":1},
    {"CanBeFlickedOff":true},
    {"CanSurrender":false},
    {"ArtScale":1}
]
let commonAttributes = [
    "ArtCenter",
    "AttackRect",
    "HitRect",
    "EatDPS",
    "Hitpoints",
    "Speed"
]
let bannedAttributes = [
    "PlantsWhichBreakBarrelOnCollision",
    "PlantsWhichBreakPianoOnCollision",
    "HealthThresholdToImpAmmoLayers",
    "AngleAgnosticProjectiles",
    "GridItemsToFlyOver",
    "Actions",
    "JamStyle",
    "PlantsToFlyOver",
    "BounceableProjectiles",
    "ProjectileClassesToNeverBlock",
    "ZombieSpawnWeights",
    "PlantsShovelableWhileInvincible",
    "PlantsToBashInsteadOfShovel",
    "PlantsWhichAlsoKillBasic",
    "PlantsToKickInsteadOfPush",
    "ZombiesToNotKick",
    "PlantBoomRestrictionSet",
    "ZombieArmorProps",
    "ParrotTargetExcludeList",
    "JuggleableProjectiles",
    "UnthrowableProjectiles",
    "DamageWhileSubmerged",
    "DamageWhileSubmergedPlantfoodOnly",
    "TargetByIncludelist",
    "BreaksSurfboard",
    "BlocksSurfboard",
    "AllowedLowPlants",
    "ImpType",
    "StaticArtImageAsset",
    "ValidKnightTargets",
    "PlantablePlants",
    "GroundTrackName",
    "WavePointCost",
    "ShadowOffset",
    "ZombieStats",
    "ScaledProps",
    "Projectile",
    "Weight",
    "Cost",
    'SpawnImpType',
    'ChickenTypeName'
]

let zombieTypesData;
let zombiePropertiesObjectsData;
let zombieActionsData;

let massiveTypeList = [];
let resourceGroups = [];
let audioGroups = [];
// Fetch JSON files
fetchJsonFile('ZOMBIETYPES.json').then(zombieTypes => {
    zombieTypesData = zombieTypes; // Store the data in the global variable
    zombieTypesData.forEach(object => {
        massiveTypeList.push(object.aliases[0]);
        let alias = object.aliases[0];
        let resource = object.objdata.ResourceGroups;
        let audio = object.objdata.AudioGroups;
        resourceGroups.push({ 'alias': alias, 'group': resource });
        audioGroups.push({ 'alias': alias, 'group':audio })
    })
    console.log(resourceGroups);
    console.log(audioGroups);
    fetchJsonFile('ZOMBIEPROPERTIES.json').then(zombiePropertiesObjects => {
        zombiePropertiesObjectsData = zombiePropertiesObjects; // Store the data in the global variable
        // Get the first alias from each object in zombiePropertiesObjects
        zombieTypesData.forEach(prop => {
            if (prop.aliases && prop.aliases.length > 0) {
                searchArray.push(prop.aliases[0]);
            }
        });
        fetchJsonFile('ZOMBIEACTIONS.json').then(zombieActions => {
            zombieActionsData = zombieActions;
        })
    });
});





