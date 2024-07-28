import {
    type BEMClassNamesMap,
    type BootstrapClassNamesMap,
    viableUtilityClassMapKeys,
    type BaseCN_EFSClassNamesMap,
    type ClassNameMap,
    type TailwindClassNamesMap,
    type ViableUtilityClassMapKeys
} from "./ClassNameMaps";

export type FilterObject = Record<string, Array<Lowercase<string>>>;

const properCSSDigitRE = /^(?<digit>\d{1,4}(?:[a-z]{2,4})?)$/

const checkIfStringIsAProperDigit = (string: string) => properCSSDigitRE.test(string)


const colorRangeRE = /^(?<color>[a-z]+-)(?<range>[0-9]{2,4})$/

const hexColorRE = /^(?<hex_color>#[A-Fa-f0-9]{3,6})$/

const cssColorFunctionRE = /(?<css_color_function>[a-z]{3,9}\((?:\d{1,4}(?:%|[a-z]{3,4}|\.\d+)?(?:,|_)?){3,4}\))/

const isAColorRange = (string: string) => colorRangeRE.test(string)

const subtypeUsesAnAryAsAPostFixWithMaybeAValueRE =
    /^(?<subtype>[a-z]+ary-)(?<value>[a-z\d]+)?$/

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




type ClassMapChangerBasedOnClassName<
    T extends ClassNameMap,
    U = undefined> =
    U extends undefined
    ? (classMap: T, className: string,) => boolean
    : (classMap: T, className: string, data: U) => boolean

export const attemptToChangeClassMapIfAClassIsASingleWordClass =
    (arrayOfStrings: Array<string>, className: string) => {

        const isLowerCaseWordRE = lowerCaseWordRE.test(className)

        if (!isLowerCaseWordRE) return false

        if (arrayOfStrings.includes(className)) return false


        arrayOfStrings.push(className)

        return true

    }



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

const attemptToDeleteKeyBasedOnDirectionBasedClassesFactory = (
    classTypesThatUseDirectionParts: ReadonlyArray<string>,
    requiredClassParts: DirectionClassParts
) => <T extends Map<string, Map<'digit' | Omit<string, 'digit'>, Map<"prefix" | "value", string> | undefined> | undefined>>(
    classMap: T,
    classTypeAndSubtype: {
        type: string,
        subtype: string
    }
) => {

        const { type, subtype } = classTypeAndSubtype

        const classTypeIsAPartOfOrIsAClassThatUsesDirectionParts = classTypesThatUseDirectionParts
            .some(value => type.startsWith(value) || type === value)


        if (!classTypeIsAPartOfOrIsAClassThatUsesDirectionParts) return false


        const deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts =
            (directionClassPart: string, opposingDirectionClassPart: string) => {


                if (type.endsWith(directionClassPart)) {

                    const valueMap = classMap.get(
                        `${type.replace(directionClassPart, "")}${opposingDirectionClassPart}`
                    )


                    return valueMap?.delete(viableUtilityClassMapKeys[0])


                }



                if (subtype === directionClassPart) {

                    const valueMap = classMap
                        .get(`${type}${opposingDirectionClassPart === "-" ? "" : opposingDirectionClassPart}`)


                    return valueMap?.delete(viableUtilityClassMapKeys[0])


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




        return [
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, up),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(up, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(down, both),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(left.primary, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, left.primary),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(right.primary, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, right.primary),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(topLeft.primary, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, topLeft.primary),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(topRight.primary, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, topRight.primary),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(bottomLeft.primary, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, bottomLeft.primary),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(bottomRight.primary, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, bottomRight.primary),

            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(horizontal, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, horizontal),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(vertical, both),
            deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, vertical),

            // ! It's best to leave these conditions at the bottom since they will rarely be reached
            left?.secondary && right?.secondary && deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(left.secondary, both),
            left?.secondary && right?.secondary && deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, left.secondary),
            topLeft?.secondary && topRight?.secondary && deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(topRight.secondary, both),
            topLeft?.secondary && topRight?.secondary && deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, topRight.secondary),

            bottomLeft?.secondary && bottomRight?.secondary && deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(bottomRight.secondary, both),
            bottomLeft?.secondary && bottomRight?.secondary && deleteDigitValueTypeBasedOnClassPartsOpposingDirectionParts(both, bottomRight.secondary),

        ].reduce(value => value === true)



    }

const attemptToDeleteKeysInTheBaseCN_EFSClassNamesMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound =
    attemptToDeleteKeyBasedOnDirectionBasedClassesFactory(
        [
            "m",
            "margin",
            "z-index",
            "border",
            "p",
            "padding",
            "start",
            "end",
            "overflow",
            "gap",
            "scale",
            "translate",
            "rotate",
            "skew",
            "rounded",
            "border-radius",
            "scroll",
            "scroll-m",
            "scroll-margin",
            "touch-pan",
            "bg-repeat",
            "background-repeat",
            "divide",
            "space",
        ],
        {
            up: "t-",
            down: "b-",
            left: {
                primary: "l-",
                secondary: "left-"
            },
            topLeft: {
                primary: "tl-",
                secondary: "top-left-"
            },
            bottomLeft: {
                primary: "bl-",
                secondary: "bottom-left-"
            },
            right: {
                primary: "r-",
                secondary: "right-"
            },
            topRight: {
                primary: "tr-",
                secondary: "top-right-"
            },
            bottomRight: {
                primary: "br-",
                secondary: "bottom-right-"
            },
            horizontal: "x-",
            both: "-",
            vertical: "y-"
        }
    );


export const attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue: ClassMapChangerBasedOnClassName<BaseCN_EFSClassNamesMap["utility"]> = (classMap, className) => {


    const cssTypeValueUtilityClassMatchGroups =
        /(?<prefix>!|-|!-)?(?<type>[a-z]+-)(?<subtype>(?:[a-z]+-)*)?(?<value>[a-z\d]+)/.exec(className)?.groups



    if (!cssTypeValueUtilityClassMatchGroups) return false



    const { type, value, subtype = "", prefix } = cssTypeValueUtilityClassMatchGroups


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



                classMap.set(
                    type,
                    new Map().set(
                        viableUtilityClassMapKeys[2],
                        new Map()
                            .set('prefix', prefix)
                            .set('value', value)
                    )
                )

                return true

            }



            classMap.set(
                type,
                new Map().set(
                    viableUtilityClassMapKeys[2],
                    new Map()
                        .set('prefix', prefix)
                        .set('value', subTypeAndValue)
                )
            )

            return true

        }


        if (valueIsAViableDigit) {



            classMap.set(
                typeAndSubtype,
                new Map()
                    .set(
                        viableUtilityClassMapKeys[0],
                        new Map()
                            .set('prefix', prefix)
                            .set('value', value)
                    )
            )


            return true

        }


        if (valueIsAViableWord) {


            if (dashedLowerCaseWordGroups) {


                const { first_word, middle_words = "", last_word } = dashedLowerCaseWordGroups


                if (first_word && last_word) {

                    classMap.set(
                        type,
                        new Map().set(
                            viableUtilityClassMapKeys[1],
                            new Map()
                                .set('prefix', prefix)
                                .set('value', `${first_word}${middle_words}${last_word}`)
                        )
                    )

                    return true
                }

                classMap.get(type)?.set(
                    viableUtilityClassMapKeys[1],
                    new Map()
                        .set('prefix', prefix)
                        .set('value', `${first_word}${middle_words}${last_word}`)

                )


                return true
            }

            classMap.set(
                typeAndSubtype,
                new Map().set(
                    viableUtilityClassMapKeys[1],
                    new Map()
                        .set('prefix', prefix)
                        .set('value', value)
                )
            )



            return true
        }






    }



    const result = classMap.get(type) || classMap.get(typeAndSubtype)


    if (result) {

        if (valueIsAViableColor) {

            if (!colorRangeGroups) {

                result.set(viableUtilityClassMapKeys[2], new Map()
                    .set('prefix', prefix)
                    .set('value', value))

                return true

            }


            result.set(
                viableUtilityClassMapKeys[2],
                new Map()
                    .set('prefix', prefix)
                    .set('value', `${colorRangeGroups.color}${colorRangeGroups.range}`

                    )
            )


            return true

        }



        if (valueIsAViableDigit) {

            result.set(viableUtilityClassMapKeys[0], new Map()
                .set('prefix', prefix)
                .set('value', value))


            attemptToDeleteKeysInTheBaseCN_EFSClassNamesMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                classMap,
                {
                    type,
                    subtype
                }
            );


            return true
        }


        if (valueIsAViableWord) {

            result.set(viableUtilityClassMapKeys[1], new Map()
                .set('prefix', prefix)
                .set('value', value))



            return true

        }



    }

    return false


};




export const attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue: ClassMapChangerBasedOnClassName<BootstrapClassNamesMap["utility"]> =
    (classMap, className) => {

        const bootstrapCSSTypeBreakpointAndValueUtilityClassRE =
            /^(?<type>[a-z]+|[a-z]+-[a-z]+)(?<breakpoint>-(?:sm|md|lg|xl|xxl))?-(?<value>[a-z0-9]+)(?<state>-[a-z]+)?$/

        const bootstrapCSSTypeBreakpointAndValueAsColorUtilityClassRE =
            /^(?<type>[a-z]+|[a-z]+-[a-z]+)(?<breakpoint>-(?:sm|md|lg|xl|xxl))?-(?<value>(?:(?:(?:prim|second|terti)ary)|info|light|dark|danger|warning)+(?:-emphasis|-subtle)?)(?<state>-[a-z]+)?$/



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



                classMap.set(
                    classTypeAndBreakpoint,
                    new Map(
                        [["digitMap", new Map().set(state, value)]]
                    )
                )


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

                if (!result.has("digitMap")) {

                    result.set("digitMap", new Map())
                }

                result.get("digitMap")?.set(state, value)

                return true
            }


            if (valueIsAViableWord) {

                if (!result.has("wordMap")) {

                    result.set("wordMap", new Map())
                }

                result.get("wordMap")?.set(state, value)

                return true
            }

        }


        return false

    };





const attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound =
    attemptToDeleteKeyBasedOnDirectionBasedClassesFactory(
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

export type ClassTypesWithRelationShipsWithOtherClassTypes = Record<
    string,
    {
        isDirectional?: true
        classType: `${string}-`
        valueType: ViableUtilityClassMapKeys
        secondary: {
            classType: `${string}-`
            valueType: ViableUtilityClassMapKeys

        }
    }
>



const tailwindCSSTypeAndValueUtilityClassRE =
    /^(?<variant>\S+:)?(?<prefix>!|-|!-)?(?<type>[a-z]+-)(?<subtype>(?<first>[a-z]+-)?(?<second>[a-z]+-))?(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d\/\][]+)$/

export const attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass =
    (sortedTailwindClasses: TailwindClassNamesMap, className: string) => {

        const { safeListed, utility: tailwindCSSUtility } = sortedTailwindClasses

        const aliasClassValueTypesAndNames = {
            digit: ['border', 'invert', 'grow', 'shrink', 'grayscale', 'sepia'],
            word: ['transition', 'resize', 'isolate']
        }

        const tailwindCSSTypeAndValueUtilityClassRE =
            /^(?<variant>\S+:)?(?<prefix>!|-|!-)?(?<type>[a-z]+-?)(?<subtype>(?<first>[a-z]+-)?(?<second>[a-z]+-))?(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d\/\][]+)?$/
        const tailwindCSSTypeAndValueUtilityClassGroups =
            tailwindCSSTypeAndValueUtilityClassRE.exec(className)?.groups




        if (!tailwindCSSTypeAndValueUtilityClassGroups) return false

        const { variant = '', type, subtype, value, prefix = '' } = tailwindCSSTypeAndValueUtilityClassGroups


        if (!type) return false

        if (subtype) return false

        const typeWithoutTheDash = type.replace('-', '')

        if (value) {

            const variantAndType = `${variant}${type}`;

            const classTypeIsInAliasClassValueTypesAndNames =
                Object.values(aliasClassValueTypesAndNames)
                    .flat()
                    .includes(typeWithoutTheDash)


            if (!classTypeIsInAliasClassValueTypesAndNames) return false

            const index = sortedTailwindClasses.safeListed
                .findIndex(
                    value => value === `${variant}${typeWithoutTheDash}`
                )

            const INVALID_INDEX = -1;

            if (index === INVALID_INDEX) return false

            const valueIsAViableDigit = checkIfStringIsAProperDigit(value)


            const valueIsAViableWord = checkIfStringIsALowerCaseWord(value)

            if (aliasClassValueTypesAndNames.digit.includes(typeWithoutTheDash) && valueIsAViableDigit) {


                const utilityMap = tailwindCSSUtility.get(variantAndType)

                if (!utilityMap) {

                    tailwindCSSUtility.set(
                        variantAndType,
                        new Map().set(
                            viableUtilityClassMapKeys[0],
                            new Map()
                                .set("prefix", prefix)
                                .set("value", value))
                    )

                    safeListed.splice(index, 1)

                    return true

                }


                let digitMap = utilityMap?.get(viableUtilityClassMapKeys[0])

                if (!digitMap) {

                    digitMap = utilityMap.set(
                        viableUtilityClassMapKeys[0],
                        new Map()
                    )
                        .get(viableUtilityClassMapKeys[0])

                }

                digitMap?.set("prefix", prefix)
                    .set("value", value)

                safeListed.splice(index, 1)

                return true
            }



            if (aliasClassValueTypesAndNames.word.includes(typeWithoutTheDash) && valueIsAViableWord) {

                const utilityMap = tailwindCSSUtility.get(variantAndType)

                if (!utilityMap) {

                    tailwindCSSUtility.set(
                        variantAndType,
                        new Map().set('word', new Map()
                            .set("prefix", prefix)
                            .set("value", value))
                    )
                    safeListed.splice(index, 1)

                    return true
                }


                let wordMap = utilityMap?.get(viableUtilityClassMapKeys[1])

                if (!wordMap) {
                    wordMap = utilityMap.set(
                        viableUtilityClassMapKeys[1],
                        new Map()
                    )
                        .get(viableUtilityClassMapKeys[1])


                }

                wordMap
                    ?.set("prefix", prefix)
                    .set("value", value)

                safeListed.splice(index, 1)


                return true
            }


            return false
        }




        if (aliasClassValueTypesAndNames.digit.includes(typeWithoutTheDash)) {

            const map = tailwindCSSUtility
                .get(`${variant}${type}-`)

            map?.delete('digit')

            safeListed.push(`${variant}${type}`)

            return true
        }



        if (aliasClassValueTypesAndNames.word.includes(typeWithoutTheDash)) {

            const map = sortedTailwindClasses.utility
                .get(`${variant}${type}-`)

            map?.delete('word')

            safeListed.push(`${variant}${type}`)

            return true
        }


        return false
    }


export const attemptToChangeTailwindCSSUtilityClassMapBasedOnIfAClassHasASlashValue: ClassMapChangerBasedOnClassName<TailwindClassNamesMap["utility"], ClassTypesWithRelationShipsWithOtherClassTypes> =
    (
        classMap,
        className,
        crossValueUtilityClassAndRelatedClassMap,
    ) => {


        let classMapHasChanged = false




        const cssTypeValueUtilityClassMatchGroups =
            tailwindCSSTypeAndValueUtilityClassRE.exec(className)?.groups


        if (!cssTypeValueUtilityClassMatchGroups) return false

        const {
            type,
            value,
            variant = "",
            prefix = "",
            first: firstSubtype = '',
            second: secondSubtype = '',
        } = cssTypeValueUtilityClassMatchGroups


        if (!type || !value) return false


        const valueFromCrossValueUtilityClassAndRelatedClassMapUsingTypeWithNoDash = crossValueUtilityClassAndRelatedClassMap[type.replace("-", "")]

        const classVariantAndSubTypeFromClassGroups =
            firstSubtype
                ? `${variant}${type}${firstSubtype}`
                : `${variant}${type}${secondSubtype}`;



        const valueIsASlashValue = /^[a-z\d]+\/[a-z\d\][]+$/.test(value)




        const valueIsASlashValueAndClassTypeIsAKeyInCrossValueUtilityClassAndRelatedClassMap =
            valueFromCrossValueUtilityClassAndRelatedClassMapUsingTypeWithNoDash
            && valueIsASlashValue;

        if (
            valueIsASlashValueAndClassTypeIsAKeyInCrossValueUtilityClassAndRelatedClassMap
        ) {

            const secondSubtypeAndValue = `${secondSubtype}${value}`;

            const subtypeAndValueIsAColorWordAndSlashValue =
                /^[a-z]+-[a-z\d]+\/[a-z\d\][\.]+$/.test(secondSubtypeAndValue)


            if (firstSubtype && subtypeAndValueIsAColorWordAndSlashValue) {



                if (!classMap.has(classVariantAndSubTypeFromClassGroups)) {

                    classMap.set(
                        classVariantAndSubTypeFromClassGroups,
                        new Map([
                            [
                                viableUtilityClassMapKeys["6"],
                                new Map([
                                    ['prefix', prefix],
                                    ['value', secondSubtypeAndValue]
                                ])
                            ]
                        ]
                        ))

                }



                if (classMap.has(classVariantAndSubTypeFromClassGroups)) {


                    const classVariantAndSubTypeFromClassGroupsResult =
                        classMap.get(classVariantAndSubTypeFromClassGroups)

                    const classVariantAndSubTypeFromClassGroupsResultDoesNotHaveASlashValue = !classVariantAndSubTypeFromClassGroupsResult
                        ?.has(viableUtilityClassMapKeys[6]);

                    if (classVariantAndSubTypeFromClassGroupsResultDoesNotHaveASlashValue) {

                        classVariantAndSubTypeFromClassGroupsResult
                            ?.set(
                                viableUtilityClassMapKeys[6],
                                new Map([
                                    ['prefix', prefix],
                                    ['value', secondSubtypeAndValue]
                                ])
                            )

                    }

                    classVariantAndSubTypeFromClassGroupsResult
                        ?.get(viableUtilityClassMapKeys[6])
                        ?.set("prefix", prefix)
                        ?.set("value", secondSubtypeAndValue)


                }



            }

            if (!firstSubtype) {

                if (!classMap.has(classVariantAndSubTypeFromClassGroups)) {

                    classMap.set(
                        classVariantAndSubTypeFromClassGroups,
                        new Map([
                            [
                                viableUtilityClassMapKeys["6"],
                                new Map([
                                    ['prefix', prefix],
                                    ['value', value]
                                ])
                            ]
                        ]
                        ))

                }


                if (classMap.has(classVariantAndSubTypeFromClassGroups)) {


                    const classVariantAndSubTypeFromClassGroupsResult =
                        classMap.get(classVariantAndSubTypeFromClassGroups)

                    const classVariantAndSubTypeFromClassGroupsResultDoesNotHaveASlashValue = !classVariantAndSubTypeFromClassGroupsResult
                        ?.has(viableUtilityClassMapKeys[6]);

                    if (classVariantAndSubTypeFromClassGroupsResultDoesNotHaveASlashValue) {

                        classVariantAndSubTypeFromClassGroupsResult
                            ?.set(
                                "slashValue",
                                new Map([
                                    ['prefix', prefix],
                                    ['value', value]
                                ])
                            )

                    }

                    classVariantAndSubTypeFromClassGroupsResult
                        ?.get(viableUtilityClassMapKeys[6])
                        ?.set("prefix", prefix)
                        ?.set("value", value)


                }

            }


            const {
                isDirectional,
                secondary,
                classType,
                valueType
            } = valueFromCrossValueUtilityClassAndRelatedClassMapUsingTypeWithNoDash

            if (isDirectional) {

                attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    {
                        type: `${variant}${classType}`,
                        subtype: firstSubtype ?? secondSubtype
                    }
                )

                classMap
                    .get(`${variant}${secondary.classType}`)
                    ?.delete(secondary.valueType)

            }

            if (!isDirectional) {

                classMap.get(`${variant}${classType}`)
                    ?.delete(valueType)

                classMap.get(`${variant}${secondary.classType}`)
                    ?.delete(secondary.valueType)
            }



            classMapHasChanged = true
        }



        return classMapHasChanged




    }

export const attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue:
    ClassMapChangerBasedOnClassName<TailwindClassNamesMap["utility"]> =
    (classMap, className) => {




        const cssVariableWithOptionalPrefixedHintRE =
            /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

        const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)


        const variableHasAColorHint = (arbitraryValue: string) =>
            cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.variable_hint === "color:"

        const variableHasALengthHint = (arbitraryValue: string) =>
            cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.variable_hint === "length:"

        const variableHasAStringHint = (arbitraryValue: string) =>
            cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.variable_hint === "string:"


        const cssTypeValueUtilityClassMatchGroups =
            tailwindCSSTypeAndValueUtilityClassRE.exec(className)?.groups


        if (!cssTypeValueUtilityClassMatchGroups) return false

        const {
            type,
            value,
            variant = "",
            subtype = "",
            prefix = "",
        } = cssTypeValueUtilityClassMatchGroups


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
                    viableUtilityClassMapKeys[2]
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
                        {
                            type: classVariantAndType,
                            subtype
                        }
                    );

                    if (!keyDeletionAttemptResult) {

                        deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                            classMap,
                            classVariantTypeAndSubtype,
                            viableUtilityClassMapKeys[0]
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
                        viableUtilityClassMapKeys[1]
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

                    classMap.set(
                        classVariantTypeAndSubtype,
                        new Map([[viableUtilityClassMapKeys[3], new Map([
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
                        {
                            type: classVariantAndType,
                            subtype
                        }
                    );

                    if (!keyDeletionAttemptResult) {

                        deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
                            classMap,
                            classVariantTypeAndSubtype,
                            viableUtilityClassMapKeys[0]
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
                        viableUtilityClassMapKeys[1]
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
                        viableUtilityClassMapKeys[2]
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

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[2])

                return true
            }


            if (valueIsAViableDigit) {



                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[0], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))






                const keyDeletionAttemptResult = attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    {
                        type: classVariantAndType,
                        subtype
                    }
                );

                if (!keyDeletionAttemptResult) {

                    deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[0])
                }

                return true

            }


            if (valueIsAViableWord) {



                classMap.set(classVariantTypeAndSubtype, new Map([[viableUtilityClassMapKeys[1], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ])]]))

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[1])

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

                    deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[2])

                    return true

                }


                result.get(viableUtilityClassMapKeys[2])
                    ?.set("prefix", prefix)
                    .set("value", `${colorRangeGroups?.color}${colorRangeGroups?.range}`)

                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[2])

                return true

            }



            if (valueIsAViableDigit) {

                result.set(viableUtilityClassMapKeys[0], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))

                const keyDeletionAttemptResult = attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound(
                    classMap,
                    {
                        type: classVariantAndType,
                        subtype
                    }
                );

                if (!keyDeletionAttemptResult) {

                    deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[0])
                }

                return true

            }


            if (valueIsAViableWord) {

                result.set(viableUtilityClassMapKeys[1], new Map([
                    ["prefix", prefix],
                    ["value", value]
                ]))


                deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap, classVariantAndType, viableUtilityClassMapKeys[1])

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


        return false


    }


function deleteIdenticalValueTypeUsingTheKeyFromClassMapIfItsATailwindClassTypeAndSubtypeWithOptionalVariantPrefix(
    classMap: TailwindClassNamesMap['utility'],
    classNameType: string,
    valueType: ViableUtilityClassMapKeys
) {

    const tailwindClassVariantTypeAndSubtypeRE = /^(?<variant>\S+:)?(?<type>[a-z]+-)(?<subtype>[a-z]+-)$/

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

function deleteIdenticalKeyFromClassMapIfItsATailwindClassVariantAndType(classMap: TailwindClassNamesMap["utility"], classNameType: string, valueType: ViableUtilityClassMapKeys) {

    const tailwindClassVariantAndTypeRE = /^(?<variant>\S+:)(?<type>[a-z]+-)$/

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

type TypeAndListClassMapChanger = ClassMapChangerBasedOnClassName<BaseCN_EFSClassNamesMap["customFiltered"], Record<string, Array<string>>>

export const attemptToChangeClassNameMapBasedOnAFilterObject: TypeAndListClassMapChanger = (classMap, className, classTypeAndListObject) => {



    let classMapHasChanged = false

    const tailwindCSSUtilityClassVariantAndSelfRE = /(?<variant>\S+:)?(?<prefix>!|-|!-)?(?<class_type_and_value>[a-z0-9\-_\]\[,)(%#!]+)/

    const utilityClassVariantAndSelfGroups =
        tailwindCSSUtilityClassVariantAndSelfRE
            .exec(className)?.groups


    if (!utilityClassVariantAndSelfGroups) { return classMapHasChanged }


    const {
        variant = "base", class_type_and_value,
        prefix = ''
    } = utilityClassVariantAndSelfGroups


    if (!class_type_and_value) { return classMapHasChanged }


    for (const [classType, classList] of Object.entries(classTypeAndListObject)) {

        if (!classMap.has(classType) && classList.includes(class_type_and_value)) {

            classMap.set(
                classType,
                new Map([
                    [
                        variant,
                        `${prefix}${class_type_and_value}`
                    ],
                ])
            )

            classMapHasChanged = true
        }


        if (classList.includes(class_type_and_value)) {


            classMap.get(classType)
                ?.set(variant, `${prefix}${class_type_and_value}`)

            classMapHasChanged = true

        }






    }

    return classMapHasChanged

}




const aBlockElementClassName =
    /^(?<lower_case_word>[a-z]+)(?<element>__[a-z]+(?:--[a-z0-9]+)?)$/

const aBlockModifierClassName =
    /^(?<lower_case_word>[a-z]+)(?<modifier>--[a-z0-9]+)$/


export const attemptToChangeClassNameMapAccordingToIfTheBEMConvention: ClassMapChangerBasedOnClassName<
    BEMClassNamesMap["bem"],
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
    /(?<variant>\S+:)?\[(?<property_key>[a-z]+(?:\-[a-z]+)*:)(?<property_value>[_\-),.\/(a-z0-9]+)\]/


export const attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty: ClassMapChangerBasedOnClassName<TailwindClassNamesMap["arbitraryProperties"]> =
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



export const attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass: ClassMapChangerBasedOnClassName<TailwindClassNamesMap["utility"]> =
    (classMap, className) => {






        const relationClassUtilityMatch = className.match(relationClassUtilityRE)




        if (!relationClassUtilityMatch) return false


        const [, relationship, name] = relationClassUtilityMatch;


        if (!relationship || !name) return false

        if (!classMap.has(relationship)) {

            classMap.set(relationship, new Map([[viableUtilityClassMapKeys[1], new Map([["value", name]])]]))

            return true
        }

        classMap.get(relationship)?.get(viableUtilityClassMapKeys[1])?.set("value", name)

        return true



    }


const variantGroupRE =
    /(?<variant>\S+:)\((?<class_names>(?:[\w\-\]\[$.#),(%:\/]+)(?:\s[\w\-\]\[$.#)\/,(%:]+)+)\)/

type PropsNeededFromClassMap = Omit<TailwindClassNamesMap, 'safeListed'>

export const attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup =
    ({ arbitraryProperties, customFiltered, utility, }: PropsNeededFromClassMap, className: string, filterObject?: FilterObject): boolean => {





        const variantGroupMatchGroups = variantGroupRE.exec(className)?.groups




        if (!variantGroupMatchGroups) return false

        const { variant, class_names } = variantGroupMatchGroups


        if (!variant || !class_names) return false

        const splitClassNames = class_names?.split(/\s/)

        let classMapHasChanged = false


        const classNamesPrefixedWithVariant = splitClassNames
            .map(className => `${variant}${className}`)

        for (const className of classNamesPrefixedWithVariant) {

            const attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValueResult =
                attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(utility, className)

            if (attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValueResult) {

                classMapHasChanged = true
            }

            const attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClassResult =
                attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(utility, className)

            if (attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClassResult) {

                classMapHasChanged = true
            }

            const attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryPropertyResult = attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(arbitraryProperties, className)

            if (attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryPropertyResult) {

                classMapHasChanged = true
            }

            if (filterObject) {

                const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectResult = attemptToChangeClassNameMapBasedOnAFilterObject(customFiltered, className, filterObject)

                if (attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectResult) {

                    classMapHasChanged = true
                }
            }

        }


        return classMapHasChanged


    };


