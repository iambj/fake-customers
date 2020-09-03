const humanNames = require("human-names");
const lastNames = require("common-last-names");
const dogNames = require("dog-names");
const catNames = require("cat-names");
const dogBreeds = require("dog-breeds");
const _b = require("blitu");
const fs = require("fs");

const ROWS = 50;

// Demo:
// generateCSV(_b.benchmark(generateRows, [ROWS], "all"));

function generateCSV(rows) {
    let csv = "";
    // Create the .csv with a trailing newline
    rows.forEach((r, i) => {
        let row = r.join(",");
        csv += `${row}\r\n`;
    });

    fs.writeFileSync("./output/customers.csv", csv);
}

// Row Format:
// First Name	Last Name	Pets Names	Breed	Home Phone	Mobile Phone   Additional Phone    Notes

// This would be a good practice script to work with concurrency or node.js performance.
// The major slow down is that it only uses unique values for names and phone numbers.

// Main function to generate a rows of customers
function generateRows(totalRows) {
    let rows = [];
    let names = new Set(); // Holds full list of Firstname Lastname to check against for uniqueness
    let numbers = new Set(); // Holds full list of phone number to check against for uniqueness
    for (let i = 0; i < totalRows; i++) {
        let row = []; // Current customer (row)

        // Unique Names:
        let name = generateName(names);
        names.add(`${name[0]} ${name[1]}`); // Add name to master list
        row.push(...name); // Add to current row

        // Pet Name and breed
        let { petName, breed } = generatePet();
        row.push(petName);
        row.push(breed.replace(", ", " ")); // Remove commas to clean up issues with generating the CSV

        // Phone numbers - home, mobile, alternative
        let numList = generatePhoneNumber(numbers); // Returns an array of 3 phone numbers
        row.push(...numList);
        numbers.add(numList); // Add numbers to master list

        // Generate a \n delimited list of notes to mimic the current data situation
        row.push(`"${generateNotes()}"`);

        // Add all row data to the main list
        rows.push(row);
    }
    return rows;
}

// Returns an array with firstname, lastname
function generateName(usedNames) {
    let names = new Set(usedNames);
    let first = "";
    let last = "";
    let inserted = false;
    // Find unique names
    while (inserted === false) {
        // First name
        first = humanNames.allRandom();
        // Last name
        last = lastNames.random();
        if (!names.has(`${first} ${last}`)) {
            inserted = true;
            return [first, last];
        }
    }
}

function generatePet() {
    // Returns an object with a name and breed.
    // Pick between a dog or cat, dogs are much more common
    let animal = _b.pickOne([
        { item: "dog", weight: 7 },
        { item: "cat", weight: 1 },
    ]);
    let breed = "";
    // Pick a name based on the animal, use "Cat" as a breed for cats.
    if (animal === "dog") {
        animal = dogNames.allRandom();
        breed = dogBreeds.random().name;
    } else {
        animal = catNames.random();
        breed = "Cat";
    }
    return { petName: animal, breed };
}

// TODO extract random as randomInt(length)
function generatePhoneNumber(curNums) {
    let numbers = new Set(curNums);
    let number = "";

    let inserted = false;
    let group = [];
    while (inserted === false) {
        number = `(${_b.randomIntOfLength(3)}) ${_b.randomIntOfLength(
            3
        )}-${_b.randomIntOfLength(4)}`;
        if (!numbers.has(number)) {
            numbers.add(number);
            group.push(number);
        }
        if (group.length === 3) {
            inserted = true;
            return group;
        }
    }
}

// Generate a fake history of notes, delimited by newlines
function generateNotes() {
    let notesArr = [];
    for (let i = 0; i < _b.randomInRange(6, 20); i++) {
        let possibleNotes = [
            "bath and nails",
            `${_b.randomInRange(0, 8)} body ${_b.randomInRange(
                0,
                8
            )} tail ${_b.randomInRange(0, 8)} face`,
            `skunk bath`,
            `trim and bath`,
            `bath`,
            `nails`,
            `no show`,
        ];
        let note = _b.pickOne(possibleNotes);
        let price = `$${_b.randomInRange(25, 60)}`;
        let date = new Date(
            `${_b.padNumber(_b.randomInRange(2, 12), 4)}/${_b.randomInRange(
                10,
                28
            )}/${_b.randomInRange(2000, 2020)}`
        );
        let row = {
            date,
            msg: `\t${_b.padText(note, 30)}\t\t${price}`,
        };
        notesArr.push(row);
    }
    // Sort notesArr based on date
    let sortedRows = notesArr.sort((a, b) => {
        // Sort ascending. If f(a,b) < 0, a comes first.
        return a.date - b.date;
    });

    let sortedStrings = sortedRows.map((r) => {
        // Clean up basic date format, add padding
        let date = r.date.toLocaleString().split(",")[0];
        let month = _b.padNumber(date.split("/")[0], 2);
        let day = _b.padNumber(date.split("/")[1], 2);
        let year = date.split("/")[2];
        return `${month}/${day}/${year}\t${r.msg}`;
    });
    // Join into one solid \n delimited string to mimic what currently is used
    return sortedStrings.join("\r\n");
}

module.exports = {
    generateName,
    generatePhoneNumber,
    generatePet,
    generateNotes,
};
