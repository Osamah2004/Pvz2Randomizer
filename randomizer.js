location.href = 'index.html'

let A = document.getElementById('redirect');

if (!localStorage.getItem("S0")){
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

// Returns an array of i unique random digits between 0 and 42 inclusive
function randomDigits(i) {
    // Create an array of numbers from 0 to 42
    const digits = Array.from({length: 43}, (_, idx) => idx);
    return sample(digits, i);
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

let flags;
let interval;
let waves;

let initialPoints;
let increment;

let pf;

let escalation = {
    "WaveManagerProps": "RTID(WaveManager@CurrentLevel)"
}

function escalationStats(){
    escalation.FlagCount = flags
    escalation.WavesPerFlag = interval
    escalation.PlantfoodToSpawnCount = pf
    escalation.StartingPoints = initialPoints
    escalation.PointIncrementPerWave = increment
}

function setStats(){
    flags = randint(1,4);
    interval = randint(7,10);
    waves = flags * waves

    initialPoints = randint(2,6) * 50
    increment = randint(2,6) * 50

    pf = randint(0,7)
}

function setPool(){
    let pool = []
    let numOfSpecials = randint(2,4)
    pool.push(zombieType(choice(localStorage.getItem('basics').split(','))))
    pool.push(zombieType(choice(localStorage.getItem('cones').split(','))))
    pool.push(zombieType(choice(localStorage.getItem('buckets').split(','))))
    let digitsArr = randomDigits(numOfSpecials)
    console.log(digitsArr)
    for (let i = 0; i <= numOfSpecials-1; i++){
        pool.push(zombieType(localStorage.getItem(`S${i}`)))
    }
    escalation.ZombiePool = pool
}

function setEscalation(){
    setPool()
    escalationStats()
    console.log(escalation)
    set(escalation,2)
}

function buildLevel(){
    setStats()
    setEscalation()
}

buildLevel()