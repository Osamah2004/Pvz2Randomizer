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
        
function hideResults() {
    let resultsDiv = document.getElementById('results');
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

let conditionImmunitiesObject = [];
function createTable(alias, zombieType, zombieProperty) {
    let allConditions = ["chill","freeze","stun","unsuspendable","stalled","sapped","butter","decaypoison","shrinking","shrunken","gummed","dazeystunned","stackableslow","hypnotized","potiontoughness1","potiontoughness2","potiontoughness3","speeddown1","speeddown2","speeddown3","potionspeed1","potionspeed2","potionspeed3","terrified","hungered","potionsuper1","potionsuper2","potionsuper3","stickybombed","suncarrier50","suncarrier100","suncarrier250"];
    let immuneToSlow = allConditions.slice(0, allConditions.indexOf('potiontoughness1'));
    let immuneToPotions = allConditions.slice(allConditions.indexOf('potiontoughness1') + 1);
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
        zombieType.objdata.Properties = `RTID(${inputProps.value}@.)`;
        zombieProperty.aliases[0] = inputProps.value;
    };
    tdPropsInput.appendChild(inputProps);
    trProps.appendChild(tdPropsInput);
    table.appendChild(trProps);
    Object.keys(zombieProperty.objdata).forEach(attr => {
        if (!bannedAttributes.includes(attr)) {
            let tr = document.createElement('tr');
            if (typeof zombieProperty.objdata[attr] === 'object' && zombieProperty.objdata[attr] !== null) {
                for (let nestedAttr in zombieProperty.objdata[attr]) {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    td1.textContent = attr + ' ' + nestedAttr;
                    tr.appendChild(td1);
                    let td2 = document.createElement('td');
                    let input;
                    if (typeof zombieProperty.objdata[attr][nestedAttr] === 'boolean') {
                        input = document.createElement('input');
                        input.type = 'checkbox';
                        input.checked = zombieProperty.objdata[attr][nestedAttr];
                        input.onchange = function() {
                            zombieProperty.objdata[attr][nestedAttr] = input.checked;
                        };
                    } else {
                        input = document.createElement('input');
                        if (typeof zombieProperty.objdata[attr][nestedAttr] === 'number')
                            {
                                input.type = 'number';
                            }
                        input.placeholder = zombieProperty.objdata[attr][nestedAttr];
                        input.onchange = function() {
                            zombieProperty.objdata[attr][nestedAttr] = isNaN(input.value) ? input.value : Number(input.value);
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
                if (typeof zombieProperty.objdata[attr] === 'boolean') {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = zombieProperty.objdata[attr];
                    input.onchange = function() {
                        zombieProperty.objdata[attr] = input.checked;
                    };
                } else {
                    input = document.createElement('input');
                    input.placeholder = zombieProperty.objdata[attr];
                    if (typeof zombieProperty.objdata[attr] === 'number'){
                        input.type = 'number';
                    }
                    input.onchange = function() {
                        zombieProperty.objdata[attr] = isNaN(input.value) ? input.value : Number(input.value);
                    };
                }                
                td2.appendChild(input);
                td2.appendChild(input);
                tr.appendChild(td2);

                table.appendChild(tr);
            }
        }
    });
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
        buttonRemove.textContent = 'Remove table row';
        buttonRemove.classList.add('red');
        buttonRemove.dataset.condition = selectedCondition; //  Store the condition in a data attribute
        buttonRemove.onclick = function() {
            var storage = localStorage.getItem('item');
            if (storage == null){
                alert("This button will only remove the table row, I couldn't make it remove the desired condition.");
                localStorage.setItem('item','item');
            }
            
            table.removeChild(tr);
        };

        td2.appendChild(input);
        td2.appendChild(buttonRemove);
        tr.appendChild(td2);
        table.insertBefore(tr, trConditionImmunities.nextSibling);
    };

    let option = document.createElement('option');
    option.value = "-";
    option.textContent = "-";
    selectConditionImmunities.insertBefore(option, selectConditionImmunities.firstChild);
    selectConditionImmunities.value = "-";
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
        allConditions.forEach(condition => {
            if (!conditionImmunitiesObject.find(ci => ci.Condition === condition)) {
                conditionImmunitiesObject.push({ Condition: condition, Percent: 1 });
            }
            // Change the value of all input fields
            let inputs = document.querySelectorAll('.immuneToSlow, .immuneToPotions');
            inputs.forEach(input => {
                input.value = 1;
            });
        });
    };
    
    tdButtons.appendChild(all1);
    tdButtons.appendChild(buttonAll);
    trButtons.appendChild(tdButtons);
    table.appendChild(trButtons);
    let buttonRow = document.createElement('tr');
    let buttonCell = document.createElement('td');
    buttonCell.colSpan = 2;
    buttonCell.style.width = '100%';
    let button = document.createElement('button');
    button.textContent = 'Copy Zombie';
    button.style.width = '100%';
    button.onclick = function() {
        zombieProperty.objdata.ConditionImmunities = conditionImmunitiesObject;
        let zombieDataString = JSON.stringify(zombieType, null, 2) + ',\n' + JSON.stringify(zombieProperty, null, 2);
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
    "HealthThresholdToImpAmmoLayers",
    "StaticArtImageAsset",
    "GroundTrackName",
    "WavePointCost",
    "ShadowOffset",
    "ZombieStats",
    "ScaledProps",
    "Weight",
    "Cost"
]

let zombieTypesData;
let zombiePropertiesObjectsData;

// Fetch JSON files
fetchJsonFile('ZOMBIETYPES.json').then(zombieTypes => {
    zombieTypesData = zombieTypes; // Store the data in the global variable
    fetchJsonFile('ZOMBIEPROPERTIES.json').then(zombiePropertiesObjects => {
        zombiePropertiesObjectsData = zombiePropertiesObjects; // Store the data in the global variable
        // Get the first alias from each object in zombiePropertiesObjects
        zombieTypesData.forEach(prop => {
            if (prop.aliases && prop.aliases.length > 0) {
                searchArray.push(prop.aliases[0]);
            }
        });
    });
});
