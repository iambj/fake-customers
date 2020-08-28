const humanNames = require("human-names");
const lastNames = require("common-last-names");
const dogNames = require("dog-names");
const catNames = require("cat-names");
const dogBreeds = require("dog-breeds");

const fs = require("fs");

const ROWS = 5000;

let data = [];

// First Name	Last Name	Pets Names	Breed	Home Phone	Mobile Phone	?	Notes

function shuffleArray(orderedArr) {
    let newArr = [];
    while (orderedArr.length > 0) {
        let pick = Math.floor(Math.random() * orderedArr.length);
        let items = orderedArr.splice(pick, 1)[0];
        newArr.push(items);
    }
    return newArr;
}

function pickOne(objs) {
    // TODO: Use a default of weight:1 if it is omitted.
    // Pass a simple array or pass in a array of objects to
    // with weights: { toBePicked: weight: 1}
    // 1 is default for all and is the standard
    if (!objs || objs.length === 0) return null;
    // console.log("picking");
    if (Array.isArray(objs)) {
        // console.log("array given");
        if (typeof objs[0] === "object") {
            // console.log("weighted");
            // Get name of item to be picked.
            // Only two properties are allowed,
            // and one must be "weight"
            let propName = "";
            for (const [i, k] of objs.entries()) {
                let count = 0;
                let weightIncluded = false;

                for (const j in k) {
                    count++;
                    if (k.hasOwnProperty(j)) {
                        if (j === "weight") {
                            weightIncluded = true;
                        } else {
                            propName = j;
                        }
                    }
                }
                if (!weightIncluded) throw new Error("Weight not included.");
                if (count > 2) {
                    throw new Error("Too many items in objects to pick from.");
                }
            }

            let weightedArr = [];
            for (const i of objs) {
                let weight = i.weight;
                let arr = new Array(weight).fill(i[propName]);
                weightedArr.push(...arr);
            }

            let selection = Math.floor(Math.random() * objs.length);
            let shuffled = shuffleArray(weightedArr);
            return shuffled[selection];
        } else {
            let selection = Math.floor(Math.random() * objs.length);
            return objs[selection];
        }
    } else {
        throw new Error("An array is needed as input");
    }
}

let arr1 = [
    { item: "A", weight: 1 },
    { item: "B", weight: 10 },
    { item: "C", weight: 1 },
    { item: "D", weight: 1 },
    { item: "E", weight: 1 },
];
let arr2 = ["A", "B", "C"];

// console.log(pickOne(arr1));
// console.log(pickOne(arr2));

function generateRows() {
    let rows = [];
    let names = new Set();
    let mobileNums = new Set();
    // let totalDupes = 0;
    for (let i = 0; i < ROWS; i++) {
        let row = [];
        let first = "";
        let last = "";
        let inserted = false;
        while (inserted === false) {
            // console.log("making name...");
            // First name
            first = humanNames.allRandom();
            // Last name
            last = lastNames.random();
            if (!names.has(`${first} ${last}`)) {
                names.add(`${first} ${last}`);
                // Add to row
                row.push(first);
                row.push(last);
                inserted = true;
            } else {
                // console.log("dupe name");
                // totalDupes++;
            }
        }
        // Pet Name and breed
        let animal = pickOne([
            { item: "dog", weight: 7 },
            { item: "cat", weight: 1 },
        ]);
        let breed = "";
        if (animal === "dog") {
            animal = dogNames.allRandom();
            breed = dogBreeds.random().name;
        } else {
            animal = catNames.random();
            breed = "Cat";
        }
        row.push(animal);
        row.push(breed.replace(", ", " "));
        let mobile = generatePhoneNumber(mobileNums);
        row.push(...mobile);
        mobileNums.add(mobile);
        rows.push(row);
    }
    return rows;
}

let startTime = Date.now();

//* slow =(

function generatePhoneNumber(curNums) {
    // Generate a random of a certain amount of digits
    let numbers = new Set(curNums);
    let number = "";

    function random(count) {
        let num = "";
        for (let i = 0; i < count; i++) {
            num += Math.floor(Math.random() * Math.floor(9));
        }
        return num;
    }
    let inserted = false;
    let group = [];
    while (inserted === false) {
        number = `(${random(3)}) ${random(3)}-${random(4)}`;
        if (!numbers.has(number)) {
            numbers.add(number);
            group.push(number);
            // console.log(group);
        }
        if (group.length === 3) {
            inserted = true;
            return group;
        }
    }
}

// for (let i = 0; i < 500000; i++) {
//     console.log(generatePhoneNumber([]), i);
// }

let rows = generateRows();
let csv = "";
// Create the .csv with a trailing newline
rows.forEach((r, i) => {
    let row = r.join(", ");
    // console.log(row);
    csv += `${row}\n`;
});

// console.log(csv);
fs.writeFileSync("./output/customers.csv", csv);

let endTime = Date.now();
console.log(`Time: ${(endTime - startTime) / 1000}s`);

module.exports.pickOne = pickOne;
