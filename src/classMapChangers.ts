

const cssVariableWithOptionalPrefixedHintRE =
    /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)

const cssTypeAndValueUtilityClassRE = /^(?<type>[a-z\][#&!:]+)-(?<value>[\w\][$.#),\/\-(%:]+)$/

const cssTypeSubTypeAndValueUtilityClassRE = /^(?<type>[a-z\][#&!:]+)-(?<sub_type>[a-z]+)-(?<value>[\w\][$.#),\-(%:]+)$/

const properCSSDigitRE = /^(?<digit>\d{1,4}(?:[a-z]{2,4})?)$/

const checkIfStringIsAProperDigit = (string: string) => properCSSDigitRE.test(string)


const colorRangeRE = /(?<color>[a-z]+)-(?<range>[1-9]00|9?50)/

const hexColorRE = /^(?<hex_color>#[A-Fa-f0-9]{3,6})$/

const cssColorFunctionRE = /(?<css_color_function>[a-z]{3,9}\((?:\d{1,4}(?:%|[a-z]{3,4}|\.\d+)?(?:,|_)?){3,4}\))/

const utilityClassVariantAndSelfRE = /(?<variant>[a-z0-9)\-(\]\[&,]+:)?(?<class_type_and_value>[a-z0-9\-_\]\[,)(%#!]+)/

const checkIfStringIsAProperColor = (string: string) =>
    colorRangeRE.test(string)
    || hexColorRE.test(string)
    || cssColorFunctionRE.test(string)


const cssNormalFunctionRE = /^(?<css_function>[a-z_-]{3,15}\(([a-z0-9%!\(\).\/-]+(?:_|,)?)+\))$/

const checkIfStringIsAProperCSSNormalFunction = (string: string) =>
    cssNormalFunctionRE.test(string) && !cssColorFunctionRE.test(string)

const arbitraryValueRE = /^\[(?<value>[\w\-),%!\/($.:#]+)\]$/

const lowerCaseWordRE = /^(?<lower_case_word>[a-z]+)$/


const checkIfStringIsALowerCaseWord = (string: string) => lowerCaseWordRE.test(string)

const cssTwoOrMoreArgsRE = /([a-z0-9\-)(\/,.]+)(?:_[a-z0-9\/),(.\-]+)+/

const checkIfStringIsASetOfArgs = (string: string) => cssTwoOrMoreArgsRE.test(string)



export const viableUtilityClassMapKeys = ["digit", "word", "color", "variable", "function", "args"] as const

export const viableBEMClassMapKeys = ["element", "modifier"] as const

export type ViableUtilityClassMapKeys = typeof viableUtilityClassMapKeys[number]


type ViableBemClassMapKeys = typeof viableBEMClassMapKeys[number]


type StringOrOmitFromString<T extends string> = T | Omit<string, T>


export class SortedClasses {

    public readonly bem = new Map<string, Map<ViableBemClassMapKeys, string | undefined> | undefined>();

    public readonly arbitraryProperties = new Map<string, Map<StringOrOmitFromString<"base">, string | undefined> | undefined>();

    public readonly utility = new Map<string, Map<ViableUtilityClassMapKeys, string | undefined> | undefined>();

    public readonly customFiltered = new Map<string, Map<StringOrOmitFromString<"base">, string | undefined> | undefined>();
}








type ClassMapChangerBasedOnClassName<T extends Map<string, Map<string | Omit<string, string>, string | undefined> | undefined>> =
    (classNamesMap: T, className: string) => void


export const attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged:
    ClassMapChangerBasedOnClassName<SortedClasses["utility"]> = (classNamesMap, className) => {



        const cssTypeValueUtilityClassMatch = className.match(cssTypeAndValueUtilityClassRE)



        if (cssTypeValueUtilityClassMatch) {

            const [, type, value] = cssTypeValueUtilityClassMatch


            if (!type || !value) return



            const arbitraryValueMatchSecondValue = value.match(arbitraryValueRE)?.[1]

            const arbitraryValueMatchSecondValueBoolValue = !!arbitraryValueMatchSecondValue

            const valueIsAViableDigit = checkIfStringIsAProperDigit(value)
                || arbitraryValueMatchSecondValue && checkIfStringIsAProperDigit(arbitraryValueMatchSecondValue)


            const valueIsAViableWord = checkIfStringIsALowerCaseWord(value)
                || arbitraryValueMatchSecondValueBoolValue && checkIfStringIsALowerCaseWord(arbitraryValueMatchSecondValue)

            const arbitraryValueIsAViableNonColorFunction = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsAProperCSSNormalFunction(arbitraryValueMatchSecondValue)

            const arbitraryValueIsASetOfArgs = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsASetOfArgs(arbitraryValueMatchSecondValue)

            const arbitraryValueIsAViableCSSVariable = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsACssVariableWithAnOptionalHint(arbitraryValueMatchSecondValue)

            const valueIsAViableColor = arbitraryValueMatchSecondValue
                && checkIfStringIsAProperColor(arbitraryValueMatchSecondValue)




            if (!classNamesMap.has(type)) {


                if (valueIsAViableDigit) {

                    classNamesMap.set(type, new Map([[viableUtilityClassMapKeys[0], value]]))



                    return

                }


                if (valueIsAViableWord) {

                    classNamesMap.set(type, new Map([[viableUtilityClassMapKeys[1], value]]))



                    return
                }

                if (valueIsAViableColor) {

                    classNamesMap.set(type, new Map([[viableUtilityClassMapKeys[2], value]]))



                    return
                }

                if (arbitraryValueIsAViableNonColorFunction) {

                    classNamesMap.set(type, new Map([[viableUtilityClassMapKeys[4], value]]))



                    return
                }


                if (arbitraryValueIsAViableCSSVariable) {

                    classNamesMap.set(type, new Map([[viableUtilityClassMapKeys[3], value]]))



                    return
                }


                if (arbitraryValueIsASetOfArgs) {

                    classNamesMap.set(type, new Map([[viableUtilityClassMapKeys[5], value]]))



                    return
                }




            }



            const result = classNamesMap.get(type)



            if (result) {


                if (valueIsAViableDigit) {

                    result.set(viableUtilityClassMapKeys[0], value)



                    return
                }


                if (valueIsAViableWord) {

                    result.set(viableUtilityClassMapKeys[1], value)



                    return

                }

                if (valueIsAViableColor) {

                    result.set(viableUtilityClassMapKeys[2], value)



                    return
                }

                if (arbitraryValueIsAViableNonColorFunction) {

                    result.set(viableUtilityClassMapKeys[4], value)



                    return
                }

                if (arbitraryValueIsAViableCSSVariable) {

                    result.set(viableUtilityClassMapKeys[3], value)



                    return
                }

                if (arbitraryValueIsASetOfArgs) {

                    result.set(viableUtilityClassMapKeys[5], value)



                    return
                }






            }

        }




        const cssTypeSubTypeAndValueUtilityClassMatch = className.match(cssTypeSubTypeAndValueUtilityClassRE)




        if (cssTypeSubTypeAndValueUtilityClassMatch) {


            const [, type, subType, value] = cssTypeSubTypeAndValueUtilityClassMatch


            if (!type || !subType || !value) return


            const arbitraryValueMatch = value.match(arbitraryValueRE)

            const arbitraryValueMatchSecondValue = arbitraryValueMatch?.[1]

            const arbitraryValueMatchSecondValueBoolValue = !!arbitraryValueMatchSecondValue

            const valueIsAViableDigit = checkIfStringIsAProperDigit(value)
                || arbitraryValueMatchSecondValueBoolValue && checkIfStringIsAProperDigit(arbitraryValueMatchSecondValue)


            const valueIsAViableFunction = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsAProperCSSNormalFunction(arbitraryValueMatchSecondValue)


            const valueIsAViableColor = colorRangeRE.test(`${subType}-${value}`)


            const valueOrArbitraryValueMatchSecondValueIsAViableWord = lowerCaseWordRE.test(value)
                || arbitraryValueMatchSecondValueBoolValue && lowerCaseWordRE.test(arbitraryValueMatchSecondValue)

            const arbitraryValueMatchSecondValueIsASetOfArgs = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsASetOfArgs(arbitraryValueMatchSecondValue)


            const arbitraryValueMatchSecondValueIsAViableCSSVariable =
                arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsACssVariableWithAnOptionalHint(arbitraryValueMatchSecondValue)


            const fullClassType = `${type}-${subType}`


            const getCurrentClassNameMap = classNamesMap.has(type) || classNamesMap.has(fullClassType)


            if (!getCurrentClassNameMap) {



                if (valueIsAViableColor) {

                    classNamesMap.set(`${type}`, new Map([[viableUtilityClassMapKeys[2], `${subType}-${value}`]]))



                    return
                }


                if (valueIsAViableDigit) {

                    classNamesMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[0], value]]))



                    return

                }



                if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                    classNamesMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[1], value]]))



                    return
                }

                if (valueIsAViableFunction) {

                    classNamesMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[4], value]]))



                    return
                }


                if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                    classNamesMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[3], value]]))



                    return
                }

                if (arbitraryValueMatchSecondValueIsASetOfArgs) {

                    classNamesMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[5], value]]))



                    return
                }







            }



            const result = classNamesMap.get(type) || classNamesMap.get(`${type}-${subType}`)


            if (result) {


                if (valueIsAViableColor) {

                    result.set(viableUtilityClassMapKeys[2], `${subType}-${value}`)



                    return
                }

                if (valueIsAViableDigit) {

                    result.set(viableUtilityClassMapKeys[0], value)



                    return
                }



                if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                    result.set(viableUtilityClassMapKeys[1], value)

                    return

                }

                if (valueIsAViableFunction) {

                    result.set(viableUtilityClassMapKeys[4], value)

                    return
                }

                if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                    result.set(viableUtilityClassMapKeys[3], value)

                    return
                }

                if (arbitraryValueMatchSecondValueIsASetOfArgs) {

                    result.set(viableUtilityClassMapKeys[5], value)



                    return
                }







            }




        }





    }





export const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged = (
    classTypeAndListObject: Record<string, Array<string>>,
    classNamesMap: SortedClasses["customFiltered"],
    className: string
): void => {


    Object.entries(classTypeAndListObject).forEach(([classType, classList]) => {




        const utilityClassVariantAndSelfMatch = utilityClassVariantAndSelfRE.exec(className)





        if (!utilityClassVariantAndSelfMatch) return


        const [, variant = "base", classTypeAndValue] = utilityClassVariantAndSelfMatch



        if (!classTypeAndValue) return

        if (!classNamesMap.has(classType) && classList.includes(classTypeAndValue)) {

            classNamesMap.set(
                classType,
                new Map([
                    [variant, classTypeAndValue],

                ])
            )

            return
        }



        classNamesMap
            .get(classType,)
            ?.set(variant, classTypeAndValue)






    })


}


const aBlockElementClassName =
    /^(?<lower_case_word>[a-z]+)(?<element>__[a-z]+)(?<modifier>--[a-z0-9]+)?$/

const aBlockModifierClassName =
    /^(?<lower_case_word>[a-z]+)(?<modifier>--[a-z0-9]+)$/


export const attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged: ClassMapChangerBasedOnClassName<SortedClasses["bem"]> =
    (classNamesMap, className) => {


        const blockAndElementClassNameMatch = className.match(aBlockElementClassName)

        const blockAndModifierClassNameMatch = className.match(aBlockModifierClassName)



        if (blockAndElementClassNameMatch) {

            const [
                ,
                lowerCaseWord,
                element,
                modifier
            ] = blockAndElementClassNameMatch

            if (!lowerCaseWord || !element) return


            if (!classNamesMap.has(lowerCaseWord)) {

                classNamesMap.set(
                    lowerCaseWord,
                    new Map([
                        ["element", element],
                        ["modifier", modifier],
                    ])
                )

            }

            classNamesMap.get(lowerCaseWord)
                ?.set("element", element)
                .set("modifier", modifier)




        }

        if (blockAndModifierClassNameMatch) {

            const [
                ,
                lowerCaseWord,
                modifier
            ] = blockAndModifierClassNameMatch

            if (!lowerCaseWord || !modifier) return


            if (!classNamesMap.has(lowerCaseWord)) {

                classNamesMap.set(lowerCaseWord, new Map([["modifier", modifier]]))

            }

            classNamesMap.get(lowerCaseWord)?.set("modifier", modifier)





        }




    }

const arbitraryPropertyRE =
    /(?<variant>(?:(?:(?:[\&:{1,2}[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?)\]|[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?):)*)?\[(?<property_key>[a-z]+(?:\-[a-z]+)*:)(?<property_value>[_\-),.\/(a-z0-9]+)\]/


export const attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty: ClassMapChangerBasedOnClassName<SortedClasses["arbitraryProperties"]> = (classMap, className) => {


    const arbitraryPropertyKeyAndValueMatch = arbitraryPropertyRE.exec(className)

    if (!arbitraryPropertyKeyAndValueMatch) return


    const [,
        variant = "base",
        propertyKey,
        propertyValue
    ] = arbitraryPropertyKeyAndValueMatch



    if (!propertyKey || !propertyValue) return


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

        return

    }


    classMap.get(propertyKey)?.set(variant, propertyValue)






}


