import { classFilterAndSorter } from "."



describe("Test class filters work as intended", () => {


    describe("Testing classFilterAndSorter", () => {



        it("filters and sorts utility classes", () => {

            const classes = "outline-solid outline-1 outline-gray-600 outline-[#FFF333]"

            const sortedClasses = classFilterAndSorter(classes)


            expect(sortedClasses).not.toBe(classes)


            expect(sortedClasses.length).toBeLessThan(classes.length)

            expect(sortedClasses).not.toBe("outline-solid outline-1 outline-gray-600")


            expect(sortedClasses).not.toBe("outline-solid outline-1 outline-[#FFF333]")



        })



        it(
            "sorts utility classes based on if it's a digit 1, word 2, color 3 , function 4, variable 5, or args last",
            () => {

                const classes = "random-solid random-[2_4_6] random-1 random-[#FFF333] random-[url(/foo)] random-[--foo]"


                const sortedClasses = classFilterAndSorter(classes)

                expect(sortedClasses).toBe("random-1 random-solid random-[#FFF333] random-[url(/foo)] random-[--foo] random-[2_4_6]")



            })





    })

})