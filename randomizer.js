let A = document.getElementById('redirect');

if (!localStorage.getItem("specials")){
    A.click()
}

sessionStorage.setItem("skeleton",localStorage.getItem('levelSkeleton'))

// Python-like random functions for JavaScript

/**
 * Returns a random integer N such that a <= N <= b (inclusive).
 * Equivalent to Python's random.randint(a, b)
 */
function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * Returns a random element from the given array.
 * Equivalent to Python's random.choice(seq)
 */
function choice(arr) {
    return arr[randint(0, arr.length - 1)];
}

/**
 * Returns a new array of k unique random elements from the given array.
 * Equivalent to Python's random.sample(population, k)
 * (sample is used to get k unique elements from an array)
 */
function sample(arr, k) {
    if (k > arr.length) throw new RangeError("Sample size cannot be greater than array length");
    let copy = arr.slice();
    let result = [];
    for (let i = 0; i < k; i++) {
        let idx = randint(0, copy.length - 1);
        result.push(copy[idx]);
        copy.splice(idx, 1);
    }
    return result;
}

function get(index){
    return JSON.parse(sessionStorage.getItem('skeleton')).objects[index].objdata;
}

function set(value,index){
    let newSkeleton = JSON.parse(sessionStorage.getItem('skeleton'))
    newSkeleton.objects[index].objdata = value
    sessionStorage.setItem('skeleton',JSON.stringify(newSkeleton))
}

function zombieType(zombie){
    return `RTID(${zombie}@ZombieTypes)`
}

function levelModule(module){
    return `RTID(${module}@LevelModules)`
}

let stage;

let flags;
let interval;
let waves;

let initialPoints;
let increment;

let pf;

let escalation = {
    "WaveManagerProps": "RTID(WaveManager@CurrentLevel)"
}

let newWaves = {
    "FlagWaveInterval": 8,
    "WaveCount": 0,
    "SuppressFlagZombie": false,
    "Waves": []
}

let levelDefinition = get(0)

function newWavesStats(){
    newWaves.FlagWaveInterval = interval;
    newWaves.WaveCount = waves
    set(newWaves,4)
}

function escalationStats(){
    escalation.FlagCount = flags
    escalation.WavesPerFlag = interval
    escalation.PlantfoodToSpawnCount = pf
    escalation.StartingPoints = initialPoints
    escalation.PointIncrementPerWave = increment
}

function setStats(){
    stage = choice(getArrayFromLocalStorage('stages'))

    flags = randint(1,4);
    interval = randint(7,10);
    waves = flags * interval

    initialPoints = randint(2,6) * 50
    increment = randint(2,6) * 50

    pf = randint(0,7)
}

function getArrayFromLocalStorage(key){
    return localStorage.getItem(key).split(',')
}

function setPool(){
    let pool = []
    let numOfSpecials = randint(2,4)
    let specials = getArrayFromLocalStorage('specials')
    pool.push(zombieType(choice(getArrayFromLocalStorage('basics'))))
    pool.push(zombieType(choice(getArrayFromLocalStorage('cones'))))
    pool.push(zombieType(choice(getArrayFromLocalStorage('buckets'))))
    specials = sample(specials,numOfSpecials)
    specials.forEach(e => {
        pool.push(zombieType(e))
    });
    escalation.ZombiePool = pool
}

function setEscalation(){
    setPool()
    escalationStats()
    set(escalation,2)
}

function setLevelDefinition(){
    levelDefinition.Description = choice(getArrayFromLocalStorage('descriptions'))
    levelDefinition.StageModule = levelModule(stage+'Stage')
    levelDefinition.Modules.push(levelModule(stage+'Mowers'))
    set(levelDefinition,0)
}

function buildLevel(){
    setStats()
    setEscalation()
    newWavesStats()
    setLevelDefinition()
}

buildLevel()

console.log(levelDefinition)