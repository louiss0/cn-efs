import {
    viableUtilityClassMapKeys,
    type ViableUtilityClassMapKeys,
    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged,
    attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty,
    SortedClasses,
} from './classMapChangers';


type TestContext = SortedClasses

beforeEach<TestContext>((context) => {


    Object.assign(context, new SortedClasses())

})




const createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue = (key: ViableUtilityClassMapKeys) =>
    `For class $className the key for the created map is called $expected.key the value is a map with a key called ${key} with the value of $expected.value .`


const insertMessagePrefix = "inserts the word before the dash as key and the word after the dash in a map with a key";


describe("Test if all class map changers work", () => {





    describe("Test attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged()", () => {


        it<TestContext>("doesn't change the map if there is a single word class", ({ utility }) => {


            attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(utility, "outline")



            expect(utility).toHaveLength(0)



        })




        describe(
            `Changes the map to one that has key with the word before the dash and inserts the value in a map with the property digit. 
             If it's a number.
            `,
            () => {


                it<TestContext>("changes the map when a class with a digit is passed in", ({ utility }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(utility, "outline-0")


                    expect(utility).toHaveLength(1)


                })




                it<TestContext>(
                    `${insertMessagePrefix} called digit with it as the value when the value is a number.`,
                    ({ utility }) => {


                        attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(utility, "outline-0")



                        expect(utility.has("outline")).toBeTruthy()


                        const res = utility.get("outline")

                        expect(res).toBeInstanceOf(Map)


                        expect(Object.fromEntries(res as Map<string, string>)).toHaveProperty("digit", "0")




                    })



                describe(
                    createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("digit"),
                    () => {




                        const classMap = new Map()

                        it.each([
                            {
                                className: "width-0",
                                expected: { key: "width", value: "0" }
                            },
                            {
                                className: "width-[25]",
                                expected: { key: "width", value: "[25]" }
                            },
                            {
                                className: "width-[45ch]",
                                expected: { key: "width", value: "[45ch]" }
                            },
                            {
                                className: "width-33",
                                expected: { key: "width", value: "33" }
                            },

                        ])(
                            createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("digit"),
                            ({ className, expected: { key, value } }) => {


                                attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, className)


                                expect(classMap.has(key)).toBeTruthy()


                                const res = classMap.get(key)


                                expect(res).toBeInstanceOf(Map)



                                expect(Object.fromEntries(res))
                                    .toHaveProperty("digit", value)

                                expect(Object.fromEntries(res))
                                    .not.toHaveProperty("word")







                            })

                    }
                )






            }
        )




        describe("Works well with words and multiple args", () => {



            it<TestContext>(
                `${insertMessagePrefix} called word with it as the value when the value is a word.`,
                ({ utility }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(utility, "outline-solid")


                    expect(utility.has("outline")).toBeTruthy()


                    const res = utility.get("outline")

                    expect(res).toBeInstanceOf(Map)


                    expect(Object.fromEntries(res as Map<string, string>)).toHaveProperty("word", "solid")


                }
            )



            it<TestContext>(
                `${insertMessagePrefix} called args with it as the value when multiple args are passed.`,
                ({ utility }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(utility, "grid-cols-[2fr_auto]")



                    expect(utility.has("grid-cols")).toBeTruthy()


                    const res = utility.get("grid-cols")

                    expect(res).toBeInstanceOf(Map)


                    expect(Object.fromEntries(res as Map<string, string>)).toHaveProperty("args", "[2fr_auto]")


                }
            )



            const classMap = new Map()

            it.each(
                [

                    {
                        className: "border-[2_solid_3px]",
                        expected: {
                            key: "border",
                            value: "[2_solid_3px]"
                        }
                    },
                    {
                        className: "numbers-[09_word_3px]",
                        expected: {
                            key: "numbers",
                            value: "[09_word_3px]"
                        }
                    },
                    {
                        className: "grid-cols-[45px_repeat(2,fr)_minmax(auto-fill,35rem)]",
                        expected: {
                            key: "grid-cols",
                            value: "[45px_repeat(2,fr)_minmax(auto-fill,35rem)]"
                        }
                    },
                    {
                        className: "bg-[url(/img.jpg)_full]",
                        expected: {
                            key: "bg",
                            value: "[url(/img.jpg)_full]"
                        }
                    },


                ]
            )
                (
                    createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("args"),
                    ({ className, expected: { key, value } }) => {


                        attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, className)



                        expect(classMap.has(key)).toBeTruthy()


                        const res = classMap.get(key)


                        expect(res).toBeInstanceOf(Map)



                        expect(Object.fromEntries(res)).toHaveProperty("args", value)




                    }
                )




        })



        describe("It works well with classes that are used for colors", () => {

            it<TestContext>(
                `${insertMessagePrefix} called color with it as the value when the value is a color-range.`,
                ({ utility }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(utility, "outline-gray-500")



                    expect(utility.has("outline")).toBeTruthy()


                    const res = utility.get("outline")

                    expect(res).toBeInstanceOf(Map)


                    expect(Object.fromEntries(res as Map<string, string>)).toHaveProperty("color", "gray-500")


                }
            )



            const classMap = new Map()

            it.each([
                {
                    className: "border-[hsl(123,25%,90%)]",
                    expected: {
                        key: "border",
                        value: "[hsl(123,25%,90%)]"
                    }
                },
                {
                    className: "border-[hsl(123_25%_90%)]",
                    expected: {
                        key: "border",
                        value: "[hsl(123_25%_90%)]"
                    }
                },
                {
                    className: "bg-[hsl(20_25%_50%)]",
                    expected: {
                        key: "bg",
                        value: "[hsl(20_25%_50%)]"
                    }
                },
                {
                    className: "bg-[hsl(180,25%,60%)]",
                    expected: {
                        key: "bg",
                        value: "[hsl(180,25%,60%)]"
                    }
                },
            ])
                (
                    createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("color"),
                    ({ className, expected: { key, value } }) => {

                        attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, className)


                        expect(classMap.has(key)).toBeTruthy()


                        const result = classMap.get(key)



                        expect(Object.fromEntries(result)).toHaveProperty(viableUtilityClassMapKeys["2"], value)




                    }
                )

        })




        describe("It works well with function args that aren't color functions", () => {



            const classMap = new Map()

            it.each([
                {
                    className: "grid-cols-[repeat(auto-fill,384px)]",
                    expected: {
                        key: "grid-cols",
                        value: "[repeat(auto-fill,384px)]"
                    }
                },
                {
                    className: "font-size-[clamp(200px,40vw,600px)]",
                    expected: {
                        key: "font-size",
                        value: "[clamp(200px,40vw,600px)]"
                    }
                },
                {
                    className: "bg-[url(/image.jpg)]",
                    expected: {
                        key: "bg",
                        value: "[url(/image.jpg)]"
                    }
                },
                {
                    className: "content-[counter(first-one)]",
                    expected: {
                        key: "content",
                        value: "[counter(first-one)]"
                    }
                },

            ])(
                createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("function"),
                ({ className, expected: { key, value } }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, className)


                    expect(classMap.has(key)).toBeTruthy()


                    const result = classMap.get(key)



                    expect(Object.fromEntries(result))
                        .toHaveProperty(viableUtilityClassMapKeys[4], value)

                    expect(Object.fromEntries(result))
                        .not.toHaveProperty(viableUtilityClassMapKeys[2], value)



                })

        })



        describe("It works well with variables", () => {


            const classMap = new Map()



            it.each(
                [
                    {
                        className: "outline-[--gray-light-1]",
                        expected: {
                            key: "outline",
                            value: "[--gray-light-1]"
                        }
                    },
                    {
                        className: "font-size-[length:--step-2]",
                        expected: {
                            key: "font-size",
                            value: "[length:--step-2]"
                        }
                    },
                    {
                        className: "bg-[--primary-color]",
                        expected: {
                            key: "bg",
                            value: "[--primary-color]"
                        }
                    },
                    {
                        className: "border-[color:--gray-9]",
                        expected: {
                            key: "border",
                            value: "[color:--gray-9]"
                        }
                    },

                ]
            )(
                createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("variable"),
                ({ className, expected: { key, value } }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, className)


                    expect(classMap.has(key)).toBeTruthy()


                    const result = classMap.get(key)



                    expect(Object.fromEntries(result))
                        .toHaveProperty(viableUtilityClassMapKeys[3], value)

                    expect(Object.fromEntries(result))
                        .not.toHaveProperty(viableUtilityClassMapKeys[5], value)



                })


        })





    })



    describe("Test attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged()", () => {


        it<TestContext>("doesn't change the map if there is a single word class", ({ customFiltered }) => {


            attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged({}, customFiltered, "nice")



            expect(customFiltered).toHaveLength(0)



        })



        it<TestContext>(
            `Changes the class Map by putting a key that is in the filter Object with a value that is 
             one of the list of values in the Array that key accesses from the filter object.  
            `,
            ({ customFiltered }) => {


                attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged({
                    position: ["fixed", "absolute"]
                },
                    customFiltered,
                    "fixed"
                )


                expect(customFiltered.has("position")).toBeTruthy()

                expect(customFiltered.get("position")?.get("base")).toBe("fixed")



            })


        it<TestContext>(
            `When iterating through a list of class names.
            If a utility class is found in the filter object's list of classes.
            The key associated with the list where it is found will be used as a key in the
            map It's value will be a map with the key of base and the value being the class.     
            `,
            ({ customFiltered }) => {


                const classNames = ["fixed", "absolute", "static"]


                const filterObject = {
                    position: ["fixed", "absolute", "static", "relative", "sticky"]
                };

                classNames.forEach((value) => {

                    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged(
                        filterObject,
                        customFiltered,
                        value
                    )

                })



                expect(customFiltered.has("position")).toBeTruthy()

                const variantAndClassMap = customFiltered.get("position")

                expect(variantAndClassMap?.get("base")).toBe(classNames.at(-1))



            })


        it<TestContext>(
            `When sorting based on class names if no variant is provided
            the default variant will be base and it's value the class
            when a it is provided then the key will be the variant
            and the value the   
            `,
            ({ customFiltered }) => {


                const classNames = ["hidden", "md:block",]


                const filterObject = {
                    display: [
                        "hidden",
                        "block",
                        "static",
                        "relative",
                        "sticky"
                    ]
                };

                classNames.forEach((value) => {

                    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged(
                        filterObject,
                        customFiltered,
                        value
                    )

                })



                expect(customFiltered.has("display")).toBeTruthy()

                const variantAndClassMap = customFiltered.get("display")

                expect(variantAndClassMap?.get("base")).toBe("hidden")

                expect(variantAndClassMap?.get("md:")).toBe("block")



            })




    })




    describe("Test attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty()", () => {



        it<TestContext>(
            `The arbitraryProperties map has a key inserted that is the arbitrary property key and a value.
            That value is a map with a key called base and a value that is the arbitrary property value.
            `,
            ({ arbitraryProperties }) => {


                attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty(arbitraryProperties, "[font-size:2rem]")



                expect(arbitraryProperties.has("font-size:")).toBeTruthy()

                expect(arbitraryProperties.get("font-size:")?.get("base")).toBe("2rem")



            })

        describe("It works with lots of arbitrary properties", () => {


            const classMap = new Map()

            it.each([
                {
                    className: "[font-size:4rem]",
                    expected: {
                        key: "font-size:",
                        value: "4rem"
                    }
                },
                {
                    className: "[border:2px_solid_green]",
                    expected: {
                        key: "border:",
                        value: "2px_solid_green"
                    }
                },
                {
                    className: "[text-transform:uppercase]",
                    expected: {
                        key: "text-transform:",
                        value: "uppercase"
                    }
                },
                {
                    className: "[background-position-x:center]",
                    expected: {
                        key: "background-position-x:",
                        value: "center"
                    }
                },
                {
                    className: "[background-image:url(/img.jpg)]",
                    expected: {
                        key: "background-image:",
                        value: "url(/img.jpg)"
                    }
                }
            ])("For class $className I expect there to be a value with the key of $expected.key and the value $expected.value ",
                ({ className, expected: { key, value } }) => {



                    attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty(classMap, className)


                    expect(classMap.has(key)).toBeTruthy()

                    expect(classMap.get(key).get("base")).toBe(value)





                })

        })


        describe("It works with lots of arbitrary properties that have modifiers", () => {


            const classMap = new Map()

            it.each([
                {
                    className: "sm:[font-size:4rem]",
                    expected: {
                        key: "font-size:",
                        variant: "sm:",
                        value: "4rem"
                    }
                },
                {
                    className: "md:[font-size:6rem]",
                    expected: {
                        key: "font-size:",
                        variant: "md:",
                        value: "6rem"
                    }
                },
                {
                    className: "lg:hover:[font-size:6rem]",
                    expected: {
                        key: "font-size:",
                        variant: "lg:hover:",
                        value: "6rem"
                    }
                },

            ])(
                "For class $className I expect there to be a value with the key of $expected.key and the value $expected.value variant to be $expected.variant ",
                ({ className, expected: { key, value, variant } }) => {



                    attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty(classMap, className)


                    expect(classMap.has(key)).toBeTruthy()


                    const variantAndValueMap = classMap.get(key);

                    expect(variantAndValueMap).toBeInstanceOf(Map)


                    expect(variantAndValueMap.get(variant)).toBe(value)






                })

        })



    })



    describe("Test attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged()", () => {


        it<TestContext>("doesn't change the map if there is a single word class", ({ bem }) => {


            attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(bem, "nice")



            expect(bem).toHaveLength(0)



        })


        it<TestContext>("alters the BEM map when bem classes are encountered", ({ bem }) => {



            const bemClasses = ["card", "card__title", "card__title--lg", "card--lg"];


            bemClasses.forEach((className) => {

                attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(bem, className)
            })


            expect(bem.has("card")).toBeTruthy()

            const cardElementAndModifierMap = bem.get("card");

            expect(cardElementAndModifierMap?.has("element")).toBeTruthy()


            expect(cardElementAndModifierMap?.has("modifier")).toBeTruthy()




        })


        it<TestContext>("adds an  element to the map when a lower_case_word and two underscores are encountered", ({ bem }) => {


            // const bemClasses = ["card",  "card__title--lg", "card--lg"];


            attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(bem, "card__title")

            const cardElementAndModifierMap = bem.get("card");

            expect(cardElementAndModifierMap?.has("element")).toBeTruthy()

            expect(cardElementAndModifierMap?.get("element")).toBe("__title")




        })



        it<TestContext>(
            `When a lower_case_word is encountered with two underscores.
             The map is changed to have a key with the word on the left of the two underscores as a key.
             The value is a Map called that has a key called element with value that is the two underscores plus the word.  
            `,
            ({ bem }) => {


                // const bemClasses = ["card",  "card__title--lg", "card--lg"];


                attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(bem, "card__title")

                const cardElementAndModifierMap = bem.get("card");

                expect(cardElementAndModifierMap?.has("element")).toBeTruthy()

                expect(cardElementAndModifierMap?.get("element")).toBe("__title")




            })

        it<TestContext>(
            `When a lower_case_word is encountered with two dashes.
             The map is changed to have a key with the word on the left of the two dashes as a key.
             The value is a Map called that has a key called element with value that is the two dashes plus the word.  
            `,
            ({ bem }) => {


                // const bemClasses = ["card",  "card__title--lg", "card--lg"];


                attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(bem, "card__title")

                const cardElementAndModifierMap = bem.get("card");

                expect(cardElementAndModifierMap?.has("element")).toBeTruthy()

                expect(cardElementAndModifierMap?.get("element")).toBe("__title")




            })




    })






})







