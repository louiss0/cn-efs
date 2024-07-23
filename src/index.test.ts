import { bootstrapCN_EFS, cnEFS, tailwindOrWindiCN_EFS } from "."



describe("Testing Class Name Evaluator Filter Sorters work as intended", () => {





    describe("Testing cnEFS", () => {

        it("filters bem classes based on block and modifier", () => {


            const bemClassesWithOnlyModifiers = "card card--foo card--baz"

            const sortedClasses = cnEFS(bemClassesWithOnlyModifiers)



            expect(sortedClasses).toMatchInlineSnapshot('"card card card--baz"')



        })

        it("throws error when string is not spaced", () => {



            expect(() => cnEFS("foo"))
                .toThrowErrorMatchingInlineSnapshot("[Error: This string has no sets of classes please add spaces between classes that need to be sorted]")

        })

        it("filters bem classes based on block element or block element element and modifier", () => {

            const bemClassesWithOnlyElementsAndElementModifiers = "card card__title card__title--lg"


            const sortedClasses = cnEFS(bemClassesWithOnlyElementsAndElementModifiers)


            expect(sortedClasses).toBe("card card__title--lg")

        })


        it("throws error when a class that is modifier is in a list that is does'nt have a block ", () => {

            const bemClassesWithOnlyModifiers = " card--lg card--md"





            expect(() => cnEFS(bemClassesWithOnlyModifiers))
                .toThrowErrorMatchingInlineSnapshot(`
                  [Error: To have a modifier you must have the block card in the list of classes already.
                                      Please put the block as the class that requires the use of the modifier.]
                `)


        })



        it("filters and sorts utility classes", () => {

            const classes = ["border-solid", "border-1", "border-gray-600", "border-red-50"]

            const sortedClasses = cnEFS(...classes)


            expect(sortedClasses).not.toBe(classes.join(" "))


            expect(sortedClasses?.length).toBeLessThan(classes.join(" ").length)



            expect(sortedClasses).toBe("border-1 border-solid border-red-50")



        })


    })


    describe("Testing tailwindOrWindiCN_EFS", () => {


        it(
            "resolves differences between single word and classes that can have a value",
            () => {

                const classes = [
                    'transition',
                    'transition-transform',
                    'border',
                    'border-gray-300',
                    'border-dotted',
                    'border-1',
                ]

                const sortedClasses = tailwindOrWindiCN_EFS(classes)


                expect(sortedClasses).toBe(
                    'transition-transform border-1 border-dotted border-gray-300'
                )


            }
        )

        it(
            "resolves differences between can have a value and classes that single word ",
            () => {

                const classes = [
                    'transition-transform',
                    'transition',
                    'border-1',
                    'border-gray-300',
                    'border-dotted',
                    'border',
                ]

                const sortedClasses = tailwindOrWindiCN_EFS(classes)


                expect(sortedClasses)
                    .toBe('transition border border-dotted border-gray-300')


            }
        )

        it(
            "filters out classes based on a it's filter object",
            () => {

                const classes = [
                    "fixed",
                    "absolute",
                    "sticky",
                ]

                const sortedClasses = tailwindOrWindiCN_EFS(classes)


                expect(sortedClasses).toBe(classes.at(-1))


            })


        it("filters and sorts utility classes", () => {

            const classes = [
                "outline-solid",
                "outline-1",
                "outline-gray-600",
                "outline-[#FFF333]"
            ]

            const sortedClasses = tailwindOrWindiCN_EFS(classes)


            expect(sortedClasses).not.toBe(classes)


            expect(!sortedClasses.includes("outline-gray-600")).toBeTruthy()



            expect(sortedClasses).toMatchInlineSnapshot('"outline-1 outline-solid outline-[#FFF333]"')



        })



        it(
            "sorts utility classes based on if it's a digit 1, word 2, color 3 , function 4, variable 5, or args last",
            () => {

                const classes = "random-solid random-[2_4_6] random-1 random-[#FFF333] random-[url(/foo)] random-[--foo]"


                const sortedClasses = tailwindOrWindiCN_EFS(classes)

                expect(sortedClasses).toBe("random-1 random-solid random-[#FFF333] random-[url(/foo)] random-[--foo] random-[2_4_6]")



            }
        )



        it("filters arbitraryProperties ", () => {


            const classes = "[font-size:2px] [font-size:4px] [font-size:8px]"


            const sortedClasses = tailwindOrWindiCN_EFS(classes)


            expect(sortedClasses).toBe("[font-size:8px]")


        })

        it("filters based on variants of arbitraryProperties", () => {

            const classes = "[font-size:2px] md:[font-size:4px] md:[font-size:8px] lg:[font-size:6px] lg:[font-size:7px]"


            const sortedClasses = tailwindOrWindiCN_EFS(classes)


            expect(sortedClasses).toBe("[font-size:2px] md:[font-size:8px] lg:[font-size:7px]")


        })

        it(
            `It sorts classes with this order.
                1. Custom Filtered classes.
                2. Arbitrary Properties.
                3. Utility Classes.
            `,
            () => {

                const classes = "absolute border-1 border-dashed border-gray-500 [font-size:2px]"


                const sortedClasses = tailwindOrWindiCN_EFS(classes)

                expect(sortedClasses).toBe("absolute [font-size:2px] border-1 border-dashed border-gray-500")


            })





    })


    describe("Testing bootstrapCN_EFS", () => {


        it(
            `It sorts classes with this order.
                1. Safe listed Properties.
                2. Custom Filtered classes.
                3. Utility Classes.
            `,
            () => {

                const safeListedClasses = "absolute"

                const customFilteredClasses = [
                    "invisible",
                    "collapse",
                    "visible",
                ]

                const bootstrapUtilityClass = "border-1 border-primary"


                const sortedClasses = bootstrapCN_EFS(
                    bootstrapUtilityClass,
                    customFilteredClasses,
                    safeListedClasses
                )

                /** biome-ignore lint/style/noNonNullAssertion:
                 * customFilteredClasses is on top the value will be derived 
                 *  
                */
                const lastClassName = customFilteredClasses.at(-1)!

                expect(sortedClasses)
                    .toBe(
                        safeListedClasses.concat(
                            lastClassName.padStart(lastClassName.length + 1),
                            bootstrapUtilityClass.padStart(bootstrapUtilityClass.length + 1)
                        )
                    )


            })





        it("works", () => {



            const res = bootstrapCN_EFS("bg-red bg-blue")


            expect(res).toBe("bg-blue")



        })

        it("filters out based on breakpoints", () => {

            const res = bootstrapCN_EFS("bg-md-red bg-md-green")


            expect(res).toBe("bg-md-green")


        })


        it("filters out based on states", () => {

            const res = bootstrapCN_EFS("bg-blue bg-red-hover bg-green-hover")


            expect(res).toBe("bg-blue bg-green-hover")


        })






        it("filters out based on states and breakpoints", () => {

            const res = bootstrapCN_EFS(
                "bg-blue bg-red-hover bg-green-hover bg-md-black-hover bg-md-blue-hover"
            )


            expect(res).toBe("bg-blue bg-green-hover bg-md-blue-hover")


        })


        it("filters based on conventional bootstrap colors", () => {

            const res = bootstrapCN_EFS(
                "bg-primary",
                "bg-primary-emphasis",
                "text-warning-subtle-hover",
                "text-warning-hover"
            )


            expect(res).toBe("bg-primary-emphasis text-warning-hover")



        })


    })



})








