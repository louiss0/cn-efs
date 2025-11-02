import {
    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnAFilterObject,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup,
    attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue,
    attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass,
    attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue,
    type ClassTypesWithRelationShipsWithOtherClassTypes,
} from './classMapChangers';


import {
    viableUtilityClassMapKeys,
    type ViableUtilityClassMapKeys,
    BootstrapClassNamesMap,
    TailwindClassNamesMap,
    BEMClassNamesMap,
} from './ClassNameMaps';


const itUsingBootstrapSortedClasses = it.extend<{ sortedBootstrapClasses: BootstrapClassNamesMap }>({
    // biome-ignore lint/correctness/noEmptyPattern: Vitest will not run without object destructuring
    async sortedBootstrapClasses({ }, use) {


        await use(new BootstrapClassNamesMap())


    },

})

const itUsingTailwindSortedClasses = it.extend<{ sortedTailwindClasses: TailwindClassNamesMap }>({
    // biome-ignore lint/correctness/noEmptyPattern: Vitest will not run without object destructuring
    async sortedTailwindClasses({ }, use) {



        await use(new TailwindClassNamesMap())


    },

})

const itUsingBEMSortedClasses = it.extend<{ sortedBEMClasses: BEMClassNamesMap }>({
    // biome-ignore lint/correctness/noEmptyPattern: Vitest will not run without object destructuring
    async sortedBEMClasses({ }, use) {

        await use(new BEMClassNamesMap())

    },
})



const createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue = (key: ViableUtilityClassMapKeys) =>
    `For class $className the key for the created map is called $expected.key the value is a map with a key called ${key} with the value of $expected.value .`


const insertMessagePrefix = "inserts the word before the dash as key and the word after the dash in a map with a key";


describe("Test if all class map changers work", () => {


    describe(
        "Testing attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue",
        () => {

            describe(
                "Changes the class map based on the value of a slashValue utility class.",
                () => {

                    const crossValueUtilityClassRelationShipWithClassesObject: ClassTypesWithRelationShipsWithOtherClassTypes = {
                        text: {
                            classType: "text-",
                            valueType: "word",
                            secondary: {
                                classType: "leading-",
                                valueType: "digit"
                            }
                        },
                        shadow: {
                            classType: "shadow-",
                            valueType: "color",
                            secondary: {
                                classType: "opacity-",
                                valueType: "digit",
                            },
                        },
                        accent: {
                            classType: "accent-",
                            valueType: "color",
                            secondary: {
                                classType: "opacity-",
                                valueType: "digit"
                            }
                        },
                        bg: {
                            classType: "bg-",
                            valueType: "color",
                            secondary: {
                                classType: "opacity-",
                                valueType: "digit"
                            }
                        },
                        border: {
                            isDirectional: true,
                            classType: "border-",
                            valueType: "color",
                            secondary: {
                                classType: "opacity-",
                                valueType: "digit"
                            }
                        },
                        divide: {
                            isDirectional: true,
                            classType: "divide-",
                            valueType: "color",
                            secondary: {
                                classType: "opacity-",
                                valueType: "digit"
                            }
                        },
                        ring: {
                            classType: "ring-",
                            valueType: "color",
                            secondary: {
                                classType: "opacity-",
                                valueType: "digit"
                            }
                        },
                    }

                    itUsingTailwindSortedClasses(
                        "Adds the slash value to the class map then removes it's related classes.",
                        ({ sortedTailwindClasses: { utility } }) => {

                            const classes = ["leading-6", "text-sm", "text-lg/6"]

                            for (const value of classes) {
                                attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue(
                                    utility,
                                    value,
                                    crossValueUtilityClassRelationShipWithClassesObject
                                )
                            }



                            expect(utility.get("text-")?.has("slashValue")).toBeTruthy()

                            expect(utility.get("leading-")?.has("color")).toBeFalsy()

                            expect(utility.get("text-")?.has("word")).toBeFalsy()


                        }
                    )


                    itUsingTailwindSortedClasses(
                        "Adds the slash value to the class map then removes related directional classes.",
                        ({ sortedTailwindClasses: { utility } }) => {

                            const classes = ["border-gray-500", "border-x-gray-500/50"]

                            for (const value of classes) {
                                attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue(
                                    utility,
                                    value,
                                    crossValueUtilityClassRelationShipWithClassesObject
                                )
                            }



                            expect(utility.get("border-x-")?.has("slashValue"))
                                .toBeTruthy()


                            expect(utility.get("border-")?.has("color")).toBeFalsy()


                        }
                    )

                }

            )




        })


    describe("Testing attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass", () => {

        itUsingTailwindSortedClasses(
            "resolves differences between single word and classes that can have a value",
            ({ sortedTailwindClasses }) => {


                sortedTailwindClasses.safeListed.push('transition')


                attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass(
                    sortedTailwindClasses,
                    'transition-transform'
                )




                expect(sortedTailwindClasses.safeListed.includes('transition'))
                    .toBeFalsy()

                expect(sortedTailwindClasses.utility.has('transition-'))
                    .toBeTruthy()

                expect(sortedTailwindClasses.utility.get('transition-')?.has('word'))
                    .toBeTruthy()



            }
        )

        itUsingTailwindSortedClasses(
            "resolves differences between classes that have a value and classes that are a single word ",
            ({ sortedTailwindClasses }) => {

                sortedTailwindClasses.utility.set(
                    "transition-",
                    new Map().set(
                        'word',
                        new Map().set(
                            'value',
                            'transform'
                        ).set('prefix', '')
                    )
                )


                attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass(
                    sortedTailwindClasses,
                    'transition'
                )




                expect(sortedTailwindClasses.utility.get('transition-')
                    ?.has('word')
                ).toBeFalsy()


                expect(sortedTailwindClasses.safeListed.includes('transition'))
                    .toBeTruthy()



            }
        )
    })


    describe("Testing attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue()", () => {


        itUsingBootstrapSortedClasses("doesn't change the map if there is a single word class", ({ sortedBootstrapClasses: { utility } }) => {




            attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(utility, "outline")




            expect(utility).toHaveLength(0)



        })




        describe(
            `Changes the map to one that has key with the word before the dash and inserts the value in a map with the property digit. 
             If it's a number.
            `,
            () => {


                itUsingBootstrapSortedClasses("changes the map when a class with a digit is passed in", ({ sortedBootstrapClasses: { utility } }) => {


                    attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(utility, "outline-0")


                    expect(utility).toHaveLength(1)


                })




                itUsingBootstrapSortedClasses(
                    `${insertMessagePrefix} called digit a map with the key called of base where it is the value of that key.
                      When the value is a number.`,
                    ({ sortedBootstrapClasses: { utility } }) => {


                        attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(utility, "outline-0")



                        expect(utility.has("outline")).toBeTruthy()


                        const res = utility.get("outline")

                        expect(res).toBeInstanceOf(Map)


                        const digitMap = res?.get("digitMap");

                        expect(digitMap).toBeInstanceOf(Map)

                        expect(digitMap?.has("base")).toBeTruthy()

                        expect(digitMap?.get("base")).toBe("0")



                    })


            })



        itUsingBootstrapSortedClasses(
            "Changes the class map when a utility class with a breakpoint is inserted",
            ({ sortedBootstrapClasses: { utility: bootstrapCSSUtility } }) => {


                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(bootstrapCSSUtility, "outline-md-0")


                expect(bootstrapCSSUtility.has("outline-md"))



            })

        itUsingBootstrapSortedClasses(
            "Inserts a map into the value with a state is a key and a value at the end",
            ({ sortedBootstrapClasses: { utility: bootstrapCSSUtility } }) => {


                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(bootstrapCSSUtility, "outline-0-hover")

                expect(bootstrapCSSUtility.has("outline")).toBeTruthy()

                const outlineClassType = bootstrapCSSUtility.get("outline")

                expect(outlineClassType?.get("digitMap")?.has("-hover")).toBeTruthy()

                expect(outlineClassType?.get("digitMap")?.get("-hover")).toBe("0")



            })

        itUsingBootstrapSortedClasses(
            "Stores multiple states each with a different value in the same map",
            ({ sortedBootstrapClasses: { utility: bootstrapCSSUtility } }) => {

                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(bootstrapCSSUtility, "outline-0-hover")

                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(bootstrapCSSUtility, "outline-0-focus")

                expect(bootstrapCSSUtility.has("outline"))

                const outlineClassType = bootstrapCSSUtility.get("outline")



                expect(outlineClassType?.get("digitMap")?.has("-hover")).toBeTruthy()

                expect(outlineClassType?.get("digitMap")?.get("-hover")).toBe("0")

                expect(outlineClassType?.get("digitMap")?.has("-focus")).toBeTruthy()

                expect(outlineClassType?.get("digitMap")?.get("-focus")).toBe("0")

            })



        itUsingBootstrapSortedClasses(
            "Stores multiple states each with a different value in the same map in the word property",
            ({ sortedBootstrapClasses: { utility: bootstrapCSSUtility } }) => {

                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(bootstrapCSSUtility, "bg-primary-hover")

                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(bootstrapCSSUtility, "bg-primary-focus")

                expect(bootstrapCSSUtility.has("bg"))

                const outlineClassType = bootstrapCSSUtility.get("bg")

                expect(outlineClassType?.get("wordMap")?.has("-hover")).toBeTruthy()

                expect(outlineClassType?.get("wordMap")?.get("-hover")).toBe("primary")

                expect(outlineClassType?.get("wordMap")?.has("-focus")).toBeTruthy()

                expect(outlineClassType?.get("wordMap")?.get("-focus")).toBe("primary")

            })



        itUsingBootstrapSortedClasses(
            "it places the breakpoint after the utility type and places the value in the map",
            ({ sortedBootstrapClasses: { utility: bootstrapCSSUtility } }) => {


                attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(
                    bootstrapCSSUtility,
                    "bg-md-primary-focus"
                )

                const classType = "bg-md";

                expect(bootstrapCSSUtility.has(classType))

                const stateToValueMap = bootstrapCSSUtility.get(classType)

                expect(stateToValueMap?.get("wordMap")?.has("-focus")).toBeTruthy()

                expect(stateToValueMap?.get("wordMap")?.get("-focus")).toBe("primary")




            })


        describe(
            "it constructs the map differently based on breakpoints for the same class",
            () => {

                const classMap = new Map()

                const mapStructureExpectation =
                    (
                        input: string,
                        classType: string,
                        valueType: "wordMap" | "digitMap",
                        key: string,
                        value: string
                    ) => {


                        return {
                            input,
                            expected: {
                                classType,
                                valueType,
                                key,
                                value
                            }
                        }

                    }

                it.each([
                    mapStructureExpectation("bg-red", "bg", "wordMap", "base", "red"),
                    mapStructureExpectation("bg-md-red", "bg-md", "wordMap", "base", "red"),
                    mapStructureExpectation("bg-lg-blue", "bg-lg", "wordMap", "base", "blue"),
                    mapStructureExpectation("g-col-1", "g-col", "digitMap", "base", "1"),
                    mapStructureExpectation("g-col-md-3", "g-col-md", "digitMap", "base", "3"),
                    mapStructureExpectation("bg-lg-black-hover", "bg-lg", "wordMap", "-hover", "black"),
                    mapStructureExpectation("bg-green-focus", "bg", "wordMap", "-focus", "green"),
                ])(
                    `For $input expect classType to be $expected.classType
                     key in the map to be $expected.key and value to be $expected.value
                    `,
                    ({ input, expected: { classType, valueType, key, value } }) => {

                        attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(classMap, input)

                        expect(classMap.has(classType))

                        const stateToValueMap = classMap.get(classType)

                        expect(stateToValueMap?.get(valueType)?.has(key)).toBeTruthy()

                        expect(stateToValueMap?.get(valueType)?.get(key)).toBe(value)



                    })

            }

        )





    })


    describe("Testing attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue()", () => {



        itUsingTailwindSortedClasses(
            "doesn't change the map if there is a single word class",
            ({ sortedTailwindClasses: { utility } }) => {


                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(
                    utility,
                    "outline"
                )



                expect(utility).toHaveLength(0)



            })




        describe(
            `Changes the map to one that has key with the word before the dash and inserts the value in a map with the property digit. 
             If it's a number.
            `,
            () => {


                itUsingTailwindSortedClasses(
                    "changes the map when a class with a digit is passed in", ({ sortedTailwindClasses: { utility } }) => {


                        attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "outline-0")


                        expect(utility).toHaveLength(1)


                    })




                itUsingTailwindSortedClasses(
                    `${insertMessagePrefix} called digit with it as the value when the value is a number.`,
                    ({ sortedTailwindClasses: { utility } }) => {


                        attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "outline-0")



                        expect(utility.has("outline-")).toBeTruthy()


                        const res = utility.get("outline-")

                        expect(res).toBeInstanceOf(Map)


                        expect(res?.has("digit")).toBeTruthy()




                    })



                describe(
                    createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("digit"),
                    () => {




                        const classMap = new Map()

                        it.each([
                            {
                                className: "width-0",
                                expected: { key: "width-", value: "0" }
                            },
                            {
                                className: "width-[25]",
                                expected: { key: "width-", value: "[25]" }
                            },
                            {
                                className: "width-[45ch]",
                                expected: { key: "width-", value: "[45ch]" }
                            },
                            {
                                className: "width-33",
                                expected: { key: "width-", value: "33" }
                            },

                        ])(
                            createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("digit"),
                            ({ className, expected: { key, value } }) => {


                                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(classMap, className)


                                expect(classMap.has(key)).toBeTruthy()


                                const res = classMap.get(key)


                                expect(res).toBeInstanceOf(Map)




                                expect(res?.has("digit"))
                                    .toBeTruthy()

                                expect(res.get("digit")?.get("value")).toBe(value)

                                expect(res?.has("word"))
                                    .toBeFalsy()







                            })

                    }
                )






            }
        )




        describe("Works well with words and multiple args", () => {



            itUsingTailwindSortedClasses(
                `${insertMessagePrefix} called word with it as the value when the value is a word.`,
                ({ sortedTailwindClasses: { utility } }) => {


                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "outline-solid")


                    expect(utility.has("outline-")).toBeTruthy()


                    const res = utility.get("outline-")

                    expect(res).toBeInstanceOf(Map)


                    expect(res?.has("word")).toBeTruthy()


                }
            )



            itUsingTailwindSortedClasses(
                `${insertMessagePrefix} called args with it as the value when multiple args are passed.`,
                ({ sortedTailwindClasses: { utility } }) => {


                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "grid-cols-[2fr_auto]")



                    expect(utility.has("grid-cols-")).toBeTruthy()


                    const res = utility.get("grid-cols-")

                    expect(res).toBeInstanceOf(Map)


                    expect(res?.has("args")).toBeTruthy()


                }
            )



            const classMap = new Map()

            it.each(
                [

                    {
                        className: "border-[2_solid_3px]",
                        expected: {
                            key: "border-",
                            value: "[2_solid_3px]"
                        }
                    },
                    {
                        className: "numbers-[09_word_3px]",
                        expected: {
                            key: "numbers-",
                            value: "[09_word_3px]"
                        }
                    },
                    {
                        className: "grid-cols-[45px_repeat(2,fr)_minmax(auto-fill,35rem)]",
                        expected: {
                            key: "grid-cols-",
                            value: "[45px_repeat(2,fr)_minmax(auto-fill,35rem)]"
                        }
                    },
                    {
                        className: "bg-[url(/img.jpg)_full]",
                        expected: {
                            key: "bg-",
                            value: "[url(/img.jpg)_full]"
                        }
                    },


                ]
            )
                (
                    createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("args"),
                    ({ className, expected: { key, value } }) => {


                        attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(classMap, className)



                        expect(classMap.has(key)).toBeTruthy()


                        const res = classMap.get(key)


                        expect(res).toBeInstanceOf(Map)



                        expect(res.get("args")?.get("value")).toBe(value)




                    }
                )




        })



        describe("It works well with classes that are used for colors", () => {

            itUsingTailwindSortedClasses(
                `${insertMessagePrefix} called color with it as the value when the value is a color-range.`,
                ({ sortedTailwindClasses: { utility } }) => {


                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "outline-gray-500")



                    expect(utility.has("outline-")).toBeTruthy()


                    const res = utility.get("outline-")

                    expect(res).toBeInstanceOf(Map)


                    expect(res?.has("color")).toBeTruthy()


                }
            )



            const classMap = new Map()

            it.each([
                {
                    className: "border-[hsl(123,25%,90%)]",
                    expected: {
                        key: "border-",
                        value: "[hsl(123,25%,90%)]"
                    }
                },
                {
                    className: "border-[hsl(123_25%_90%)]",
                    expected: {
                        key: "border-",
                        value: "[hsl(123_25%_90%)]"
                    }
                },
                {
                    className: "bg-[hsl(20_25%_50%)]",
                    expected: {
                        key: "bg-",
                        value: "[hsl(20_25%_50%)]"
                    }
                },
                {
                    className: "bg-[hsl(180,25%,60%)]",
                    expected: {
                        key: "bg-",
                        value: "[hsl(180,25%,60%)]"
                    }
                },
            ])
                (
                    createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("color"),
                    ({ className, expected: { key, value } }) => {

                        attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(classMap, className)


                        expect(classMap.has(key)).toBeTruthy()


                        const result = classMap.get(key)



                        expect(result.has(viableUtilityClassMapKeys["2"])).toBeTruthy()

                        expect(result.get(viableUtilityClassMapKeys["2"])?.get("value")).toBe(value)




                    }
                )

        })




        describe("It works well with function args that aren't color functions", () => {



            const classMap = new Map()

            it.each([
                {
                    className: "grid-cols-[repeat(auto-fill,384px)]",
                    expected: {
                        key: "grid-cols-",
                        value: "[repeat(auto-fill,384px)]"
                    }
                },
                {
                    className: "font-size-[clamp(200px,40vw,600px)]",
                    expected: {
                        key: "font-size-",
                        value: "[clamp(200px,40vw,600px)]"
                    }
                },
                {
                    className: "bg-[url(/image.jpg)]",
                    expected: {
                        key: "bg-",
                        value: "[url(/image.jpg)]"
                    }
                },
                {
                    className: "content-[counter(first-one)]",
                    expected: {
                        key: "content-",
                        value: "[counter(first-one)]"
                    }
                },

            ])(
                createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue("function"),
                ({ className, expected: { key, value } }) => {


                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(classMap, className)


                    expect(classMap.has(key)).toBeTruthy()


                    const result = classMap.get(key)



                    expect(result.has(viableUtilityClassMapKeys[4])).toBeTruthy()

                    expect(result.get(viableUtilityClassMapKeys[4])?.get("value")).toBe(value)

                    expect(result.has(viableUtilityClassMapKeys[2]))
                        .toBeFalsy()



                })

        })



        describe("It works well with variables", () => {


            itUsingTailwindSortedClasses("puts the value in map with a key called variable when key is not specified", ({ sortedTailwindClasses: { utility } }) => {

                const classNameAndExpectedKeyAndValue = {
                    className: "bg-[--primary-color]",
                    expected: {
                        key: "bg-",
                        value: "[--primary-color]"
                    }
                }

                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, classNameAndExpectedKeyAndValue.className)

                expect(utility.has(classNameAndExpectedKeyAndValue.expected.key)).toBeTruthy()

                expect(utility.get(classNameAndExpectedKeyAndValue.expected.key)?.has("variable")).toBeTruthy()



            })


            itUsingTailwindSortedClasses("puts the value in a map with a key called color when a variable is hinted with color:", ({ sortedTailwindClasses: { utility } }) => {

                const classNameAndExpectedKeyAndValue = {
                    className: "border-[color:--gray-9]",
                    expected: {
                        key: "border-",
                        value: "[color:--gray-9]"
                    }
                }
                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, classNameAndExpectedKeyAndValue.className)

                expect(utility.has(classNameAndExpectedKeyAndValue.expected.key)).toBeTruthy()

                expect(utility.get(classNameAndExpectedKeyAndValue.expected.key)?.has("color")).toBeTruthy()


            })

            itUsingTailwindSortedClasses("puts the value in a map with a key called digit when a variable is hinted with length:", ({ sortedTailwindClasses: { utility } }) => {

                const classNameAndExpectedKeyAndValue = {
                    className: "font-size-[length:--step-2]",
                    expected: {
                        key: "font-size-",
                        value: "[length:--step-2]"
                    }
                }

                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, classNameAndExpectedKeyAndValue.className)

                expect(utility.has(classNameAndExpectedKeyAndValue.expected.key)).toBeTruthy()

                expect(utility.get(classNameAndExpectedKeyAndValue.expected.key)?.has("digit")).toBeTruthy()

            })


            itUsingTailwindSortedClasses("puts the value in a map with a key called word when a variable is hinted with string:", ({ sortedTailwindClasses: { utility } }) => {

                const classNameAndExpectedKeyAndValue = {
                    className: "outline-[string:--line-type]",
                    expected: {
                        key: "outline-",
                        value: "[string:--line-type]"
                    }
                }

                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, classNameAndExpectedKeyAndValue.className)

                expect(utility.has(classNameAndExpectedKeyAndValue.expected.key)).toBeTruthy()

                expect(utility.get(classNameAndExpectedKeyAndValue.expected.key)?.has("word")).toBeTruthy()

                expect(utility.get(classNameAndExpectedKeyAndValue.expected.key)?.get("word")?.get("value"))
                    .toBe(classNameAndExpectedKeyAndValue.expected.value)

            })


        })


        describe("It works with ! and - prefixes ", () => {

            itUsingTailwindSortedClasses(
                "The - prefix is inserted as a prefix to the value when a - is put in a utility class",
                ({ sortedTailwindClasses: { utility } }) => {

                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "-z-index-1")


                    expect(utility.get("z-index-")?.get("digit")).toBeTruthy()


                })

        })



        describe("It works with relational variants", () => {

            itUsingTailwindSortedClasses("Works with relational variants that use the / syntax", ({ sortedTailwindClasses: { utility } }) => {


                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "peer-checked/draft:text-sky-500")


                expect(utility.has("peer-checked/draft:text-")).toBeTruthy()

                expect(utility.get("peer-checked/draft:text-")?.has("color")).toBeTruthy()



            })


            itUsingTailwindSortedClasses("Works with arbitrary relational variants", ({ sortedTailwindClasses: { utility, } }) => {


                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "group-[.is-published]:opacity-50")


                expect(utility.has("group-[.is-published]:opacity-")).toBeTruthy()

                expect(utility.get("group-[.is-published]:opacity-")?.has("digit")).toBeTruthy()



            })


            itUsingTailwindSortedClasses("Works with arbitrary pseudo class variants", ({ sortedTailwindClasses: { utility, } }) => {


                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "[&:nth-child(3)]:opacity-50")


                expect(utility.has("[&:nth-child(3)]:opacity-")).toBeTruthy()

                expect(utility.get("[&:nth-child(3)]:opacity-")?.has("digit")).toBeTruthy()



            })


            itUsingTailwindSortedClasses("Works with is or where selectors", ({ sortedTailwindClasses: { utility, } }) => {


                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, "[&:is(:hover,:focus)]:opacity-50")


                expect(utility.has("[&:is(:hover,:focus)]:opacity-")).toBeTruthy()

                expect(utility.get("[&:is(:hover,:focus)]:opacity-")?.has("digit")).toBeTruthy()



            })


        })



        describe(
            `It removes classes values or types based on identical variants or subtype.
            Or it takes into account classes related to directions.`,
            () => {


                itUsingTailwindSortedClasses(
                    `When a class with a subtype is inserted. 
            If a class has a similar subtype and the value is in the map.
            The same value type is removed from the map.`,
                    ({ sortedTailwindClasses: { utility, } }) => {


                        const classes = [
                            "grid-cols-1",
                            "grid-rows-4",
                            "grid-cols-3",
                            "grid-rows-8",
                        ]


                        for (const className of classes) {
                            attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, className)

                        }

                        expect(utility.has("grid-rows-")).toBeTruthy()

                        expect(utility.get("grid-rows-")?.has("digit")).toBeTruthy()


                        expect(utility.get("grid-cols-")?.has("digit")).toBeFalsy()



                    })

                describe(
                    "It filters classes based on whether they have conflicting directions t|r|b|l ",
                    () => {



                        itUsingTailwindSortedClasses(
                            "Removes all values from classes with directionClassParts when a - is introduced",
                            ({ sortedTailwindClasses: { utility } }) => {

                                const marginClasses = [
                                    "mt-2",
                                    "mr-2",
                                    "m-4",
                                ]



                                for (const marginClass of marginClasses) {
                                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, marginClass)

                                }


                                expect(utility.has("m-")).toBeTruthy()

                                expect(utility.get("mt-")?.has("digit")).toBeFalsy()

                                expect(utility.get("mr-")?.has("digit")).toBeFalsy()



                            }
                        )


                        itUsingTailwindSortedClasses(
                            "Removes a class with - when a directionClassPart is introduced ",
                            ({ sortedTailwindClasses: { utility } }) => {

                                const classes = [
                                    "border-4",
                                    "border-t-4",
                                ]




                                for (const value of classes) {
                                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, value)

                                }


                                expect(utility.get("border-")?.has("digit")).toBeFalsy()

                                expect(utility.has("border-t-")).toBeTruthy()



                            }
                        )

                    }
                )


                describe(
                    "It gets rid value types of identical variants and types in the class map",
                    () => {

                        itUsingTailwindSortedClasses(
                            "Removes identical from type only classes with variants",
                            ({ sortedTailwindClasses: { utility } }) => {

                                const classes = [
                                    "border-4",
                                    "border-dashed",
                                    "border-gray-500",
                                    "hover:focus:border-4",
                                    "focus:hover:border-4",
                                    "border-y-4"
                                ]



                                for (const value of classes) {
                                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, value)

                                }

                                expect(utility.get('hover:focus:border-')?.has("digit")).toBeFalsy()

                                expect(utility.has('focus:hover:border-')).toBeTruthy()

                                expect(utility.get('border-')?.has('digit')).toBeFalsy()


                            }
                        )

                        itUsingTailwindSortedClasses(
                            "Removes identical value types from type and subtype classes with variants",
                            ({ sortedTailwindClasses: { utility } }) => {

                                const classes = [
                                    "border-4",
                                    "hover:focus:border-x-4",
                                    "focus:hover:border-y-4",
                                ]


                                for (const value of classes) {
                                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, value)

                                }

                                expect(utility.get('hover:focus:border-x-')?.has("digit")).toBeFalsy()

                                expect(utility.has('focus:hover:border-y-')).toBeTruthy()

                                expect(utility.has('border-')).toBeTruthy()


                            }
                        )

                    })



            })









    })







    describe("Testing attemptToChangeClassNameMapBasedOnAFilterObject()", () => {


        itUsingBEMSortedClasses("doesn't change the map if there is a single word class",
            ({ sortedBEMClasses: { customFiltered } }) => {


                attemptToChangeClassNameMapBasedOnAFilterObject(customFiltered, "nice", {})



                expect(customFiltered).toHaveLength(0)



            })



        itUsingBEMSortedClasses(
            `Changes the class Map by putting a key that is in the filter Object with a value that is 
             one of the list of values in the Array that key accesses from the filter object.  
            `,
            ({ sortedBEMClasses: { customFiltered } }) => {


                attemptToChangeClassNameMapBasedOnAFilterObject(
                    customFiltered,
                    "fixed",
                    {
                        position: ["fixed", "absolute"]
                    }
                )


                expect(customFiltered.has("position")).toBeTruthy()

                expect(customFiltered.get("position")?.get("base")).toBe("fixed")



            })


        itUsingBEMSortedClasses(
            `When iterating through a list of class names.
            If a utility class is found in the filter object's list of classes.
            The key associated with the list where it is found will be used as a key in the
            map It's value will be a map with the key of base and the value being the class.     
            `,
            ({ sortedBEMClasses: { customFiltered } }) => {


                const classNames = ["fixed", "absolute", "static"]


                const filterObject = {
                    position: ["fixed", "absolute", "static", "relative", "sticky"]
                };


                for (const value of classNames) {
                    attemptToChangeClassNameMapBasedOnAFilterObject(
                        customFiltered,
                        value,
                        filterObject,
                    )
                }




                expect(customFiltered.has("position")).toBeTruthy()

                const variantAndClassMap = customFiltered.get("position")

                expect(variantAndClassMap?.get("base")).toBe(classNames.at(-1))



            })


        itUsingBEMSortedClasses(
            `When sorting based on class names if no variant is provided
            the default variant will be base and it's value the class
            when a it is provided then the key will be the variant
            and the value the one provided.  
            `,
            ({ sortedBEMClasses: { customFiltered } }) => {


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


                for (const value of classNames) {
                    attemptToChangeClassNameMapBasedOnAFilterObject(
                        customFiltered,
                        value,
                        filterObject,
                    )
                }




                expect(customFiltered.has("display")).toBeTruthy()

                const variantAndClassMap = customFiltered.get("display")

                expect(variantAndClassMap?.get("base")).toBe("hidden")

                expect(variantAndClassMap?.get("md:")).toBe("block")



            })







    })




    describe("Testing attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty()", () => {



        itUsingTailwindSortedClasses(
            `The arbitraryProperties map has a key inserted that is the arbitrary property key and a value.
            That value is a map with a key called base and a value that is the arbitrary property value.
            `,
            ({ sortedTailwindClasses: { arbitraryProperties } }) => {


                attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(arbitraryProperties, "[font-size:2rem]")



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



                    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(classMap, className)


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



                    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(classMap, className)


                    expect(classMap.has(key)).toBeTruthy()


                    const variantAndValueMap = classMap.get(key);

                    expect(variantAndValueMap).toBeInstanceOf(Map)


                    expect(variantAndValueMap.get(variant)).toBe(value)






                })

        })



    })



    describe("Testing attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged()", () => {


        itUsingBEMSortedClasses(
            "doesn't change the map if there is a single word class",
            ({ sortedBEMClasses: { bem } }) => {


                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(bem, "nice", [])



                expect(bem).toHaveLength(0)



            })


        itUsingBEMSortedClasses("alters the BEM map when bem classes are encountered", ({ sortedBEMClasses: { bem } }) => {



            const bemClasses = ["card", "card__title", "card__title--lg", "card--lg"];


            bemClasses.forEach((className, _, array) => {

                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(bem, className, array)
            })


            expect(bem.has("card")).toBeTruthy()

            const cardElementAndModifierMap = bem.get("card")

            expect(cardElementAndModifierMap?.elements.has("__title")).toBeTruthy()


            expect(cardElementAndModifierMap?.modifiers.has("--lg")).toBeTruthy()




        })


        itUsingBEMSortedClasses(
            "adds an  element to the map when a lower_case_word and two underscores are encountered",
            ({ sortedBEMClasses: { bem } }) => {




                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(bem, "card__title", [])

                const cardElementAndModifierMap = bem.get("card");

                expect(cardElementAndModifierMap?.elements.has("__title")).toBeTruthy()

                expect(cardElementAndModifierMap?.elements.get("__title")).toBe("__title")




            })



        itUsingBEMSortedClasses(
            `When a lower_case_word is encountered with two underscores.
             The map is changed to have a key with the word on the left of the two underscores as a key.
             The value is a Map called that has a key called element with value that is the two underscores plus the word.  
            `,
            ({ sortedBEMClasses: { bem } }) => {


                const bemClasses = ["card", "card__title--lg", "card--lg"];


                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(bem, "card__title", bemClasses)

                const cardElementAndModifierMap = bem.get("card");

                expect(cardElementAndModifierMap?.elements.has("__title")).toBeTruthy()

                expect(cardElementAndModifierMap?.elements.get("__title")).toBe("__title")




            })

        itUsingBEMSortedClasses(
            `When a lower_case_word is encountered with two dashes.
             The map is changed to have a key with the word on the left of the two dashes as a key.
             The value is a Map called that has a key called element with value that is the two dashes plus the word.  
            `,
            ({ sortedBEMClasses: { bem } }) => {


                const bemClasses = ["card", "card__title--lg", "card--lg"];


                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(bem, "card__title", bemClasses)

                const cardElementAndModifierMap = bem.get("card");

                expect(cardElementAndModifierMap?.elements.has("__title")).toBeTruthy()

                expect(cardElementAndModifierMap?.elements.get("__title")).toBe("__title")




            })




    })




    describe("Testing attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass", () => {



        itUsingTailwindSortedClasses("works with container queries", ({ sortedTailwindClasses: { utility } }) => {


            attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(utility, "@container/main")



            expect(utility.has("@container/")).toBeTruthy()

            expect(utility.get("@container/")?.has("word")).toBeTruthy()



        })



        itUsingTailwindSortedClasses("works with named groups", ({ sortedTailwindClasses: { utility } }) => {

            attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(utility, "group/main")


            expect(utility.has("group/")).toBeTruthy()

            expect(utility.get("group/")?.has("word")).toBeTruthy()



        })




    })



    describe(
        "Testing attemptToChangeClassMapBasedOnIfItIsAVariantGroup",
        () => {


            itUsingTailwindSortedClasses(
                "works",
                ({ sortedTailwindClasses: { utility, arbitraryProperties, customFiltered } }) => {

                    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup(
                        { utility, arbitraryProperties, customFiltered },
                        "hover:(bg-red-500 text-gray-500)"
                    )

                    expect(utility.has("hover:bg-")).toBeTruthy()

                    expect(utility.has("hover:text-")).toBeTruthy()

                })


            itUsingTailwindSortedClasses(
                "Works with relational variants that use the / syntax",
                ({ sortedTailwindClasses: { utility, arbitraryProperties, customFiltered } }) => {


                    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup({ utility, arbitraryProperties, customFiltered }, "peer-checked/draft:(text-sky-500 bg-gray-500)")


                    expect(utility.has("peer-checked/draft:text-")).toBeTruthy()

                    expect(utility.get("peer-checked/draft:text-")?.has("color")).toBeTruthy()

                    expect(utility.has("peer-checked/draft:bg-")).toBeTruthy()

                    expect(utility.get("peer-checked/draft:bg-")?.has("color")).toBeTruthy()



                })


            itUsingTailwindSortedClasses(
                "works with arbitrary relational variants",
                ({ sortedTailwindClasses: { utility, arbitraryProperties, customFiltered } }) => {


                    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup(
                        { utility, arbitraryProperties, customFiltered },
                        "group-[.is-published]:(opacity-50 text-sky-900)"
                    )


                    expect(utility.has("group-[.is-published]:opacity-")).toBeTruthy()

                    expect(utility.get("group-[.is-published]:opacity-")?.has("digit")).toBeTruthy()

                    expect(utility.has("group-[.is-published]:text-")).toBeTruthy()

                    expect(utility.get("group-[.is-published]:text-")?.has("color")).toBeTruthy()



                })


            itUsingTailwindSortedClasses(
                "works with utilities that have variants as prefixes",
                ({ sortedTailwindClasses: { utility, arbitraryProperties, customFiltered } }) => {

                    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup(
                        { utility, arbitraryProperties, customFiltered },
                        "hover:(focus:bg-500 peer-checked/main:text-gray-500)"
                    )

                    expect(utility.has("hover:focus:bg-")).toBeTruthy()

                    expect(utility.has("hover:peer-checked/main:text-")).toBeTruthy()

                })


            itUsingTailwindSortedClasses(
                "Works with arbitrary pseudo class variants",
                ({ sortedTailwindClasses: { utility, arbitraryProperties, customFiltered } }) => {


                    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup({ utility, arbitraryProperties, customFiltered }, "[&:nth-child(3)]:(opacity-50 border-gray-500)")


                    expect(utility.has("[&:nth-child(3)]:opacity-")).toBeTruthy()

                    expect(utility.get("[&:nth-child(3)]:opacity-")?.has("digit")).toBeTruthy()

                    expect(utility.has("[&:nth-child(3)]:border-")).toBeTruthy()

                    expect(utility.get("[&:nth-child(3)]:border-")?.has("color")).toBeTruthy()



                })


            itUsingTailwindSortedClasses(
                "Works with is or where selectors",
                ({ sortedTailwindClasses: { utility, arbitraryProperties, customFiltered } }) => {


                    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup({ utility, arbitraryProperties, customFiltered }, "[&:is(:hover,:focus)]:(opacity-50 bg-gray-900)")


                    expect(utility.has("[&:is(:hover,:focus)]:opacity-")).toBeTruthy()

                    expect(utility.get("[&:is(:hover,:focus)]:opacity-")?.has("digit")).toBeTruthy()

                    expect(utility.has("[&:is(:hover,:focus)]:bg-")).toBeTruthy()

                    expect(utility.get("[&:is(:hover,:focus)]:bg-")?.has("color")).toBeTruthy()



                })



        })








})


