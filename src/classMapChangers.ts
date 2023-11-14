
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
    /^(?<variant>[a-z0-9\][#\.&:\-\)",_=(\/]+:)?(?<prefix>!|-|!-)?(?<type>[a-z]+-)(?<subtype>[a-z]+-)?(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d]+)$/


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



export const viableUtilityClassMapKeys = ["digit", "word", "color", "variable", "function", "args", "slashValue"] as const

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
    tailwindCSSUtility: new Map<
        string,
        Map<
            ViableUtilityClassMapKeys,
            Map<"prefix" | "value", string> | undefined
        > | undefined
    >()

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


    const cssTypeValueUtilityClassMatchGroups =
        /(?<type>[a-z]+-)(?<subtype>(?:[a-z]+-)*)?(?<value>[a-z\d]+)/.exec(className)?.groups
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


type DirectionClassParts = Record<"up" | "down", `${string}-`>
    & Record<
        "left" | "right" |
        "topLeft" | "topRight" |
        "bottomLeft" | "bottomRight",
        {
            primary: `${string}-`;
            secondary?: `${string}-`;
        }>
    & Record<"horizontal" | "vertical" | "both", `${string}-`>;

const getDeleteKeyBasedOnDirectionBasedClasses = (
    classTypesThatUseDirectionParts: Array<string>,
    requiredClassParts: DirectionClassParts

) => (
    classMap: AllSortedClasses['tailwindCSSUtility'],
    classType: string,
    classSubtype: string
) => {


        const classTypeIsAPartOfOrIsAClassThatUsesDirectionParts = classTypesThatUseDirectionParts
            .some(value => classType.startsWith(value) || classType === value)


        if (!classTypeIsAPartOfOrIsAClassThatUsesDirectionParts) return false


        const deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts =
            (directionClassPart: string, opposingDirectionClassPart: string) => {


                if (classType.endsWith(directionClassPart)) {


                    return classMap
                        .get(`${classType.replace(directionClassPart, "")}${opposingDirectionClassPart}`)
                        ?.delete("digit")

                }



                if (classSubtype === directionClassPart) {


                    return classMap
                        .get(`${classType}${opposingDirectionClassPart === "-" ? "" : opposingDirectionClassPart}`)
                        ?.delete("digit")


                }

                return false

            }


        const {
            up,
            down,
            left,
            right,
            horizontal,
            both,
            vertical,
            bottomLeft,
            bottomRight,
            topLeft,
            topRight
        } = requiredClassParts


        const mapHasChanged = [
            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(up, down),
            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(down, up),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                left.primary,
                right.primary
            ),
            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                right.primary,
                left.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topLeft.primary,
                bottomRight.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomRight.primary,
                topLeft.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topRight.primary,
                bottomLeft.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomLeft.primary,
                topRight.primary
            ),


            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomLeft.primary,
                bottomRight.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomRight.primary,
                bottomLeft.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topLeft.primary,
                topRight.primary
            ),
            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topRight.primary,
                topLeft.primary
            ),

            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(horizontal, vertical),
            deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(vertical, horizontal),
            // ! It's best to leave these conditions at the bottom since they will rarely be reached
            left?.secondary && right?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                left.secondary,
                right.secondary
            ),

            left?.secondary && right?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                right.secondary,
                left.secondary
            ),

            topLeft?.secondary && bottomRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomRight.secondary,
                topLeft.secondary
            ),

            bottomLeft?.secondary && topRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topRight.secondary,
                bottomLeft.secondary
            ),


            topLeft?.secondary && topRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topLeft.secondary,
                topRight.secondary
            ),

            topLeft?.secondary && topRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                topLeft.secondary,
                topRight.secondary
            ),

            bottomLeft?.secondary && bottomRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomRight.secondary,
                bottomLeft.secondary
            ),

            bottomLeft?.secondary && bottomRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(
                bottomRight.secondary,
                bottomLeft.secondary
            ),

        ].some(value => value === true)


        if (!mapHasChanged) {


            return [
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, up),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(up, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(down, both),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(left.primary, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, left.primary),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(right.primary, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, right.primary),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(topLeft.primary, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, topLeft.primary),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(topRight.primary, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, topRight.primary),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(bottomLeft.primary, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, bottomLeft.primary),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(bottomRight.primary, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, bottomRight.primary),

                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(horizontal, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, horizontal),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(vertical, both),
                deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, vertical),

                // ! It's best to leave these conditions at the bottom since they will rarely be reached
                left?.secondary && right?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(left.secondary, both),
                left?.secondary && right?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, left.secondary),
                topLeft?.secondary && topRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(topRight.secondary, both),
                topLeft?.secondary && topRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, topRight.secondary),

                bottomLeft?.secondary && bottomRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(bottomRight.secondary, both),
                bottomLeft?.secondary && bottomRight?.secondary && deleteColorValueTypeBasedOnClassPartsOpposingDirectionParts(both, bottomRight.secondary),

            ].reduce(value => value === true)

        }


        return mapHasChanged



    }


const attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound =
    getDeleteKeyBasedOnDirectionBasedClasses(
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
            "rounded",
            "scroll",
            "scroll-m",
            "touch-pan",
            "bg-repeat",
            "divide",
        ],
        {
            up: "t-",
            down: "b-",
            left: {
                primary: "l-",
                secondary: "s-"
            },
            topLeft: {
                primary: "tl-",
                secondary: "ss-"
            },
            bottomLeft: {
                primary: "bl-",
                secondary: "es-"
            },
            right: {
                primary: "r-",
                secondary: "e-"
            },
            topRight: {
                primary: "tr-",
                secondary: "se-"
            },
            bottomRight: {
                primary: "br-",
                secondary: "ee-"
            },
            horizontal: "x-",
            both: "-",
            vertical: "y-"
        }
    );




const attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue =
    (
        classMap: AllSortedClasses["tailwindCSSUtility"],
        classGroups:
            Record<"variant" | "value" | "prefix", string> &
            Record<"type" | "subtype", `${string}-`>
    ) => {


        let classMapHasChanged = false

        const crossValueUtilityClassRelationShipWithClassesObject:
            Record<`${string}-`, Record<`${string}-`, ViableUtilityClassMapKeys>> = {
            "text-": {
                "leading-": "digit",
                "text-": "word",
            },
            "shadow-": {
                "shadow-": "color",
                "opacity-": "digit"
            },
            "accent-": {
                "accent-": "color",
                "opacity-": "digit"
            },
            "bg-": {
                "bg-": "color",
                "opacity-": "digit"
            },
            "border-": {
                "border-": "color",
                "opacity-": "digit"
            },
            "divide-": {
                "divide-": "color",
                "opacity-": "digit"
            },
            "ring-": {
                "ring-": "color",
                "opacity-": "digit"
            },
        }


        const { variant, prefix, type, subtype, value } = classGroups


        const valueFromCrossValueUtilityClassRelationShipWithClassesMapUsingTypeWithNoDash =
            crossValueUtilityClassRelationShipWithClassesObject[`${type}${subtype}`]

        const classVariantAndSubTypeFromClassGroups = `${variant}${type}${subtype}`;

        if (valueFromCrossValueUtilityClassRelationShipWithClassesMapUsingTypeWithNoDash) {




            if (!classVariantAndSubTypeFromClassGroups) {

                classMap.set(
                    classVariantAndSubTypeFromClassGroups,
                    new Map([
                        [viableUtilityClassMapKeys["6"],
                        new Map([['prefix', prefix], ['value', value]])]
                    ]
                    ))

            }



            if (classVariantAndSubTypeFromClassGroups) {

                classMap.get(classVariantAndSubTypeFromClassGroups)
                    ?.get(viableUtilityClassMapKeys[6])
                    ?.set("prefix", prefix)
                    ?.set("value", value)


            }




            const fullClassTypeAndValueTypeObjects =
                Object
                    .entries(
                        valueFromCrossValueUtilityClassRelationShipWithClassesMapUsingTypeWithNoDash
                    ).map(([classType, valueType]) => ({
                        fullClassType: `${variant}${classType}`,
                        valueType
                    }))


            fullClassTypeAndValueTypeObjects
                .forEach
                (({ fullClassType, valueType }) =>
                    classMap.get(fullClassType)?.delete(valueType)
                )


            classMapHasChanged = true
        }



        return classMapHasChanged




    }

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

                    return true

                }

                classMap.get(classVariantAndType)
                    ?.set(viableUtilityClassMapKeys[2], new Map([
                        ["prefix", prefix],
                        ["value", `${color}${range}`]
                    ]))


                deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                    classMap,
                    classVariantTypeAndSubtype,
                    "color"
                )

                return true
            }





            if (!classMap.has(classVariantTypeAndSubtype)) {



                if (valueIsAViableDigit) {



                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[0], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))



                    const keyDeletionAttemptResult = attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                        classMap,
                        classVariantAndType,
                        subtype
                    );

                    if (!keyDeletionAttemptResult) {

                        deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                            classMap,
                            classVariantTypeAndSubtype,
                            "digit"
                        )
                    }

                    return true

                }

                if (valueIsAViableWord) {



                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[1], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "word"
                    )

                    return true

                }



                if (arbitraryValueIsAViableNonColorFunction) {


                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[4], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "function"
                    )

                    return true

                }


                if (arbitraryValueIsAViableCSSVariable) {

                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[3], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "variable"
                    )

                    return true

                }




                if (arbitraryValueIsASetOfArgs) {


                    classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[5], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ])]]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "args"
                    )

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


                    const keyDeletionAttemptResult = attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                        classMap,
                        classVariantAndType,
                        subtype
                    );

                    if (!keyDeletionAttemptResult) {

                        deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                            classMap,
                            classVariantTypeAndSubtype,
                            "digit"
                        )
                    }


                    return true

                }


                if (valueIsAViableWord) {

                    result.set(viableUtilityClassMapKeys[1], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "word"
                    )


                    return true

                }



                if (arbitraryValueIsAViableNonColorFunction) {

                    result.set(viableUtilityClassMapKeys[4], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))


                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "color"
                    )

                    return true
                }

                if (arbitraryValueIsAViableCSSVariable) {

                    result.set(viableUtilityClassMapKeys[3], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "variable"
                    )


                    return true
                }

                if (arbitraryValueIsASetOfArgs) {

                    result.set(viableUtilityClassMapKeys[5], new Map([
                        ["prefix", prefix],
                        ["value", value]
                    ]))

                    deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                        classMap,
                        classVariantTypeAndSubtype,
                        "args"
                    )


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

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "color")

                return true
            }


            if (valueIsAViableDigit) {



                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[0], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))






                const keyDeletionAttemptResult = attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    classVariantAndType,
                    subtype
                );

                if (!keyDeletionAttemptResult) {

                    deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "digit")
                }

                return true

            }


            if (valueIsAViableWord) {



                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[1], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "word")

                return true

            }



            if (arbitraryValueIsAViableNonColorFunction) {


                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[4], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "function")

                return true

            }


            if (arbitraryValueIsAViableCSSVariable) {

                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[3], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "variable")

                return true

            }




            if (arbitraryValueIsASetOfArgs) {


                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[5], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "args")

                return true

            }




        }






        const result = classMap.get(classVariantAndType)


        if (result) {


            if (valueIsAViableColor) {

                if (!colorRangeGroups) {


                    result.set(
                        viableUtilityClassMapKeys[2],
                        new Map([
                            ["prefix", prefix],
                            ["value", value]
                        ])
                    )

                    deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "color")

                    return true

                }


                result.get(viableUtilityClassMapKeys[2])
                    ?.set("prefix", prefix)
                    .set("value", `${colorRangeGroups?.color}${colorRangeGroups?.range}`)

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "color")

                return true

            }



            if (valueIsAViableDigit) {

                result.set(viableUtilityClassMapKeys[0], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))

                const keyDeletionAttemptResult = attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    classVariantAndType,
                    subtype
                );

                if (!keyDeletionAttemptResult) {

                    deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "digit")
                }

                return true

            }


            if (valueIsAViableWord) {

                result.set(viableUtilityClassMapKeys[1], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))


                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "word")

                return true

            }



            if (arbitraryValueIsAViableNonColorFunction) {

                result.set(viableUtilityClassMapKeys[4], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "function")

                return true
            }

            if (arbitraryValueIsAViableCSSVariable) {

                result.set(viableUtilityClassMapKeys[3], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))


                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "variable")

                return true
            }

            if (arbitraryValueIsASetOfArgs) {

                result.set(viableUtilityClassMapKeys[5], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, "args")

                return true
            }






        }


        const attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValueResult =

            attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue(
                classMap,
                {
                    type: type as `${string}-`,
                    subtype: subtype as `${string}-`,
                    value,
                    variant,
                    prefix,
                }
            )

        if (attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValueResult) {

            return true
        }



        return false


    }


function deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
    classMap: AllSortedClasses['tailwindCSSUtility'],
    classNameType: string,
    valueType: ViableUtilityClassMapKeys
) {

    const tailwindClassVariantTypeAndSubtypeRE = /^(?<variant>[a-z0-9\][#\.&:\-\)",_=(\/]+:)?(?<type>[a-z]+-)(?<subtype>[a-z]+-)$/

    const tailwindClassVariantTypeAndSubtypeGroups = tailwindClassVariantTypeAndSubtypeRE.exec(classNameType)?.groups

    if (!tailwindClassVariantTypeAndSubtypeGroups) return

    const { variant = '', type } = tailwindClassVariantTypeAndSubtypeGroups

    if (!type) return


    const identicalKey = Array.from(classMap.keys()).find((key) => {

        const keyIsAtTailwindClassVariantTypeAndSubtype = tailwindClassVariantTypeAndSubtypeRE.test(key)

        const keyIsIdenticalToVariantAndTypeCombined =
            new Set(`${key}${variant}${type}`).size === new Set(key).size


        return keyIsAtTailwindClassVariantTypeAndSubtype
            && key !== classNameType
            && keyIsIdenticalToVariantAndTypeCombined

    })

    if (!identicalKey) return

    return classMap.get(identicalKey)?.delete(valueType)


}

function deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap: AllSortedClasses["tailwindCSSUtility"], classNameType: string, valueType: ViableUtilityClassMapKeys) {

    const tailwindClassVariantAndTypeRE = /^(?<variant>[a-z0-9\][#\.&:\-\)",_=(\/]+:)(?<type>[a-z]+-)$/

    const tailwindClassVariantAndTypeGroups = tailwindClassVariantAndTypeRE.exec(classNameType)?.groups

    if (!tailwindClassVariantAndTypeGroups) return

    const { variant, type } = tailwindClassVariantAndTypeGroups

    if (!variant || !type) return

    const identicalKey = Array.from(classMap.keys()).find((key) => {


        const keyIsAtTailwindClassVariantTypeAndSubtype = tailwindClassVariantAndTypeRE.test(key)


        const keyIsIdenticalToVariantAndTypeCombined =
            new Set(`${key}${variant}${type}`).size === new Set(key).size




        return keyIsAtTailwindClassVariantTypeAndSubtype
            && key !== classNameType
            && keyIsIdenticalToVariantAndTypeCombined

    })

    if (!identicalKey) return

    return classMap.get(identicalKey)?.delete(valueType)

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

        const variantGroupMatchGroups = variantGroupRE.exec(className)?.groups


        if (!variantGroupMatchGroups) return classMapHasChanged

        const { variant, class_names } = variantGroupMatchGroups


        if (!variant || !class_names) return classMapHasChanged

        const splitClassNames = class_names?.split(/\s/)


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


