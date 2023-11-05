
export type FilterObject = Record<Lowercase<string>, Array<Lowercase<string>>>;

const cssVariableWithOptionalPrefixedHintRE =
    /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)


const variableHasAColorHint = (arbitraryValue: string) =>
    cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.["variable_hint"] === "color:"

const variableHasALengthHint = (arbitraryValue: string) =>
    cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.["variable_hint"] === "length:"

const variableHasAStringHint = (arbitraryValue: string) =>
    cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.["variable_hint"] === "string:"




const tailwindCSSTypeAndValueUtilityClassRE =
    /^(?<variant>[a-z0-9\][#\.&:\-\)",_=(\/]+:)?(?<prefix>!|-)?(?<type>[a-z]+-)(?<subtype>[a-z]+-)?(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d]+)$/


const bootstrapCSSTypeBreakpointAndValueUtilityClassRE =
    /^(?<type>[a-z]+|[a-z]+-[a-z]+)(?<breakpoint>-(?:sm|md|lg|xl|xxl))?-(?<value>[a-z0-9]+)(?<state>-[a-z]+)?$/

const bootstrapCSSTypeBreakpointAndValueAsColorUtilityClassRE =
    /^(?<type>[a-z]+|[a-z]+-[a-z]+)(?<breakpoint>-(?:sm|md|lg|xl|xxl))?-(?<value>(?:(?:(?:prim|second|terti)ary)|info|light|dark|danger|warning)+(?:-emphasis|-subtle)?)(?<state>-[a-z]+)?$/



const properCSSDigitRE = /^(?<digit>\d{1,4}(?:[a-z]{2,4})?)$/

const checkIfStringIsAProperDigit = (string: string) => properCSSDigitRE.test(string)


const colorRangeRE = /^(?<color>[a-z]+-)(?<range>[0-9]{2,4})$/

const hexColorRE = /^(?<hex_color>#[A-Fa-f0-9]{3,6})$/

const cssColorFunctionRE = /(?<css_color_function>[a-z]{3,9}\((?:\d{1,4}(?:%|[a-z]{3,4}|\.\d+)?(?:,|_)?){3,4}\))/

const tailwindCSSUtilityClassVariantAndSelfRE = /(?<variant>[a-z0-9)\-(\]\[&,]+:)?(?<class_type_and_value>[a-z0-9\-_\]\[,)(%#!]+)/


const isAColorRange = (string: string) => colorRangeRE.test(string)

const subtypeUsesAnAryAsAPostFixWithMaybeAValueRE = /^(?<subtype>[a-z]+ary-)(?<value>[a-z\d]+)?$/

const checkIfStringIsAProperColor = (string: string) =>
    hexColorRE.test(string)
    || cssColorFunctionRE.test(string)
    || subtypeUsesAnAryAsAPostFixWithMaybeAValueRE.test(string)


const cssNormalFunctionRE = /^(?<css_function>[a-z_-]{3,15}\(([a-z0-9%!\(\).\/-]+(?:_|,)?)+\))$/

const checkIfStringIsAProperCSSNormalFunction = (string: string) =>
    cssNormalFunctionRE.test(string) && !cssColorFunctionRE.test(string)

const arbitraryValueRE = /^\[(?<value>[\w\-),%!\/($.:#]+)\]$/

const lowerCaseWordRE = /^(?<lower_case_word>[a-z]+)$/


const dashedLowerCaseWordRE = /(?<first_word>[a-z]+-)(?<middle_words>(?:[a-z]+-)+)?(?<last_word>[a-z]+)/


const checkIfStringIsALowerCaseWord = (string: string) => lowerCaseWordRE.test(string)

const cssTwoOrMoreArgsRE = /([a-z0-9\-)(\/,.]+)(?:_[a-z0-9\/),(.\-]+)+/

const checkIfStringIsASetOfArgs = (string: string) => cssTwoOrMoreArgsRE.test(string)



export const viableUtilityClassMapKeys = ["digit", "word", "color", "variable", "function", "args"] as const

export const viableBEMClassMapKeys = ["element", "modifier"] as const

export type ViableUtilityClassMapKeys = typeof viableUtilityClassMapKeys[number]


type ViableBemClassMapKeys = typeof viableBEMClassMapKeys[number]


type StringOrOmitFromString<T extends string> = T | Omit<string, T>


type SortedClassObjectWithoutCustomFilteredOrSafeList<T extends string> =
    T extends "customFiltered" | "safeListed" ? never :
    Record<T, ClassNameMap>;

export const createSortedClassObject = <T extends string, U extends SortedClassObjectWithoutCustomFilteredOrSafeList<T> | undefined = undefined>(
    sortedClassObject?: U
) => {



    const initalObject = {
        customFiltered: new Map<string, Map<StringOrOmitFromString<"base">, string | undefined> | undefined>(),
        safeListed: [] as Array<string>,
    };

    return Object.freeze(
        (sortedClassObject ? Object.assign(initalObject, sortedClassObject) : initalObject) as
        typeof sortedClassObject extends undefined ? typeof initalObject : typeof initalObject & typeof sortedClassObject
    )


}

export const sortedClasses = createSortedClassObject()

export type SortedClasses = typeof sortedClasses

export const createSortedBEMClasses = () => createSortedClassObject({
    bem: new Map<string, Map<ViableBemClassMapKeys, string | undefined> | undefined>()
})

export const createSortedBaseCN_EFSClasses = () => Object.freeze({
    ...createSortedBEMClasses(),
    basicUtility: new Map<
        string, Map<
            Extract<
                ViableUtilityClassMapKeys,
                "word" | "digit" | "color"
            >,
            string | undefined
        >
        | undefined
    >()

})



export const createSortedBootstrapClasses = () =>
    createSortedClassObject({
        bootstrapCSSUtility: new Map<
            string,
            Map<`${Extract<ViableUtilityClassMapKeys, "word" | "digit">}Map`,
                Map<string, string> | undefined
            > | undefined
        >()

    });

export const createSortedTailwindClasses = () => createSortedClassObject({
    arbitraryProperties: new Map<string, Map<StringOrOmitFromString<"base">, string | undefined> | undefined>(),
    tailwindCSSUtility: new Map<string, Map<ViableUtilityClassMapKeys, Map<"prefix" | "value", string> | undefined> | undefined>()

})


type AllSortedClasses = typeof sortedClasses
    & ReturnType<typeof createSortedBEMClasses>
    & ReturnType<typeof createSortedBootstrapClasses>
    & ReturnType<typeof createSortedBaseCN_EFSClasses>
    & ReturnType<typeof createSortedTailwindClasses>


export type ClassNameMap = Map<
    string,
    Map<
        string | Omit<string, string>,
        string | Map<string, string> | undefined
    >
    | undefined
>;

type ClassMapChangerBasedOnClassName<T extends ClassNameMap,
    U = undefined>
    = U extends undefined ? (classMap: T, className: string,) => boolean : (classMap: T, className: string, data: U) => boolean

export const attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue: ClassMapChangerBasedOnClassName<AllSortedClasses["basicUtility"]> = (classMap, className) => {


    const cssTypeValueUtilityClassMatchGroups = /(?<type>[a-z]+-)(?<subtype>(?:[a-z]+-)*)?(?<value>[a-z\d]+)/.exec(className)?.groups
        || /(?<type>[a-z]+)(?<value>\d+)/.exec(className)?.groups


    if (!cssTypeValueUtilityClassMatchGroups) return false



    const { type, value, subtype = "", } = cssTypeValueUtilityClassMatchGroups


    if (!type || !value) return false


    const typeAndSubtype = `${type}${subtype}`

    const subTypeAndValue = `${subtype}${value}`




    const valueIsAViableDigit = checkIfStringIsAProperDigit(value)


    const valueIsAViableWord = checkIfStringIsALowerCaseWord(value)


    const valueIsAViableColor = isAColorRange(subTypeAndValue)
        || subtypeUsesAnAryAsAPostFixWithMaybeAValueRE.test(subTypeAndValue)


    const colorRangeGroups = colorRangeRE.exec(subTypeAndValue)?.groups


    const dashedLowerCaseWordGroups = dashedLowerCaseWordRE.exec(subTypeAndValue)?.groups


    if (!classMap.has(type)) {


        if (valueIsAViableColor) {


            if (colorRangeGroups) {


                const { color, range } = colorRangeGroups

                if (!color || !range) return false



                classMap.set(type, new Map([[viableUtilityClassMapKeys[2], `${color}${range}`]]))

                return true

            }



            classMap.set(type, new Map([[viableUtilityClassMapKeys[2], subTypeAndValue]]))

            return true

        }


        if (valueIsAViableDigit) {



            classMap.set(typeAndSubtype, new Map([[viableUtilityClassMapKeys[0], value]]))


            return true

        }


        if (valueIsAViableWord) {


            if (dashedLowerCaseWordGroups) {


                const { first_word, middle_words = "", last_word } = dashedLowerCaseWordGroups


                if (first_word && last_word) {

                    classMap.set(
                        type,
                        new Map([[viableUtilityClassMapKeys[1], `${first_word}${middle_words}${last_word}`]])
                    )

                    return true
                }

                classMap.get(type)?.set(
                    viableUtilityClassMapKeys[1],
                    `${first_word}${middle_words}${last_word}`
                )


                return true
            }

            classMap.set(typeAndSubtype, new Map([[viableUtilityClassMapKeys[1], value]]))



            return true
        }






    }



    const result = classMap.get(type) || classMap.get(typeAndSubtype)


    if (result) {


        if (valueIsAViableColor) {

            if (!colorRangeGroups) {

                result.set(viableUtilityClassMapKeys[2], value)

                return true

            }


            result.set(viableUtilityClassMapKeys[2], `${colorRangeGroups.color}${colorRangeGroups.range}`)


            return true

        }



        if (valueIsAViableDigit) {

            result.set(viableUtilityClassMapKeys[0], value)

            return true
        }


        if (valueIsAViableWord) {

            result.set(viableUtilityClassMapKeys[1], value)



            return true

        }



    }

    return false


};


export const attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue: ClassMapChangerBasedOnClassName<AllSortedClasses["bootstrapCSSUtility"]> = (classMap, className) => {


    const cssTypeValueUtilityClassMatchGroups =
        bootstrapCSSTypeBreakpointAndValueAsColorUtilityClassRE.exec(className)?.groups
        || bootstrapCSSTypeBreakpointAndValueUtilityClassRE.exec(className)?.groups



    if (!cssTypeValueUtilityClassMatchGroups) return false


    const { type, value, breakpoint = "", state = "base" } = cssTypeValueUtilityClassMatchGroups


    if (!type || !value) return false


    const classTypeAndBreakpoint = `${type}${breakpoint}`

    const valueIsAViableDigit = checkIfStringIsAProperDigit(value)


    const valueIsAViableWord = /[a-z\-_]+/.test(value)




    if (!classMap.has(classTypeAndBreakpoint)) {


        if (valueIsAViableDigit) {



            classMap.set(classTypeAndBreakpoint, new Map([["digitMap", new Map().set(state, value)]]))


            return true

        }


        if (valueIsAViableWord) {



            classMap.set(
                classTypeAndBreakpoint,
                new Map([[
                    "wordMap",
                    new Map().set(state, value)
                ]])
            )



            return true
        }


    }

    const result = classMap.get(classTypeAndBreakpoint)


    if (result) {

        if (valueIsAViableDigit) {

            result.get("digitMap")?.set(state, value)

            return true
        }


        if (valueIsAViableWord) {

            result.get("wordMap")?.set(state, value)



            return true

        }

    }


    return false

};

// TODO: Find a way to do margin without having to use ma- class.

const getDeleteKeyBasedOnDirectionBasedClasses = (
    classTypesThatUseDirectionParts: Array<string>,
    requiredClassParts: Record<
        "up" | "down",
        `${string}-`
    >
        & Record<
            "left" | "right",
            { primary: `${string}-`, secondary?: `${string}-` }
        >
        & Record<
            "horizontal" | "vertical" | "both",
            `${string}-`
        >

) => (
    classMap: Map<string, any>,
    classType: string,
    classSubtype: string
) => {


        const classTypeIsAPartOfOrIsAClassThatUsesDirectionParts = classTypesThatUseDirectionParts
            .some(value => classType.startsWith(value) || classType === value)


        if (!classTypeIsAPartOfOrIsAClassThatUsesDirectionParts) return false


        const deleteKeyBasedOnOpposingDirections = (directionClassPart: string, opposingDirectionClassPart: string) => {


            if (classType.endsWith(directionClassPart)) {


                return classMap.delete(`${classType.replace(directionClassPart, "")}${opposingDirectionClassPart}`)

            }



            if (classSubtype === directionClassPart) {


                return classMap.delete(`${classType}${opposingDirectionClassPart === "-" ? "" : opposingDirectionClassPart}`)


            }

            return false

        }


        const { up, down, left, right, horizontal, both, vertical } = requiredClassParts


        const mapHasChanged = [
            deleteKeyBasedOnOpposingDirections(up, down),
            deleteKeyBasedOnOpposingDirections(down, up),
            deleteKeyBasedOnOpposingDirections(left.primary, right.primary),
            deleteKeyBasedOnOpposingDirections(right.primary, left.primary),
            left?.secondary && right?.secondary && deleteKeyBasedOnOpposingDirections(left.secondary, right.secondary),
            left?.secondary && right?.secondary && deleteKeyBasedOnOpposingDirections(right.secondary, left.secondary),
            deleteKeyBasedOnOpposingDirections(horizontal, vertical),
            deleteKeyBasedOnOpposingDirections(vertical, horizontal),
        ].some(value => value === true)


        if (!mapHasChanged) {


            return [
                deleteKeyBasedOnOpposingDirections(both, up),
                deleteKeyBasedOnOpposingDirections(up, both),
                deleteKeyBasedOnOpposingDirections(down, both),
                deleteKeyBasedOnOpposingDirections(left.primary, both),
                deleteKeyBasedOnOpposingDirections(both, left.primary),
                deleteKeyBasedOnOpposingDirections(right.primary, both),
                deleteKeyBasedOnOpposingDirections(both, right.primary),
                left?.secondary && right?.secondary && deleteKeyBasedOnOpposingDirections(left.secondary, both),
                left?.secondary && right?.secondary && deleteKeyBasedOnOpposingDirections(both, left.secondary),
                left?.secondary && right?.secondary && deleteKeyBasedOnOpposingDirections(right.secondary, both),
                left?.secondary && right?.secondary && deleteKeyBasedOnOpposingDirections(both, right.secondary),
                deleteKeyBasedOnOpposingDirections(horizontal, both),
                deleteKeyBasedOnOpposingDirections(both, horizontal),
                deleteKeyBasedOnOpposingDirections(vertical, both),
                deleteKeyBasedOnOpposingDirections(both, vertical),
            ].reduce(value => value === true)

        }


        return mapHasChanged



    }


const attemptToDeleteKeysWhenAClassThatCanHaveOrHasDirectionPartsIsFoundAndASimilarClassIsFound = getDeleteKeyBasedOnDirectionBasedClasses(
    [
        "m",
        "z-index",
        "border",
        "p",
        "start",
        "end",
        "overflow",
        "gap",
        "scale",
        "translate",
        "rotate",
        "skew",
        "scroll",
        "scroll-m",
        "touch-pan",
    ],
    {
        up: "t-", down: "b-",
        left: { primary: "l-", secondary: "s-" },
        right: { primary: "r-", secondary: "e-" },
        horizontal: "x-", both: "-", vertical: "y-"
    }
);
export const attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue:
    ClassMapChangerBasedOnClassName<AllSortedClasses["tailwindCSSUtility"]> = (classMap, className) => {



        const cssTypeValueUtilityClassMatchGroups = tailwindCSSTypeAndValueUtilityClassRE.exec(className)?.groups




        if (!cssTypeValueUtilityClassMatchGroups) return false



        const { type, value, variant = "", subtype = "", prefix = "", } = cssTypeValueUtilityClassMatchGroups


        if (!type || !value) return false



        const classVariantAndType = `${variant}${type}`

        const classVariantTypeAndSubtype = `${variant}${type}${subtype}`


        const subTypeAndValue = `${subtype}${value}`



        const arbitraryValueMatchSecondValue = value.match(arbitraryValueRE)?.[1]

        const arbitraryValueMatchSecondValueBoolValue = !!arbitraryValueMatchSecondValue

        const valueIsAViableDigit = checkIfStringIsAProperDigit(value)
            || arbitraryValueMatchSecondValue && checkIfStringIsAProperDigit(arbitraryValueMatchSecondValue)
            || arbitraryValueMatchSecondValue && variableHasALengthHint(arbitraryValueMatchSecondValue)


        const valueIsAViableWord = checkIfStringIsALowerCaseWord(value)
            || arbitraryValueMatchSecondValueBoolValue && checkIfStringIsALowerCaseWord(arbitraryValueMatchSecondValue)
            || arbitraryValueMatchSecondValueBoolValue && variableHasAStringHint(arbitraryValueMatchSecondValue)

        const arbitraryValueIsAViableNonColorFunction =
            arbitraryValueMatchSecondValueBoolValue && checkIfStringIsAProperCSSNormalFunction(arbitraryValueMatchSecondValue)

        const arbitraryValueIsASetOfArgs =
            arbitraryValueMatchSecondValueBoolValue && checkIfStringIsASetOfArgs(arbitraryValueMatchSecondValue)

        const arbitraryValueIsAViableCSSVariable =
            arbitraryValueMatchSecondValueBoolValue && checkIfStringIsACssVariableWithAnOptionalHint(arbitraryValueMatchSecondValue)

        const valueIsAViableColor =
            arbitraryValueMatchSecondValue && checkIfStringIsAProperColor(arbitraryValueMatchSecondValue)
            || arbitraryValueMatchSecondValueBoolValue && variableHasAColorHint(arbitraryValueMatchSecondValue)
            || isAColorRange(`${subtype}${value}`)



        if (prefix === "-" && !valueIsAViableDigit) {

            throw new Error(`The ${prefix} only works with digits don't use it on classes that aren't numbers`)
        }



        const colorRangeGroups = colorRangeRE.exec(subTypeAndValue)?.groups

        if (subtype) {


            if (colorRangeGroups) {


                const { color, range } = colorRangeGroups

                if (!color || !range) return false




                if (!classMap.has(classVariantAndType)) {

                    classMap.set(classVariantAndType, new Map([
                        [viableUtilityClassMapKeys[2], new Map([
                            ["prefix", prefix],
                            ["value", `${color}${range}`]
                        ])
                        ]
                    ]
                    )
                    )
                }

                classMap.get(classVariantAndType)
                    ?.get(viableUtilityClassMapKeys[2],)
                    ?.set("prefix", prefix).set("value", value)


                deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                return true
            }





            if (!classMap.has(classVariantTypeAndSubtype)) {



                if (valueIsAViableDigit) {



                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[0], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))



                    const keyDeletionAttemptResult = attemptToDeleteKeysWhenAClassThatCanHaveOrHasDirectionPartsIsFoundAndASimilarClassIsFound(
                        classMap,
                        classVariantAndType,
                        subtype
                    );

                    if (!keyDeletionAttemptResult) {

                        deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(
                            classMap,
                            classVariantTypeAndSubtype
                        )
                    }

                    return true

                }

                if (valueIsAViableWord) {



                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[1], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                    return true

                }



                if (arbitraryValueIsAViableNonColorFunction) {


                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[4], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                    return true

                }


                if (arbitraryValueIsAViableCSSVariable) {

                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[3], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                    return true

                }




                if (arbitraryValueIsASetOfArgs) {


                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[5], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                    return true

                }

            }



            const result = classMap.get(classVariantTypeAndSubtype)


            if (result) {


                if (valueIsAViableDigit) {

                    result.set(viableUtilityClassMapKeys[0], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))


                    const keyDeletionAttemptResult = attemptToDeleteKeysWhenAClassThatCanHaveOrHasDirectionPartsIsFoundAndASimilarClassIsFound(
                        classMap,
                        classVariantAndType,
                        subtype
                    );

                    if (!keyDeletionAttemptResult) {

                        deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)
                    }


                    return true

                }


                if (valueIsAViableWord) {

                    result.set(viableUtilityClassMapKeys[1], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))



                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)
                    return true

                }



                if (arbitraryValueIsAViableNonColorFunction) {

                    result.set(viableUtilityClassMapKeys[4], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))



                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)
                    return true
                }

                if (arbitraryValueIsAViableCSSVariable) {

                    result.set(viableUtilityClassMapKeys[3], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))



                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)
                    return true
                }

                if (arbitraryValueIsASetOfArgs) {

                    result.set(viableUtilityClassMapKeys[5], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))



                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)
                    return true
                }



            }


            return false

        }


        if (!classMap.has(classVariantAndType)) {


            if (valueIsAViableColor) {

                classMap.set(classVariantAndType, new Map([[viableUtilityClassMapKeys[2], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                return true
            }


            if (valueIsAViableDigit) {



                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[0], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))






                const keyDeletionAttemptResult = attemptToDeleteKeysWhenAClassThatCanHaveOrHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    classVariantAndType,
                    subtype
                );

                if (!keyDeletionAttemptResult) {

                    deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(
                        classMap,
                        classVariantTypeAndSubtype
                    )
                }

                return true

            }


            if (valueIsAViableWord) {



                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[1], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                return true

            }



            if (arbitraryValueIsAViableNonColorFunction) {


                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[4], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                return true

            }


            if (arbitraryValueIsAViableCSSVariable) {

                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[3], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                return true

            }




            if (arbitraryValueIsASetOfArgs) {


                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[5], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap, classVariantTypeAndSubtype)

                return true

            }




        }






        const result = classMap.get(classVariantAndType)


        if (result) {


            if (valueIsAViableColor) {

                if (!colorRangeGroups) {


                    result.set(viableUtilityClassMapKeys[2], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))


                    return true

                }


                result.get(viableUtilityClassMapKeys[2],)?.set("prefix", prefix).set("value", value)

                return true

            }



            if (valueIsAViableDigit) {

                result.set(viableUtilityClassMapKeys[0], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))


                attemptToDeleteKeysWhenAClassThatCanHaveOrHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    classVariantAndType,
                    subtype
                );




                return true

            }


            if (valueIsAViableWord) {

                result.set(viableUtilityClassMapKeys[1], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))



                return true

            }



            if (arbitraryValueIsAViableNonColorFunction) {

                result.set(viableUtilityClassMapKeys[4], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))



                return true
            }

            if (arbitraryValueIsAViableCSSVariable) {

                result.set(viableUtilityClassMapKeys[3], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))



                return true
            }

            if (arbitraryValueIsASetOfArgs) {

                result.set(viableUtilityClassMapKeys[5], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))



                return true
            }



        }


        return false


    }


function deleteIdenticalKeyFromClassMapIfItsAClassVariantTypeAndSubtype(classMap: Map<string, any>, className: string) {

    const tailwindClassVariantTypeAndSubtypeRE = /^(?<variant>[a-z0-9\][#\.&:\-\)",_=(\/]+:)?(?<type>[a-z]+-)(?<subtype>[a-z]+-)$/

    const tailwindClassVariantTypeAndSubtypeGroups = tailwindClassVariantTypeAndSubtypeRE.exec(className)?.groups

    if (!tailwindClassVariantTypeAndSubtypeGroups) return



    const identicalKey = Array.from(classMap.keys()).find((key) => {

        const keyIsAtTailwindClassVariantTypeAndSubtype = tailwindClassVariantTypeAndSubtypeRE.exec(key)

        const keyStartsWithTheMatchedType = key.startsWith(tailwindClassVariantTypeAndSubtypeGroups.type as string);

        return keyIsAtTailwindClassVariantTypeAndSubtype && keyStartsWithTheMatchedType && key !== className

    })

    if (!identicalKey) return

    return classMap.delete(identicalKey)

}

type TypeAndListClassMapChanger = ClassMapChangerBasedOnClassName<AllSortedClasses["customFiltered"], Record<string, Array<string>>>

export const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject: TypeAndListClassMapChanger = (classMap, className, classTypeAndListObject) => {



    let classMapHasChanged = false

    Object.entries(classTypeAndListObject).forEach(([classType, classList]) => {



        const utilityClassVariantAndSelfGroups = tailwindCSSUtilityClassVariantAndSelfRE.exec(className)?.groups


        if (!utilityClassVariantAndSelfGroups) return


        const { variant = "base", class_type_and_value } = utilityClassVariantAndSelfGroups




        if (!class_type_and_value) return

        if (!classMap.has(classType) && classList.includes(class_type_and_value)) {

            classMap.set(
                classType,
                new Map([
                    [
                        variant,
                        class_type_and_value
                    ],
                ])
            )

            classMapHasChanged = true
        }


        if (classList.includes(class_type_and_value)) {


            classMap.get(classType,)
                ?.set(variant, class_type_and_value)

            classMapHasChanged = true

        }








    })

    return classMapHasChanged

}




const aBlockElementClassName =
    /^(?<lower_case_word>[a-z]+)(?<element>__[a-z]+(?:--[a-z0-9]+)?)$/

const aBlockModifierClassName =
    /^(?<lower_case_word>[a-z]+)(?<modifier>--[a-z0-9]+)$/


export const attemptToChangeClassNameMapAccordingToIfTheBEMConvention: ClassMapChangerBasedOnClassName<
    AllSortedClasses["bem"],
    Array<string>
> =
    (classMap, className, classNames) => {


        const blockAndElementClassNameGroups = aBlockElementClassName.exec(className)?.groups

        const blockAndModifierClassNameGroups = aBlockModifierClassName.exec(className)?.groups



        if (blockAndElementClassNameGroups) {

            const {
                lower_case_word,
                element,
            } = blockAndElementClassNameGroups

            if (!lower_case_word || !element) return false


            if (!classMap.has(lower_case_word)) {

                classMap.set(
                    lower_case_word,
                    new Map([
                        ["element", element],

                    ])
                )

                return true

            }

            classMap.get(lower_case_word)
                ?.set("element", element)


            return true

        }

        if (blockAndModifierClassNameGroups) {


            const { lower_case_word, modifier } = blockAndModifierClassNameGroups



            if (!lower_case_word || !modifier) return false


            if (!classNames.includes(lower_case_word)) {

                throw new Error(
                    `To have a modifier you must have the block ${lower_case_word} in the list of classes already.
                    Please put the block as the class that requires the use of the modifier.`
                )

            }


            if (!classMap.has(lower_case_word)) {

                classMap.set(lower_case_word, new Map([["modifier", modifier]]))

                return true

            }


            classMap.get(lower_case_word)?.set("modifier", modifier)



            return true


        }


        return false


    }

const arbitraryPropertyRE =
    /(?<variant>(?:(?:(?:[\&:{1,2}[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?)\]|[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?):)*)?\[(?<property_key>[a-z]+(?:\-[a-z]+)*:)(?<property_value>[_\-),.\/(a-z0-9]+)\]/


export const attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty: ClassMapChangerBasedOnClassName<AllSortedClasses["arbitraryProperties"]> =
    (classMap, className) => {


        const arbitraryPropertyKeyAndValueMatch = arbitraryPropertyRE.exec(className)

        if (!arbitraryPropertyKeyAndValueMatch) return false


        const [,
            variant = "base",
            propertyKey,
            propertyValue
        ] = arbitraryPropertyKeyAndValueMatch



        if (!propertyKey || !propertyValue) return false


        if (!classMap.has(propertyKey)) {


            classMap.set(
                propertyKey,
                new Map([
                    [
                        variant,
                        propertyValue
                    ],
                ]
                )
            )

            return true

        }


        classMap.get(propertyKey)?.set(variant, propertyValue)


        return true




    }

const relationClassUtilityRE = /^(?<relationship>@?[a-z-]+\/)(?<name>[a-z]+)$/



export const attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass: ClassMapChangerBasedOnClassName<AllSortedClasses["tailwindCSSUtility"]> =
    (classMap, className) => {






        const relationClassUtilityMatch = className.match(relationClassUtilityRE)




        if (!relationClassUtilityMatch) return false


        const [, relationship, name] = relationClassUtilityMatch;


        if (!relationship || !name) return false

        if (!classMap.has(relationship)) {

            classMap.set(relationship, new Map([["word", new Map([["value", name]])]]))

            return true
        }

        classMap.get(relationship)?.get("word")?.set("value", name)

        return true



    }


const variantGroupRE =
    /(?<variant>[a-z0-9\]\[&\-\.#@+),\_\/(:]+:)\((?<class_names>(?:[\w\-\]\[$.#),(%:\/]+)(?:\s[\w\-\]\[$.#)\/,(%:]+)+)\)/

type PropsNeededFromClassMap = {
    tailwindCSSUtility: AllSortedClasses["tailwindCSSUtility"]
    customFiltered: AllSortedClasses["customFiltered"]
    arbitraryProperties: AllSortedClasses["arbitraryProperties"]
}

export const attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup =
    ({ arbitraryProperties, customFiltered, tailwindCSSUtility, }: PropsNeededFromClassMap, className: string, filterObject?: FilterObject): boolean => {




        let classMapHasChanged = false

        const variantGroupMatch = variantGroupRE.exec(className)


        if (!variantGroupMatch) return classMapHasChanged

        const [, variant, classNames] = variantGroupMatch


        if (!variant || !classNames) return classMapHasChanged

        const splitClassNames = classNames?.split(/\s/)


        splitClassNames
            .map(className => `${variant}${className}`)
            .forEach((className) => {

                const attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValueResult =
                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(tailwindCSSUtility, className)

                if (attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValueResult) {

                    classMapHasChanged = true
                    return
                }

                const attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClassResult =
                    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(tailwindCSSUtility, className)

                if (attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClassResult) {

                    classMapHasChanged = true
                    return
                }

                const attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryPropertyResult = attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(arbitraryProperties, className)

                if (attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryPropertyResult) {

                    classMapHasChanged = true
                    return
                }
                if (filterObject) {

                    const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectResult = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject(customFiltered, className, filterObject)

                    if (attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectResult) {

                        classMapHasChanged = true
                        return
                    }
                }

            })


        return classMapHasChanged


    };


