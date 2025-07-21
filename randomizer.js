// Equivalent of Python's random.randint(a, b): returns a random integer N such that a <= N <= b
function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Equivalent of Python's random.choice(seq): returns a random element from a non-empty array
function choice(arr) {
    return arr[randint(0, arr.length - 1)];
}

// Equivalent of Python's random.sample(population, k): returns a new array of k unique elements chosen from the array (no repeats)
// Useful for picking k random items from an array without replacement
function sample(arr, k) {
    if (k > arr.length) {
        throw new RangeError("sample size is larger than array");
    }
    // Create a shallow copy and shuffle it, then take first k elements
    let copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        let j = randint(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, k);
}

// Returns an array of i unique random digits between 0 and 69 inclusive
function randomDigits(i) {
    // Create an array of numbers from 0 to 42
    const digits = Array.from({length: 43}, (_, idx) => idx);
    return sample(digits, i);
}

if (!localStorage.getItem("S0")){
    redirect.click() /* This if statement sends you to a different page that
loads necessary items into the local storage if it's your first time in this web page*/
}

let skeleton;

let level; // Proxy for main level properties
let levelDefinition; // Proxy for skeleton.objects[0].objdata
let escalation;      // Proxy for skeleton.objects[2].objdata
let waveManager;     // Proxy for skeleton.objects[4].objdata

let description;
let modules;
let name;
let stage;
let flagCount;
let wavesPerFlag;
let plantfoodToSpawnCount;
let startingPoints;
let pointIncrementPerWave;
let zombiePool;
let flagWaveInterval;
let waveCount;
let waves;

function initSkeleton() {
    skeleton = localStorage.getItem("levelSkeleton")
    skeleton = JSON.parse(skeleton) 
    /** 
     * The 'skeleton' is the main JSON object representing the level structure.
     * 
     * Think of it as the backbone of the level, with various "limbs" (sub-objects/arrays)
     * like escalation points, number of plant foods, zombie pool, etc.
     * 
     * When you assign a variable to a part of the skeleton (e.g., let modules = skeleton.objects[0].objdata.Modules),
     * you are referencing a specific limb. Modifying this limb (e.g., pushing to the modules array)
     * directly affects the skeleton, since both point to the same underlying data.
     * 
     * This approach allows you to build and modify the level in a modular way,
     * with all changes reflected in the main skeleton object.
    */
}

function getIndexFromObjects(i){ // helper function 1
    return skeleton.objects[i].objdata
}

function defineLimbs() {
    // Proxies for each major section
    levelDefinition = new Proxy({}, {
        get(target, prop) {
            return skeleton.objects[0].objdata[prop];
        },
        set(target, prop, value) {
            skeleton.objects[0].objdata[prop] = value;
            return true;
        }
    });
    escalation = new Proxy({}, {
        get(target, prop) {
            return skeleton.objects[2].objdata[prop];
        },
        set(target, prop, value) {
            skeleton.objects[2].objdata[prop] = value;
            return true;
        }
    });
    waveManager = new Proxy({}, {
        get(target, prop) {
            return skeleton.objects[4].objdata[prop];
        },
        set(target, prop, value) {
            skeleton.objects[4].objdata[prop] = value;
            return true;
        }
    });
    // For backward compatibility, level is the same as levelDefinition
    level = levelDefinition;

    // You can now use level.StartingSun, escalation.FlagCount, waveManager.FlagWaveInterval, etc.
    let levelDef = getIndexFromObjects(0)
    modules = levelDef.Modules
    name = levelDef.Name
    stage = levelDef.stageModule

    let escalationObj = getIndexFromObjects(2)
    flagCount = escalationObj.FlagCount
    wavesPerFlag = escalationObj.WavesPerFlag
    plantfoodToSpawnCount = escalationObj.PlantfoodToSpawnCount
    startingPoints = escalationObj.StartingPoints
    pointIncrementPerWave = escalationObj.PointIncrementPerWave
    zombiePool = escalationObj.ZombiePool

    let waveManagerObj = getIndexFromObjects(4)
    flagWaveInterval = waveManagerObj.FlagWaveInterval
    waveCount = waveManagerObj.waveCount
    waves = waveManagerObj.Waves
}

function rtid(zombie){ //helper function 2
    return `RTID(${zombie}@ZombieTypes)`
}

function setPool(){
    let basic = rtid(choice(localStorage.getItem('basics').split(",")))
    let cone = rtid(choice(localStorage.getItem('cones').split(",")))
    let bucket = rtid(choice(localStorage.getItem('buckets').split(",")))
    escalation.ZombiePool.push(basic)
    escalation.ZombiePool.push(cone)
    escalation.ZombiePool.push(bucket)
    let k = randint(2,4);
    let zombies = randomDigits(k);
    for (let i = 0; i < k; i++) {
        const element = 'S'+zombies[i];
        console.log(localStorage.getItem(element))
        escalation.ZombiePool.push(rtid(localStorage.getItem(element)))
    }
}

function buildLevel() {
    initSkeleton()
    defineLimbs()
    setPool()
}

buildLevel()

console.log(skeleton)
console.log(localStorage.getItem('basics').split(","))