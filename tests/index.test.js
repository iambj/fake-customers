const main = require("../index");

describe("pickOne", () => {
    it("test pickOne null input", () => {
        let result = main.pickOne();
        expect(result).toBeNull();
    });

    it("test pickOne basic array empty", () => {
        let result = main.pickOne([]);
        expect(result).toBeNull();
    });

    it("test pickOne basic array", () => {
        let arr = ["A", "B", "C"];
        let result = main.pickOne(arr);
        expect(result).toMatch(/.*/);
    });

    it("test pickOne basic array with weights", () => {
        let arr = [
            { item: "A", weight: 1 },
            { item: "B", weight: 10 },
            { item: "C", weight: 1 },
            { item: "D", weight: 1 },
            { item: "E", weight: 1 },
        ];
        let arrNums = [
            { item: 1, weight: 1 },
            { item: 2, weight: 10 },
        ];

        let arrFuncs = [
            {
                item: () => {
                    return 1;
                },
                weight: 1,
            },
            {
                item: () => {
                    return 2;
                },
                weight: 10,
            },
        ];

        let result = main.pickOne(arr);
        let resultNums = main.pickOne(arrNums);
        let resultFuncs = main.pickOne(arrFuncs);
        expect(result).toMatch(/.*/);
        expect(resultNums).toBeGreaterThanOrEqual(1);
        expect(typeof resultFuncs).toBe("function");
    });

    it("test pickOne basic array with a missing weight", () => {
        let arr = [
            { item: "A", weigsht: 1 },
            { item: "B", weight: 10 },
            { item: "C", weight: 1 },
            { item: "D", weight: 1 },
            { item: "E", weight: 1 },
        ];
        expect(() => {
            main.pickOne(arr);
        }).toThrow();
    });
});

// Also can pick other things besides a string...

/*

.toContain("")
.toMatch(//)
.toBe()
.toBeClose

*/
