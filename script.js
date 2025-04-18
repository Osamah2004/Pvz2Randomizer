async function fetchJsonFile(filename) {
    const response = await fetch(filename);
    const data = await response.json();
    return data.objects; // Return the 'objects' array
}

let searchArray = [];

// Create a table to display the zombie's properties
let table = document.createElement('table');
table.id = 'zombieDiv'; // Add an id to the table

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

const inputElement = document.getElementById('search'); // Ensure this targets your input element
inputElement.addEventListener('keyup', function(event) {
    if (event.key === 'Escape') {
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
    let existingTable = document.getElementById('zombieDiv');
    if (existingTable) existingTable.remove();

    // Search for the selected zombie in ZombieTypes and ZombieProperties
    let zombieType = zombieTypesData.find(z => z.aliases.includes(alias));
    let zombieProperty = zombiePropertiesObjectsData.find(p => p.aliases.includes(zombieType.objdata.Properties.slice(zombieType.objdata.Properties.indexOf('(') + 1, zombieType.objdata.Properties.indexOf('@'))));

    // Call the createTable function
    createDiv(alias, zombieType, zombieProperty);
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
        resultsDiv.appendChild(document.createElement('br'));
    }

    resultsDiv.style.display = 'block'; // Show the results div
    resultsDiv.classList.add('results-div'); // Add class for styling
}

function searchAliases() {
    let input = document.getElementById('search').value.toLowerCase();
    let resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Filter aliases based on input
    for (let alias of searchArray) {
        if (alias.toLowerCase().includes(input)) {
            // Create a new anchor for each matching alias and append it to the results div
            let a = document.createElement('a');
            a.textContent = alias;
            a.href = '#'; // Prevent the page from refreshing when the link is clicked
            a.onclick = function() {
                handleClick(alias, resultsDiv, zombieTypesData, zombiePropertiesObjectsData);
                return false; // Prevent the default action
            };

            resultsDiv.appendChild(a);

            // Add a line break after each alias
            resultsDiv.appendChild(document.createElement('br'));
        }
    }

    // Show or hide results div based on whether there are any results
    resultsDiv.style.display = resultsDiv.hasChildNodes() ? 'block' : 'none';
    resultsDiv.classList.add('results-div'); // Add class for styling
}

function objdataHandling(object, div) {
    div.classList.add('object-data-div'); // Add class for styling

    Object.keys(object).forEach(attr => {
        if (!bannedAttributes.includes(attr)) {
            if (typeof object[attr] === 'object' && object[attr] !== null) {
                for (let nestedAttr in object[attr]) {
                    // Make inputs for nested objects
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
                        if (typeof object[attr][nestedAttr] === 'number') {
                            input.type = 'number';
                        }
                        input.placeholder = object[attr][nestedAttr];
                        input.onchange = function() {
                            object[attr][nestedAttr] = isNaN(input.value) ? input.value : Number(input.value);
                        };
                    }
                    div.appendChild(createText(attr + ' ' + nestedAttr, attr + ' ' + nestedAttr));
                    div.appendChild(input);
                    div.appendChild(document.createElement('br'));
                }
            } else {
                // Make inputs for regular objects
                div.appendChild(createText(attr, attr));
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
                    if (typeof object[attr] === 'number') {
                        input.type = 'number';
                    }
                    input.onchange = function() {
                        object[attr] = isNaN(input.value) ? input.value : Number(input.value);
                    };
                }
                div.appendChild(input);
                div.appendChild(document.createElement('br'));
            }
        }
    });
}


let conditionImmunitiesObject = [];

function removeCondition(condition){
    let temp = [];
    conditionImmunitiesObject.forEach(i => {
        if (condition != i.Condition){
            temp.push(i);
        }
    })
    conditionImmunitiesObject = temp;
}

function conditionFunction(div){
    let nestedDiv = document.createElement('div');
    let allConditions = ["chill","freeze","stun","unsuspendable","stalled","sapped","butter","decaypoison","shrinking","shrunken","gummed","dazeystunned","stackableslow","hypnotized","potiontoughness1","potiontoughness2","potiontoughness3","speeddown1","speeddown2","speeddown3","potionspeed1","potionspeed2","potionspeed3","terrified","hungered","potionsuper1","potionsuper2","potionsuper3","stickybombed","suncarrier50","suncarrier100","suncarrier250"];
    let immuneToSlow = allConditions.slice(0, allConditions.indexOf('potiontoughness1'));
    let immuneToPotions = allConditions.slice(allConditions.indexOf('potiontoughness1') + 1);
    div.appendChild(createText('ConditionImmunities','ConditionImmunities'));
    let selectTag = document.createElement('select');
    selectTag.oninput = function() {
        let conditionDiv = document.createElement('div');
        let selectedCondition = selectTag.value;
        if (selectedCondition === "-") return;
        conditionDiv.id = selectedCondition;
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

        conditionDiv.appendChild(createText(selectedCondition,selectedCondition));
        let buttonRemove = document.createElement('button');
        buttonRemove.textContent = 'Remove condition';
        buttonRemove.classList.add('red');
        buttonRemove.dataset.condition = selectedCondition; //  Store the condition in a data attribute
        buttonRemove.onclick = function() {
            removeCondition(selectedCondition);
            div.removeChild(conditionDiv);
        };

        conditionDiv.appendChild(input);
        conditionDiv.appendChild(buttonRemove);
        conditionDiv.appendChild(document.createElement('br'));

        div.appendChild(conditionDiv);
        div.appendChild(document.getElementById('Copy'));
    };

    let option = document.createElement('option');
    option.value = "";
    option.textContent = "-";
    option.defaultSelected = true; // Default selected
    option.hidden = true; // Hidden
    selectTag.insertBefore(option, selectTag.firstChild);
    allConditions.forEach(condition => {
        option = document.createElement('option');
        option.value = condition;
        option.textContent = condition;
        selectTag.appendChild(option);
    });
    div.appendChild(selectTag);
    div.appendChild(document.createElement('br'));
    let buttonSlow = document.createElement('button');
    buttonSlow.textContent = 'Immune to plants\' conditions';
    buttonSlow.onclick = function() {
        immuneToSlow.forEach(condition => {
            removeCondition(condition);
            let conditionToRemove = document.getElementById(condition);
            conditionToRemove?.remove();
            {
                let conditionDiv = document.createElement('div');
                let selectedCondition = condition;
                if (selectedCondition === "-") return;
                conditionDiv.id = selectedCondition;
                let input = document.createElement('input');
                if (immuneToSlow.includes(selectedCondition)) {
                    input.classList.add('immuneToSlow');
                } else {
                    input.classList.add('immuneToPotions');
                }
                input.type = 'number';
                input.min = 0;
                input.style.width = '30px';
                input.value = 0;
                input.dataset.condition = selectedCondition; // Store the condition in a data attribute
                input.onchange = function () {
                    let conditionImmunity = conditionImmunitiesObject.find(ci => ci.Condition === selectedCondition);
                    conditionImmunity.Percent = Number(input.value);
                };

                conditionImmunitiesObject.push({ Condition: selectedCondition, Percent: 0 });

                conditionDiv.appendChild(createText(selectedCondition, selectedCondition));
                let buttonRemove = document.createElement('button');
                buttonRemove.textContent = 'Remove condition';
                buttonRemove.classList.add('red');
                buttonRemove.dataset.condition = selectedCondition; //  Store the condition in a data attribute
                buttonRemove.onclick = function () {
                    removeCondition(selectedCondition);
                    div.removeChild(conditionDiv);
                };

                conditionDiv.appendChild(input);
                conditionDiv.appendChild(buttonRemove);
                conditionDiv.appendChild(document.createElement('br'));

                div.appendChild(conditionDiv);
            };
            

        });
        div.appendChild(document.getElementById('Copy'));
    };
    nestedDiv.appendChild(buttonSlow);
    let buttonPotions = document.createElement('button');
    buttonPotions.textContent = 'Immune to potions';
    buttonPotions.onclick = function() {
        immuneToPotions.forEach(condition => {
            removeCondition(condition);
            let conditionToRemove = document.getElementById(condition);
            conditionToRemove?.remove();
            {
                let conditionDiv = document.createElement('div');
                let selectedCondition = condition;
                if (selectedCondition === "-") return;
                conditionDiv.id = selectedCondition;
                let input = document.createElement('input');
                if (immuneToSlow.includes(selectedCondition)) {
                    input.classList.add('immuneToSlow');
                } else {
                    input.classList.add('immuneToPotions');
                }
                input.type = 'number';
                input.min = 0;
                input.style.width = '30px';
                input.value = 0;
                input.dataset.condition = selectedCondition; // Store the condition in a data attribute
                input.onchange = function () {
                    let conditionImmunity = conditionImmunitiesObject.find(ci => ci.Condition === selectedCondition);
                    conditionImmunity.Percent = Number(input.value);
                };

                conditionImmunitiesObject.push({ Condition: selectedCondition, Percent: 0 });

                conditionDiv.appendChild(createText(selectedCondition, selectedCondition));
                let buttonRemove = document.createElement('button');
                buttonRemove.textContent = 'Remove condition';
                buttonRemove.classList.add('red');
                buttonRemove.dataset.condition = selectedCondition; //  Store the condition in a data attribute
                buttonRemove.onclick = function () {
                    removeCondition(selectedCondition);
                    div.removeChild(conditionDiv);
                };

                conditionDiv.appendChild(input);
                conditionDiv.appendChild(buttonRemove);
                conditionDiv.appendChild(document.createElement('br'));

                div.appendChild(conditionDiv);
            };
        });
        div.appendChild(document.getElementById('Copy'));
    };
    nestedDiv.appendChild(buttonPotions);
    let buttonAll = document.createElement('button');
    buttonAll.textContent = 'all 0';
    buttonAll.onclick = function() {
        allConditions.forEach(condition => {
            removeCondition(condition);
            let conditionToRemove = document.getElementById(condition);
            conditionToRemove?.remove();
            {
                let conditionDiv = document.createElement('div');
                let selectedCondition = condition;
                if (selectedCondition === "-") return;
                conditionDiv.id = selectedCondition;
                let input = document.createElement('input');
                if (immuneToSlow.includes(selectedCondition)) {
                    input.classList.add('immuneToSlow');
                } else {
                    input.classList.add('immuneToPotions');
                }
                input.type = 'number';
                input.min = 0;
                input.style.width = '30px';
                input.value = 0;
                input.dataset.condition = selectedCondition; // Store the condition in a data attribute
                input.onchange = function () {
                    let conditionImmunity = conditionImmunitiesObject.find(ci => ci.Condition === selectedCondition);
                    conditionImmunity.Percent = Number(input.value);
                };

                conditionImmunitiesObject.push({ Condition: selectedCondition, Percent: 0 });

                conditionDiv.appendChild(createText(selectedCondition, selectedCondition));
                let buttonRemove = document.createElement('button');
                buttonRemove.textContent = 'Remove condition';
                buttonRemove.classList.add('red');
                buttonRemove.dataset.condition = selectedCondition; //  Store the condition in a data attribute
                buttonRemove.onclick = function () {
                    removeCondition(selectedCondition);
                    div.removeChild(conditionDiv);
                };

                conditionDiv.appendChild(input);
                conditionDiv.appendChild(buttonRemove);
                conditionDiv.appendChild(document.createElement('br'));

                div.appendChild(conditionDiv);
            };
        });
        div.appendChild(document.getElementById('Copy'));
    };
    let all1 = document.createElement('button');
    all1.textContent = 'all 1';
    all1.onclick = function() {
        conditionImmunitiesObject.forEach(condition => {
            div.removeChild(document.getElementById(condition.Condition));
        })
        conditionImmunitiesObject = [];
    };
    
    nestedDiv.appendChild(all1);
    nestedDiv.appendChild(buttonAll);
    nestedDiv.id = 'rowOfButtons';
    div.appendChild(nestedDiv);
}

let listOfObjects = new Array(2);

function pushObject(object,index){
    listOfObjects[index] = (JSON.stringify(object, null, 2));
}

function rtid(value,object2){
    object2[0] = value;
    return `RTID(${value}@.)`;
}
let caesarActions = new Array(7);
let zombieAction;
function handleAction(div,zombieProperty,index = 0){
    listOfObjects = new Array(2 + zombieProperty.objdata.Actions.length);
    let actionTr = document.createElement('tr');
    let actionAlias = zombieProperty.objdata.Actions[index];
    zombieAction = zombieActionsData.find(p => p.aliases.includes(actionAlias.slice(actionAlias.indexOf('(') + 1,actionAlias.indexOf('@'))));
    let aliasText = createText(zombieAction.aliases[0],'actionalias','h1');
    actionTr.appendChild(aliasText);
    let inputRow = document.createElement('tr');
    let inputLabel = createText(zombieAction.aliases[0], 'actionalias');
    inputLabel.textContent = 'Action alias :';
    let inputContainer = document.createElement('td');
    let inputField = document.createElement('input');
    inputField.onchange = function() {
        console.log(index)
        aliasText.textContent = inputField.value;
        if (zombieProperty.objclass === 'ZombieGeneralCaesarProps'){
            caesarActions[index].aliases[0] = inputField.value;
        }
        if (zombieProperty.objclass === 'ZombieCarnieMagicianProps') {
            zombieProperty.objdata.Actions[index] = rtid(inputField.value, magicianObjects[index].aliases);
        }
        else zombieProperty.objdata.Actions[index] = rtid(inputField.value,zombieAction.aliases);
    }
    inputField.placeholder = zombieAction.aliases[0];
    inputContainer.appendChild(inputField);
    inputRow.appendChild(inputLabel);
    inputRow.appendChild(inputContainer);
    div.appendChild(aliasText);
    div.appendChild(document.createElement('br'));
    div.appendChild(inputLabel);
    div.appendChild(inputField);
    console.log(magicianObjects)
    if (zombieProperty.objclass === 'ZombieCarnieMagicianProps'){
        objdataHandling(magicianObjects[index].objdata, div);
    }
    else if (zombieProperty.objclass === 'ZombieGeneralCaesarProps'){
        objdataHandling(caesarActions[index].objdata, div)
    }
    else objdataHandling(zombieAction.objdata,div);
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
    
    function displayHint(targetText, fileName = targetText) {
        const elements = document.querySelectorAll('undefined');
    
        let target;
        elements.forEach(element => {
            if (element.textContent.includes(targetText)) {
                target = element;
            }
        });
        if (!target) {
            console.error('Target element not found');
            return;
        }
    
        // Ensure target element has relative positioning
        target.style.position = 'relative';
    
        const button = document.createElement('button');
        button.textContent = '?';
        button.style.width = '5%';
        button.id = 'hint';
        button.style.position = 'absolute';
        button.style.top = '0'; // Adjust this value as needed
        button.style.right = '0'; // Align to the right
        button.style.margin = '5px'; // Add some margin to avoid overlapping
    
        button.addEventListener('click', () => {
            // Darken the screen
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            document.body.appendChild(overlay);
    
            const hintText = hints[targetText] || 'No hint available';
            const imageSrc = `hints/${fileName}.gif`; // Replace with actual image path
    
            const hintDiv = document.createElement('div');
            hintDiv.classList.add('filename-container');
            hintDiv.style.position = 'fixed';
            hintDiv.style.top = '50%';
            hintDiv.style.left = '50%';
            hintDiv.style.transform = 'translate(-50%, -50%)';
            hintDiv.style.padding = '20px';
            hintDiv.style.color = '#000000';
            hintDiv.innerHTML = `
                <h3 id='outline'>${hintText}</h3>
                <img src="${imageSrc}" alt="Hint Image">
                <br>
            `;
            document.body.appendChild(hintDiv);
    
            // Create a close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(hintDiv);
                document.body.removeChild(overlay);
            });
            hintDiv.appendChild(closeButton);
        });
        target.appendChild(button);
    }
    
    function createText(text, id, element) {
        let p;
        if (element !== undefined) {
            p = document.createElement(element);
            p.textContent = text;
            return p;
        }
        text = `${text} : `;
        p = document.createElement('undefined');
        p.textContent = text;
        p.id = "Texte";
        return p;
    }
    
    function createInput(placeholder, type = 'number') {
        let input = document.createElement('input');
        input.placeholder = placeholder;
        input.type = type;
        input.id = placeholder;
        return input;
    }
    
    function getProp(alias) {
        zombieType = zombieTypesData.find(z => z.aliases.includes(alias));
        return zombieType.objdata.Properties.slice(zombieType.objdata.Properties.indexOf('(') + 1, zombieType.objdata.Properties.indexOf('@'));
    }
    
    function createDiv(alias, zombieType, zombieProperty) {
        zombieProperty.objdata.ConditionImmunities = [];
    
        // Display zombie's alias
        let div = document.createElement('div');
        div.classList.add('filename-container');
        div.id = 'zombieDiv';
        
        let zombieName = createText(alias, 'zombieName', 'h1');
        div.appendChild(zombieName);
        div.appendChild(document.createElement('br'));

    //Input to change zombie's alias
    div.appendChild(createText('Code Name','codeName',));
    let aliasInput = createInput(zombieType.aliases[0],'text');
    aliasInput.value = zombieType.aliases[0];
    aliasInput.onchange = function() {
        zombieType.aliases[0] = aliasInput.value;
        zombieName.textContent = aliasInput.value;
    };
    div.appendChild(aliasInput);
    div.appendChild(document.createElement('br'));

    //Input to change zombie's props
    div.appendChild(createText('Props', 'props', ));
    let propsInput = createInput(getProp(alias),'text');
    
    propsInput.value = getProp(alias);
    propsInput.onchange = function() {
        zombieType.objdata.Properties = rtid(propsInput.value,zombieProperty.aliases);
    };
    div.appendChild(propsInput);
    div.appendChild(document.createElement('br'));

    objdataHandling(zombieProperty.objdata,div);


    for (const key of impType) {

        if (zombieProperty.objdata.hasOwnProperty(key)) {

        let select = createOptions(massiveTypeList);
        select.value = zombieProperty.objdata[key];
        select.onchange = function () {
            zombieProperty.objdata[key] = select.value;
            let resource = findValueByKey(resourceGroups,select.value);
            let audio = findValueByKey(audioGroups,select.value);
            zombieType.objdata.ResourceGroups.push(...resource);
            zombieType.objdata.AudioGroups.push(...audio);
        }
        div.appendChild(createText(key,key,));
        div.appendChild(select)
        div.appendChild(document.createElement('br'));
        break;
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
        div.appendChild(createText('jam','jam'));
        div.appendChild(select);
        div.appendChild(document.createElement('br'));
    }
    extraAttributes.forEach(attrObj => {
        let attr = Object.keys(attrObj)[0];
        let attrValue = attrObj[attr];
        if (!zombieProperty.objdata.hasOwnProperty(attr)) {
            div.appendChild(createText(attr,attr));
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
            div.appendChild(input);
            div.appendChild(document.createElement('br'));
        }
    });

    //condition start
    conditionFunction(div);
    //condition end


    if (zombieProperty.objdata.hasOwnProperty("Actions")){
        //let zombieProperty = zombiePropertiesObjectsData.find(p => p.aliases.includes
        //(zombieType.objdata.Properties.slice(zombieType.objdata.Properties.indexOf('(') + 1, zombieType.objdata.Properties.indexOf('@'))));
        let len = zombieProperty.objdata.Actions.length;
        if (len === 7){
            for (let i = 0; i < 7; i++) {
                let actionAlias = zombieProperty.objdata.Actions[i];
                let temp = zombieActionsData.find(p => p.aliases.includes(actionAlias.slice(actionAlias.indexOf('(') + 1, actionAlias.indexOf('@'))));
                caesarActions[i] = temp;
                handleAction(div, zombieProperty,i);
            }
            console.log(caesarActions)
        }
        else if (len === 3){
            let magicianTable = document.createElement('table');
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
                    handleAction(div,zombieProperty,i);
                    magicianTable.removeChild(document.getElementById(`action${i+1}`));
                    let copyButton = document.getElementById('Copy');
                    if (magicianTable.contains(document.getElementById('ogActions'))){
                        magicianTable.removeChild(document.getElementById('ogActions'));
                    }
                    div.appendChild(copyButton);
                }
                magicianTd.appendChild(select);
                magicianRow.appendChild(magicianTd);
                magicianTable.appendChild(magicianRow);
            }
            let button = document.createElement('button');
            button.textContent = 'Original magician actions';
            button.onclick = simulateSelectOptions;
            button.style.width = '100%';
            let buttonRow = createCell('td',button);
            buttonRow.id = 'ogActions';
            buttonRow.colSpan = 2;
            magicianTable.appendChild(buttonRow);
            magicianTable.id = 'magician table';
            div.appendChild(magicianTable);
        }
        else {
            handleAction(div,zombieProperty);
        };
    }

    let buttonRow = document.createElement('tr');
    buttonRow.id = 'copyButton';
    let buttonCell = document.createElement('td');
    buttonCell.colSpan = 2;
    buttonCell.style.width = '100%';
    let button = document.createElement('button');
    button.textContent = 'Copy Zombie';
    button.id = "Copy";
    button.style.width = '100%';
    button.onclick = function() {
        zombieProperty.objdata.ConditionImmunities = conditionImmunitiesObject;
        zombieType = {
            "#Made by the custom zombie workshop":0,
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
            else if (zombieProperty.objclass === 'ZombieGeneralCaesarProps'){
                for (let i = 0; i < caesarActions.length; i++) {
                    const temp = caesarActions[i];
                    pushObject(caesarActions[i],i+2)
                }
            }
            else pushObject(zombieAction,2)
        }
        let zombieDataString = listOfObjects;
        console.log("Number of objects: " + zombieDataString.length)
        for (let key in zombieDataString) {
            if (zombieDataString[key].includes('$')) {
                console.log('the key has a dollar sign $')
                zombieDataString[key] = zombieDataString[key].replace('$', '');
            }
            if (zombieDataString[key].includes(',,,,,,')) {
                console.log('the key has many commas')
                zombieDataString[key] = zombieDataString[key].replace(',,,,,,', '');
            }
        }
        navigator.clipboard.writeText(zombieDataString).then(function() {
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    };
    div.appendChild(button);
    let tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.appendChild(div);
    } else {
        console.log('Error: Could not find the table container');
    }
    Object.keys(hints).forEach(key => {
        if (key == 'tomb_raiser'){
            console.log('tomb raiser found');
            return;
        }
        if (key.includes('Flick')){
            displayHint(key,'Flick')
        }
        else if (key.includes('Tossed')){
            displayHint(key,'Toss')
        }
        else displayHint(key);
    })

}
/**
 *     hints.forEach(key => {
        myFunction(key);
    })
 */
let hints = { //a block of code }
    'ArtScale': 'art scale changes the zombie\'s size\nmaking him smaller or larger depending on the value',
    'ConditionImmunities': 'control the zombie\'s immunity to certain effects whether negative effects from the plants or positve effect from potions',    'tomb_raiser': 'control the zombie\'s immunity to certain effects whether negative effects from the plants or positve effect from potions',
    'CanBeFlickedOff': "you can't flick the zombie off screen if the value is false",
    'FireDamageMultiplier': "how durable a zombie is against fire damage",
    'FlickIsLaneRestricted': "you can't flick the zombie to another row if the value is true",
    'CanBeFlicked': "you can't flick the zombie at all if the value is false",
    'CanBePlantTossedWeak': "setting it to false makes the zombie immune to primal peashooter's knockback",
    'CanBePlantTossedStrong': "setting it to false makes the zombie immune to other plants such as spring bean,chard guard, leveled stallia etc...",
    'CanSurrender': 'when true, the zomibe will commit suicide if other zombies are dead in the last wave'
}

let extraAttributes = [
    {"CanBePlantTossedStrong":true},
    {"FlickIsLaneRestricted":false},
    {"ChillInsteadOfFreeze":false},
    {"CanBePlantTossedWeak":true},
    {"CanTriggerZombieWin":true},
    {"FireDamageMultiplier":1},
    {"CanBeFlickedOff":true},
    {"CanBeFlicked":true},
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
    "ZombieSpawnWeights",
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


