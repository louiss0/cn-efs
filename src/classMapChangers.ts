

const cssVariableWithOptionalPrefixedHintRE =
    /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)

// const arbitraryPropertyRE = /\[(<property_key>[a-z]+(?:-[a-z]+)?):(<property_value>[_-)(a-z0-9]+)\]/

const cssTypeAndValueUtilityClassRE = /^(?<type>[a-z\][#&!:]+)-(?<value>[a-z0-9_\][$.#),\/\-(%:]+)$/

const cssTypeSubTypeAndValueUtilityClassRE = /^(?<type>[a-z\][#&!:]+)-(?<sub_type>[a-z]+)-(?<value>[a-z0-9_\][$.#),\-(%:]+)$/

const properCSSDigitRE = /^(?<digit>\d{1,4}(?:[a-z]{2,4})?)$/


const checkIfStringIsAProperDigit = (string: string) => properCSSDigitRE.test(string)


const colorRangeRE = /(?<color>[a-z]+)-(?<range>[1-9]00|9?50)/



const hexColorRE = /^(?<hex_color>#[A-Fa-f0-9]{3,6})$/


const cssColorFunctionRE = /(?<css_color_function>[a-z]{3,9}\((?:\d{1,4}(?:%|[a-z]{3,4}|\.\d+)?(?:,|_)?){3,4}\))/



const checkIfStringIsAProperColor = (string: string) =>
    colorRangeRE.test(string)
    || hexColorRE.test(string)
    || cssColorFunctionRE.test(string)


const cssNormalFunctionRE = /(?<css_function>[a-z_-]{3,15}\(([a-z0-9%!\(\).\/-]+(?:_|,)?)+\))/

const checkIfStringIsAProperCSSNormalFunction = (string: string) =>
    cssNormalFunctionRE.test(string) && !cssColorFunctionRE.test(string)

const arbitraryValueRE = /^\[(?<value>[a-z,0-9_\-)%!\/($.:]+)\]$/

const checkIfStringIsAProperArbitraryValue = (string: string) => arbitraryValueRE.test(string)

const lowerCaseWordRE = /^(?<lower_case_word>[a-z]+)$/


const checkIfStringIsALowerCaseWord = (string: string) => lowerCaseWordRE.test(string)

const cssTwoOrMoreArgsRE =
    /(?<first_arg>[a-z0-9]+\((?:[a-z0-9\-\/.]+|[a-z0-9\-_]+\([a-z0-9\-_\/.#$]+(?:(?:,|_)[a-z0-9\-_\/.#$]+)+\))(?:(?:,|_)[a-z0-9\-\/.#$]+|[a-z0-9\-_]+\([a-z0-9\-_\/.#$]+(?:(?:,_)[a-z0-9\-_\/.#$]+)+\))*\))(?:_[a-z0-9\-]+\([a-z0-9\-_\/.#$]+(?:(,|_)[a-z0-9\-_\/.#$]+)*\)|_[a-z0-9]+)+/g
const checkIfStringIsASetOfArgs = (string: string) => cssTwoOrMoreArgsRE.test(string)


export const viableClassObjectMapKeys = ["digit", "word", "color", "variable", "function", "args"] as const

export type ViableClassObjectMapKeys = typeof viableClassObjectMapKeys[number]

export type ClassValueTypeAndValueMap = Map<ViableClassObjectMapKeys, string | undefined>

export type ClassNamesMap = Map<string, string | ClassValueTypeAndValueMap | undefined>

type ClassMapChangerBasedOnClassName = (classNamesMap: ClassNamesMap, className: string) => boolean


export const attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged: ClassMapChangerBasedOnClassName = (classNamesMap, className) => {



    const cssTypeValueUtilityClassMatch = className.match(cssTypeAndValueUtilityClassRE)



    let classMapHasChanged = false

    if (cssTypeValueUtilityClassMatch) {

        const [, type, value] = cssTypeValueUtilityClassMatch


        if (!type || !value) return classMapHasChanged


        const arbitraryValueMatchSecondValue = value.match(arbitraryValueRE)?.[1]


        const valueIsAViableDigit = properCSSDigitRE.test(value)
            || arbitraryValueMatchSecondValue && properCSSDigitRE.test(arbitraryValueMatchSecondValue)


        const valueIsAViableWord = lowerCaseWordRE.test(value)
            || !!arbitraryValueMatchSecondValue && lowerCaseWordRE.test(arbitraryValueMatchSecondValue)

        const arbitraryValueIsAViableNonColorFunction = !!arbitraryValueMatchSecondValue
            && cssNormalFunctionRE.test(arbitraryValueMatchSecondValue)
            && !cssColorFunctionRE.test(arbitraryValueMatchSecondValue)

        const arbitraryValueIsAColorFunction = !!arbitraryValueMatchSecondValue
            && cssNormalFunctionRE.test(arbitraryValueMatchSecondValue)
            && cssColorFunctionRE.test(arbitraryValueMatchSecondValue)

        const arbitraryValueIsASetOfArgs = !!arbitraryValueMatchSecondValue
            && cssTwoOrMoreArgsRE.test(arbitraryValueMatchSecondValue)
            && !arbitraryValueIsAColorFunction

        const arbitraryValueIsAViableCSSVariable = !!arbitraryValueMatchSecondValue
            && cssVariableWithOptionalPrefixedHintRE.test(arbitraryValueMatchSecondValue)


        const valueIsAViableColor = arbitraryValueIsAColorFunction || hexColorRE.test(value)



        if (!classNamesMap.has(type)) {


            if (valueIsAViableDigit) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[0], value]]))

                classMapHasChanged = true

                return classMapHasChanged

            }


            if (valueIsAViableWord) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[1], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (valueIsAViableColor) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[2], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (arbitraryValueIsAViableNonColorFunction) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[4], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }


            if (arbitraryValueIsAViableCSSVariable) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[3], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (arbitraryValueIsASetOfArgs) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[5], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }








        }



        const result = classNamesMap.get(type)


        if (result && typeof result !== "string") {


            if (valueIsAViableDigit) {

                result.set(viableClassObjectMapKeys[0], value)

                classMapHasChanged = true

                return classMapHasChanged
            }


            if (valueIsAViableWord) {

                result.set(viableClassObjectMapKeys[1], value)

                classMapHasChanged = true

                return classMapHasChanged

            }

            if (valueIsAViableColor) {

                result.set(viableClassObjectMapKeys[2], value)

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (arbitraryValueIsAViableNonColorFunction) {

                result.set(viableClassObjectMapKeys[4], value)

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (arbitraryValueIsAViableCSSVariable) {

                result.set(viableClassObjectMapKeys[3], value)

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (arbitraryValueIsASetOfArgs) {

                result.set(viableClassObjectMapKeys[5], value)

                classMapHasChanged = true

                return classMapHasChanged
            }






        }

    }



    const cssTypeSubTypeAndValueUtilityClassMatch = className.match(cssTypeSubTypeAndValueUtilityClassRE)




    if (cssTypeSubTypeAndValueUtilityClassMatch) {

        const [, type, subType, value] = cssTypeSubTypeAndValueUtilityClassMatch

        if (!type || !subType || !value) return classMapHasChanged


        const arbitraryValueMatch = value.match(arbitraryValueRE)


        const arbitraryValueMatchSecondValue = arbitraryValueMatch?.[1]

        const valueIsAViableDigit = properCSSDigitRE.test(value)
            || arbitraryValueMatchSecondValue && properCSSDigitRE.test(arbitraryValueMatchSecondValue)


        const valueIsAViableFunction = cssNormalFunctionRE.test(value) && !cssColorFunctionRE.test(value)



        const valueIsAViableColor = colorRangeRE.test(`${subType}-${value}`)

        const valueOrArbitraryValueMatchSecondValueIsAViableWord = lowerCaseWordRE.test(value)
            || !!arbitraryValueMatchSecondValue && lowerCaseWordRE.test(arbitraryValueMatchSecondValue)

        const valueOrArbitraryValueMatchSecondValueIsASetOfArgs = cssTwoOrMoreArgsRE.test(value)
            || !!arbitraryValueMatchSecondValue && cssTwoOrMoreArgsRE.test(arbitraryValueMatchSecondValue)

        const arbitraryValueMatchSecondValueIsAViableCSSVariable =
            !!arbitraryValueMatchSecondValue
            && cssVariableWithOptionalPrefixedHintRE.test(arbitraryValueMatchSecondValue)



        if (!classNamesMap.has(`${type}-${subType}`)) {



            if (valueIsAViableColor) {

                classNamesMap.set(`${type}`, new Map([[viableClassObjectMapKeys[2], `${subType}-${value}`]]))

                classMapHasChanged = true

                return classMapHasChanged
            }


            if (valueIsAViableDigit) {

                classNamesMap.set(`${type}-${subType}`, new Map([[viableClassObjectMapKeys[0], value]]))

                classMapHasChanged = true

                return classMapHasChanged

            }



            if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                classNamesMap.set(`${type}-${subType}`, new Map([[viableClassObjectMapKeys[1], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (valueIsAViableFunction) {

                classNamesMap.set(`${type}-${subType}`, new Map([[viableClassObjectMapKeys[4], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }


            if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                classNamesMap.set(`${type}-${subType}`, new Map([[viableClassObjectMapKeys[3], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (valueOrArbitraryValueMatchSecondValueIsASetOfArgs) {

                classNamesMap.set(`${type}-${subType}`, new Map([[viableClassObjectMapKeys[5], value]]))

                classMapHasChanged = true

                return classMapHasChanged
            }







        }



        const result = classNamesMap.get(type) || classNamesMap.get(`${type}-${subType}`)


        if (result && typeof result !== "string") {


            if (valueIsAViableColor) {

                result.set(viableClassObjectMapKeys[2], `${subType}-${value}`)

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (valueIsAViableDigit) {

                result.set(viableClassObjectMapKeys[0], value)

                classMapHasChanged = true

                return classMapHasChanged
            }



            if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                result.set(viableClassObjectMapKeys[1], value)

                classMapHasChanged = true

                return classMapHasChanged

            }

            if (valueIsAViableFunction) {

                classNamesMap.set(viableClassObjectMapKeys[4], value)

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                result.set(viableClassObjectMapKeys[3], value)

                classMapHasChanged = true

                return classMapHasChanged
            }

            if (valueOrArbitraryValueMatchSecondValueIsASetOfArgs) {

                result.set(viableClassObjectMapKeys[5], value)

                classMapHasChanged = true

                return classMapHasChanged
            }







        }




    }



    return classMapHasChanged


}


/* 
 
TODO: Find a way to fix the debugger.
 

*/

const startsWithArbitraryVariantAndTypeRE = /^(?<variant>\[&(?::{1,2})?[a-z]+(?:-[a-z]+)?(?:\(\d+\))?\]):(?<type>[a-z]+)/

const startsWithWordVariantAndTypeRE = /^(?<variant>(?::{1,2})?[a-z]+(?:-[a-z]+)?(?:\(\d+\))?):(?<type>[a-z]+)/


export const attemptToExchangeIdenticalKeysInClassMapBasedOnVariants: ClassMapChangerBasedOnClassName = (classMap, className) => {



    let classMapHasChanged = false

    const classNameTypeAndValueMatch = className.match(cssTypeAndValueUtilityClassRE)


    if (classNameTypeAndValueMatch) {

        const [type, value] = classNameTypeAndValueMatch


        if (!type || !value) return classMapHasChanged


        const typeStartsWithAnArbitraryVariantMatch = type.match(startsWithArbitraryVariantAndTypeRE)

        const typeStartsWithAWordVariantMatch = type.match(startsWithWordVariantAndTypeRE)


        if (typeStartsWithAnArbitraryVariantMatch) {


            const [variant, type] = typeStartsWithAnArbitraryVariantMatch


            if (!variant || !type) return classMapHasChanged

            const stringMadeFromVariantAndTypeFromArbitraryVariantMatch = `${variant}${type}`

            const wordVariantVersionOfTheString = stringMadeFromVariantAndTypeFromArbitraryVariantMatch
                .replace(/\[\]\&/g, "")

            const classMapHasTheTypeAsAKey = classMap.has(wordVariantVersionOfTheString)


            const classMapHasMatchedVariantAndTypeAsTheKey = classMap.has(stringMadeFromVariantAndTypeFromArbitraryVariantMatch)


            if (classMapHasTheTypeAsAKey && classMapHasMatchedVariantAndTypeAsTheKey) {



                const valueFromClassMapUsingClassType = classMap.get(wordVariantVersionOfTheString)

                const valueFromClassMapUsingClassVariantAndType = classMap.get(stringMadeFromVariantAndTypeFromArbitraryVariantMatch)

                const valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap =
                    valueFromClassMapUsingClassType instanceof Map
                    && valueFromClassMapUsingClassVariantAndType instanceof Map

                if (valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {


                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[0])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[1])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {
                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[2])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[3])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[4])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[5])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }




                return classMapHasChanged


            }



            if (classMapHasMatchedVariantAndTypeAsTheKey) {


                const valueFromClassMapUsingClassType = classMap.get(stringMadeFromVariantAndTypeFromArbitraryVariantMatch)

                const valueFromClassMapUsingClassTypeIsAMap = valueFromClassMapUsingClassType instanceof Map

                if (valueFromClassMapUsingClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {



                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }


                return classMapHasChanged


            }



        }


        if (typeStartsWithAWordVariantMatch) {


            const [variant, type] = typeStartsWithAWordVariantMatch


            if (!variant || !type) return classMapHasChanged

            const stringMadeFromVariantAndTypeFromWordVariantMatch = `${variant}:${type}`

            const arbitraryVariantVersionOfTheString = `[&${variant}]:${type}`

            const classMapHasTheTypeAsAKey = classMap.has(arbitraryVariantVersionOfTheString)


            const classMapHasMatchedVariantAndTypeAsTheKey = classMap.has(stringMadeFromVariantAndTypeFromWordVariantMatch)


            if (classMapHasTheTypeAsAKey && classMapHasMatchedVariantAndTypeAsTheKey) {



                const valueFromClassMapUsingClassType = classMap.get(arbitraryVariantVersionOfTheString)

                const valueFromClassMapUsingClassVariantAndType = classMap.get(stringMadeFromVariantAndTypeFromWordVariantMatch)

                const valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap =
                    valueFromClassMapUsingClassType instanceof Map
                    && valueFromClassMapUsingClassVariantAndType instanceof Map

                if (valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {


                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[0])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[1])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {
                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[2])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[3])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[4])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[5])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }




                return classMapHasChanged


            }



            if (classMapHasMatchedVariantAndTypeAsTheKey) {


                const valueFromClassMapUsingClassType = classMap.get(stringMadeFromVariantAndTypeFromWordVariantMatch)

                const valueFromClassMapUsingClassTypeIsAMap = valueFromClassMapUsingClassType instanceof Map

                if (valueFromClassMapUsingClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {



                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }


                return classMapHasChanged


            }



        }



    }


    const classNameTypeSubTypeAndValueMatch = className.match(cssTypeSubTypeAndValueUtilityClassRE)


    if (classNameTypeSubTypeAndValueMatch) {

        const [type, subType, value] = classNameTypeSubTypeAndValueMatch

        if (!type || !subType || !value) return classMapHasChanged

        const fullType = `${type}-${subType}`

        const typeStartsWithAnArbitraryVariantMatch = fullType.match(startsWithArbitraryVariantAndTypeRE)

        const typeStartsWithAWordVariantMatch = fullType.match(startsWithWordVariantAndTypeRE)


        if (typeStartsWithAnArbitraryVariantMatch) {


            const [variant, type] = typeStartsWithAnArbitraryVariantMatch


            if (!variant || !type) return classMapHasChanged

            const stringMadeFromVariantAndTypeFromArbitraryVariantMatch = `${variant}${type}`

            const wordVariantVersionOfTheString = stringMadeFromVariantAndTypeFromArbitraryVariantMatch
                .replace(/\[\]\&/g, "")

            const classMapHasTheTypeAsAKey = classMap.has(wordVariantVersionOfTheString)


            const classMapHasMatchedVariantAndTypeAsTheKey = classMap.has(stringMadeFromVariantAndTypeFromArbitraryVariantMatch)


            if (classMapHasTheTypeAsAKey && classMapHasMatchedVariantAndTypeAsTheKey) {



                const valueFromClassMapUsingClassType = classMap.get(wordVariantVersionOfTheString)

                const valueFromClassMapUsingClassVariantAndType = classMap.get(stringMadeFromVariantAndTypeFromArbitraryVariantMatch)

                const valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap =
                    valueFromClassMapUsingClassType instanceof Map
                    && valueFromClassMapUsingClassVariantAndType instanceof Map

                if (valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {


                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[0])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[1])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {
                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[2])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[3])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[4])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[5])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }




                return classMapHasChanged


            }



            if (classMapHasMatchedVariantAndTypeAsTheKey) {


                const valueFromClassMapUsingClassType = classMap.get(stringMadeFromVariantAndTypeFromArbitraryVariantMatch)

                const valueFromClassMapUsingClassTypeIsAMap = valueFromClassMapUsingClassType instanceof Map

                if (valueFromClassMapUsingClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {



                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }


                return classMapHasChanged


            }



        }


        if (typeStartsWithAWordVariantMatch) {


            const [variant, type] = typeStartsWithAWordVariantMatch


            if (!variant || !type) return classMapHasChanged

            const stringMadeFromVariantAndTypeFromWordVariantMatch = `${variant}:${type}`

            const arbitraryVariantVersionOfTheString = `[&${variant}]:${type}`

            const classMapHasTheTypeAsAKey = classMap.has(arbitraryVariantVersionOfTheString)


            const classMapHasMatchedVariantAndTypeAsTheKey = classMap.has(stringMadeFromVariantAndTypeFromWordVariantMatch)


            if (classMapHasTheTypeAsAKey && classMapHasMatchedVariantAndTypeAsTheKey) {



                const valueFromClassMapUsingClassType = classMap.get(arbitraryVariantVersionOfTheString)

                const valueFromClassMapUsingClassVariantAndType = classMap.get(stringMadeFromVariantAndTypeFromWordVariantMatch)

                const valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap =
                    valueFromClassMapUsingClassType instanceof Map
                    && valueFromClassMapUsingClassVariantAndType instanceof Map

                if (valueFromClassMapUsingClassTypeAndValueFromUsingMatchedVariantAndClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {


                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[0])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[1])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {
                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[2])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[3])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[4])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {

                        valueFromClassMapUsingClassVariantAndType.delete(viableClassObjectMapKeys[5])

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }




                return classMapHasChanged


            }



            if (classMapHasMatchedVariantAndTypeAsTheKey) {


                const valueFromClassMapUsingClassType = classMap.get(stringMadeFromVariantAndTypeFromWordVariantMatch)

                const valueFromClassMapUsingClassTypeIsAMap = valueFromClassMapUsingClassType instanceof Map

                if (valueFromClassMapUsingClassTypeIsAMap) {


                    if (checkIfStringIsAProperDigit(value)) {



                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[0], value)


                        classMapHasChanged = true

                    }

                    if (checkIfStringIsALowerCaseWord(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[1], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperColor(value)) {

                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[2], value)

                    }

                    if (checkIfStringIsACssVariableWithAnOptionalHint(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[3], value)

                        classMapHasChanged = true
                    }

                    if (checkIfStringIsAProperCSSNormalFunction(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[4], value)

                        classMapHasChanged = true
                    }


                    if (checkIfStringIsASetOfArgs(value)) {


                        valueFromClassMapUsingClassType.set(viableClassObjectMapKeys[5], value)


                        classMapHasChanged = true
                    }




                }


                return classMapHasChanged


            }



        }



    }




    return classMapHasChanged


};


export const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged = (
    classTypeAndListObject: Record<string, Array<string>>,
    classNamesMap: ClassNamesMap,
    className: string
): ReturnType<ClassMapChangerBasedOnClassName> => {



    let classNamesMapHasChanged = false

    // TODO: All logic to handle modifiers 

    Object.entries(classTypeAndListObject).forEach(([classType, classList]) => {


        if (!classNamesMap.has(classType) && classList.includes(className)) {

            classNamesMap.set(classType, className)

            classNamesMapHasChanged = true

        }

        if (classList.includes(className) && classNamesMap.has(classType)) {

            classNamesMap.set(classType, className)

            classNamesMapHasChanged = true

        }



    })



    return classNamesMapHasChanged as boolean
}


const aBlockElementClassName =
    /^(?<lower_case_word>[a-z]+)__(?<element>[a-z]+)(?<modifier>--[a-z0-9]+)?$/

const aBlockModifierClassName =
    /^(?<lower_case_word>[a-z]+)--(?<modifier>[a-z0-9]+)$/


export const attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged: ClassMapChangerBasedOnClassName = (classNamesMap, className) => {


    const blockAndElementClassNameMatch = className.match(aBlockElementClassName)

    const blockAndModifierClassNameMatch = className.match(aBlockModifierClassName)



    let classMapHasChanged = false

    if (blockAndElementClassNameMatch) {

        const [
            ,
            lowerCaseWord,
            element,
            modifier
        ] = blockAndElementClassNameMatch

        if (!lowerCaseWord || !element) return classMapHasChanged


        if (!classNamesMap.has(lowerCaseWord)) {

            classNamesMap.set(lowerCaseWord, `${element}${modifier ?? ''}`)

        }

        classNamesMap.set(lowerCaseWord, element)

        classMapHasChanged = true


    }

    if (blockAndModifierClassNameMatch) {

        const [
            ,
            lowerCaseWord,
            modifier
        ] = blockAndModifierClassNameMatch

        if (!lowerCaseWord || !modifier) return classMapHasChanged


        if (!classNamesMap.has(lowerCaseWord)) {

            classNamesMap.set(lowerCaseWord, modifier)

        }

        classNamesMap.set(lowerCaseWord, modifier)


        classMapHasChanged = true


    }


    return classMapHasChanged


}

