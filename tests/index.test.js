const main = require("../index");

describe("Test customer generation.", () => {
    describe("Generate a first and last name for a customer.", () => {
        let name = main.generateName(new Set());
        it("should return an array with a length of 2", () => {
            expect(name.length).toBe(2);
        });
        it("should return a correctly formatted array of first and last name", () => {
            expect(name[0]).toMatch(/\w+/);
            expect(name[1]).toMatch(/\w+/);
        });
    });

    describe("Generate phone numbers for a customer.", () => {
        it("should return 3 numbers in an array", () => {
            let numbers = main.generatePhoneNumber([]);
            expect(numbers.length).toBe(3);
        });
        it("should return a correctly formatted phone number ((###) ###-####)", () => {
            let numbers = main.generatePhoneNumber([]);
            expect(numbers[0]).toMatch(/\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}/);
        });
    });

    describe("Generate a pet.", () => {
        it("should return an object with a name and a breed", () => {
            let pet = main.generatePet([]);
            expect(pet).toHaveProperty("petName");
            expect(pet).toHaveProperty("breed");
        });
        // it("should return an object with a cat name and 'Cat' as the breed", () => {
        //!     Mock functions not working...
        //     main.pickOne = function () {
        //         return "cat";
        //     };

        //     console.log(main.pickOne());
        //     let pet = main.generatePet();
        //     expect(pet).toHaveProperty("petName");
        //     expect(pet).toHaveProperty("breed", "Cat");
        // });
    });

    describe("Generate notes for a customer.", () => {
        it("should return an a string containing a padded date (##/##/####)", () => {
            let notes = main.generateNotes();
            expect(notes).toMatch(/^\d{2}\/\d{2}\/\d{4}/);
        });
        it("should return an a string containing a 2 digit price", () => {
            let notes = main.generateNotes();
            expect(notes).toMatch(/\$\d{2}/);
        });
    });
});
