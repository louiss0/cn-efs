import {
    type ClassNamesMap,
    type ClassValueTypeAndValueMap,
    type ViableClassObjectMapKeys,
    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged,
    viableClassObjectMapKeys,

} from './classMapChangers';


type TestContext = {
    classMap: ClassNamesMap
}

beforeEach<TestContext>((context) => {

    context.classMap = new Map()

})


function assertClassValueTypeAndValueMap(value: unknown): asserts value is ClassValueTypeAndValueMap {



    if (!(value instanceof Map)) throw new Error("This is not a map it's has to be one");


    const theMapHasOneOfTheseKeys = viableClassObjectMapKeys.some(viableKey => value.has(viableKey) === true);


    if (!theMapHasOneOfTheseKeys) throw new Error(`The map must have one of these keys ${viableClassObjectMapKeys.join(",")}`);



}


const createTestMessageForTestingIfAClassNameChangesTheMapWithAnExpectedKeyAndAValueTHatIsAMapWithAnExpectedKeyAndValue = (key: ViableClassObjectMapKeys) =>
    `For class $className the key for the created map is called $expected.key the value is a map with a key called ${key} with the value of $expected.value .`


const insertMessagePrefix = "inserts the word before the dash as key and the word after the dash in a map with a key";


describe("Test if all class map changers work", () => {





    describe("Test attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged()", () => {


        it<TestContext>("doesn't change the map if there is a single word class", ({ classMap }) => {


            attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "outline")



            expect(classMap).toHaveLength(0)



        })


        it<TestContext>("returns false when the map doesn't change", ({ classMap }) => {


            const res = attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "nice")

            expect(res).toBe(false)

        })





        describe(
            `Changes the map to one that has key with the word before the dash and inserts the value in a map with the property digit. 
             If it's a number.
            `,
            () => {


                it<TestContext>("changes the map when a class with a digit is passed in", ({ classMap }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "outline-0")


                    expect(classMap).toHaveLength(1)


                })




                it<TestContext>(
                    `${insertMessagePrefix} called digit with it as the value when the value is a number.`,
                    ({ classMap }) => {


                        attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "outline-0")



                        expect(classMap.has("outline")).toBeTruthy()


                        const res = classMap.get("outline")

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


                                assertClassValueTypeAndValueMap(res)


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
                ({ classMap }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "outline-solid")


                    expect(classMap.has("outline")).toBeTruthy()


                    const res = classMap.get("outline")

                    expect(res).toBeInstanceOf(Map)


                    expect(Object.fromEntries(res as Map<string, string>)).toHaveProperty("word", "solid")


                }
            )



            it<TestContext>(
                `${insertMessagePrefix} called args with it as the value when multiple args are passed.`,
                ({ classMap }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "grid-cols-[2fr_auto]")



                    expect(classMap.has("grid-cols")).toBeTruthy()


                    const res = classMap.get("grid-cols")

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
                ({ classMap }) => {


                    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(classMap, "outline-gray-500")



                    expect(classMap.has("outline")).toBeTruthy()


                    const res = classMap.get("outline")

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



                        expect(Object.fromEntries(result)).toHaveProperty(viableClassObjectMapKeys["2"], value)




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
                        .toHaveProperty(viableClassObjectMapKeys[4], value)

                    expect(Object.fromEntries(result))
                        .not.toHaveProperty(viableClassObjectMapKeys[2], value)



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
                        .toHaveProperty(viableClassObjectMapKeys[3], value)

                    expect(Object.fromEntries(result))
                        .not.toHaveProperty(viableClassObjectMapKeys["5"], value)



                })


        })





    })



    describe("Test attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged()", () => {


        it<TestContext>("doesn't change the map if there is a single word class", ({ classMap }) => {


            const res = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged({}, classMap, "nice")


            expect(res).toBe(false)

            expect(classMap).toHaveLength(0)



        })


        it<TestContext>("returns false when the map doesn't change", ({ classMap }) => {


            const res = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged({}, classMap, "nice")

            expect(res).toBe(false)

        })


    })




    describe("Test attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged()", () => {


        it<TestContext>("doesn't change the map if there is a single word class", ({ classMap }) => {


            attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(classMap, "nice")



            expect(classMap).toHaveLength(0)



        })

        it<TestContext>("returns false when the map doesn't change", ({ classMap }) => {


            const res = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged({}, classMap, "nice")

            expect(res).toBe(false)

        })

    })













})







