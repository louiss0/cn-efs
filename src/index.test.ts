import { classNamesSorterAndFilter } from "."



describe("Test class filters work as intended", () => {


    describe("Testing classNamesSorterAndFilter", () => {



        it("filters and sorts utility classes", () => {

            const classes = "outline-solid outline-1 outline-gray-600 outline-[#FFF333]"

            const sortedClasses = classNamesSorterAndFilter(classes)


            expect(sortedClasses).not.toBe(classes)


            expect(sortedClasses?.length).toBeLessThan(classes.length)



            expect(sortedClasses).toMatchInlineSnapshot('"outline-1 outline-solid outline-[#FFF333]"')



        })



        it(
            "sorts utility classes based on if it's a digit 1, word 2, color 3 , function 4, variable 5, or args last",
            () => {

                const classes = "random-solid random-[2_4_6] random-1 random-[#FFF333] random-[url(/foo)] random-[--foo]"


                const sortedClasses = classNamesSorterAndFilter(classes)

                expect(sortedClasses).toBe("random-1 random-solid random-[#FFF333] random-[url(/foo)] random-[--foo] random-[2_4_6]")



            })


        it("filters bem classes based on block and modifier", () => {


            const bemClassesWithOnlyModifiers = "card card--foo card--baz"

            const sortedClasses = classNamesSorterAndFilter(bemClassesWithOnlyModifiers)



            expect(sortedClasses).toMatchInlineSnapshot('"card card--baz"')



        })

        it("filters bem classes based on block element or block element element and modifier", () => {

            const bemClassesWithOnlyElementsAndElementModifiers = "card card__title card__title--lg"


            const sortedClasses = classNamesSorterAndFilter(bemClassesWithOnlyElementsAndElementModifiers)


            expect(sortedClasses).toBe("card__title--lg")

        })


        it("throws error when a class that is modifier is in a list that is does'nt have a block ", () => {

            const bemClassesWithOnlyModifiers = " card--lg card--md"





            expect(() => classNamesSorterAndFilter(bemClassesWithOnlyModifiers))
                .toThrowErrorMatchingInlineSnapshot(`
                  "To have a modifier you must have the block card in the list of classes already.
                                      Please put the block as the class that requires the use of the modifier."
                `)


        })


        it("filters arbitraryProperties ", () => {


            const classes = "[font-size:2px] [font-size:4px] [font-size:8px]"


            const sortedClasses = classNamesSorterAndFilter(classes)


            expect(sortedClasses).toBe("[font-size:8px]")


        })

        it("filters based on variants of arbitraryProperties", () => {

            const classes = "[font-size:2px] md:[font-size:4px] md:[font-size:8px] lg:[font-size:6px] lg:[font-size:7px]"


            const sortedClasses = classNamesSorterAndFilter(classes)


            expect(sortedClasses).toBe("[font-size:2px] md:[font-size:8px] lg:[font-size:7px]")


        })

        it(
            `It sorts classes with this order.
                1. BEM first.
                2. Arbitrary Properties.
                3. Utility Classes.
                4. Custom Filtered classes.
            `,
            () => {

                const classes = "absolute border-1 border-dashed border-gray-500 [font-size:2px] card card--large"


                const sortedClasses = classNamesSorterAndFilter(classes, { position: ["absolute", "fixed", "static"] })

                expect(sortedClasses).toBe("card card--large [font-size:2px] border-1 border-dashed border-gray-500 absolute")


            })


        it("throws error when string is not spaced", () => {



            expect(() => classNamesSorterAndFilter("foo"))
                .toThrowErrorMatchingInlineSnapshot('"This string has no sets of classes please add spaces between classes that need to be sorted"')

        })


    })



})








