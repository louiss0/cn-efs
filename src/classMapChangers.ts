

const cssVariableWithOptionalPrefixedHintRE =
    /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)

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


const cssNormalFunctionRE = /^(?<css_function>[a-z_-]{3,15}\(([a-z0-9%!\(\).\/-]+(?:_|,)?)+\))$/

const checkIfStringIsAProperCSSNormalFunction = (string: string) =>
    cssNormalFunctionRE.test(string) && !cssColorFunctionRE.test(string)

const arbitraryValueRE = /^\[(?<value>[a-z,0-9_\-)%!\/($.:]+)\]$/

const lowerCaseWordRE = /^(?<lower_case_word>[a-z]+)$/


const checkIfStringIsALowerCaseWord = (string: string) => lowerCaseWordRE.test(string)

const cssTwoOrMoreArgsRE = /([a-z0-9\-)(\/,.]+)(?:_[a-z0-9\/),(.\-]+)+/

const checkIfStringIsASetOfArgs = (string: string) => cssTwoOrMoreArgsRE.test(string)




export const viableClassObjectMapKeys = ["digit", "word", "color", "variable", "function", "args"] as const

export type ViableClassObjectMapKeys = typeof viableClassObjectMapKeys[number]

export type ClassValueTypeAndValueMap = Map<ViableClassObjectMapKeys, string | undefined>

export type ClassNamesMap = Map<string, string | ClassValueTypeAndValueMap | undefined>

type ClassMapChangerBasedOnClassName = (classNamesMap: ClassNamesMap, className: string) => void


export const attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged: ClassMapChangerBasedOnClassName = (classNamesMap, className) => {



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

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[0], value]]))



                return

            }


            if (valueIsAViableWord) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[1], value]]))



                return
            }

            if (valueIsAViableColor) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[2], value]]))



                return
            }

            if (arbitraryValueIsAViableNonColorFunction) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[4], value]]))



                return
            }


            if (arbitraryValueIsAViableCSSVariable) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[3], value]]))



                return
            }


            if (arbitraryValueIsASetOfArgs) {

                classNamesMap.set(type, new Map([[viableClassObjectMapKeys[5], value]]))



                return
            }




        }



        const result = classNamesMap.get(type)


        if (result && typeof result !== "string") {


            if (valueIsAViableDigit) {

                result.set(viableClassObjectMapKeys[0], value)



                return
            }


            if (valueIsAViableWord) {

                result.set(viableClassObjectMapKeys[1], value)



                return

            }

            if (valueIsAViableColor) {

                result.set(viableClassObjectMapKeys[2], value)



                return
            }

            if (arbitraryValueIsAViableNonColorFunction) {

                result.set(viableClassObjectMapKeys[4], value)



                return
            }

            if (arbitraryValueIsAViableCSSVariable) {

                result.set(viableClassObjectMapKeys[3], value)



                return
            }

            if (arbitraryValueIsASetOfArgs) {

                result.set(viableClassObjectMapKeys[5], value)



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

        if (!classNamesMap.has(fullClassType)) {



            if (valueIsAViableColor) {

                classNamesMap.set(`${type}`, new Map([[viableClassObjectMapKeys[2], `${subType}-${value}`]]))



                return
            }


            if (valueIsAViableDigit) {

                classNamesMap.set(fullClassType, new Map([[viableClassObjectMapKeys[0], value]]))



                return

            }



            if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                classNamesMap.set(fullClassType, new Map([[viableClassObjectMapKeys[1], value]]))



                return
            }

            if (valueIsAViableFunction) {

                classNamesMap.set(fullClassType, new Map([[viableClassObjectMapKeys[4], value]]))



                return
            }


            if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                classNamesMap.set(fullClassType, new Map([[viableClassObjectMapKeys[3], value]]))



                return
            }

            if (arbitraryValueMatchSecondValueIsASetOfArgs) {

                classNamesMap.set(fullClassType, new Map([[viableClassObjectMapKeys[5], value]]))



                return
            }







        }



        const result = classNamesMap.get(type) || classNamesMap.get(`${type}-${subType}`)


        if (result && typeof result !== "string") {


            if (valueIsAViableColor) {

                result.set(viableClassObjectMapKeys[2], `${subType}-${value}`)



                return
            }

            if (valueIsAViableDigit) {

                result.set(viableClassObjectMapKeys[0], value)



                return
            }



            if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                result.set(viableClassObjectMapKeys[1], value)



                return

            }

            if (valueIsAViableFunction) {

                classNamesMap.set(viableClassObjectMapKeys[4], value)



                return
            }

            if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                result.set(viableClassObjectMapKeys[3], value)



                return
            }

            if (arbitraryValueMatchSecondValueIsASetOfArgs) {

                result.set(viableClassObjectMapKeys[5], value)



                return
            }







        }




    }



    return


}





export const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged = (
    classTypeAndListObject: Record<string, Array<string>>,
    classNamesMap: ClassNamesMap,
    className: string
): ReturnType<ClassMapChangerBasedOnClassName> => {




    // TODO: All logic to handle modifiers 

    Object.entries(classTypeAndListObject).forEach(([classType, classList]) => {


        if (!classNamesMap.has(classType) && classList.includes(className)) {

            classNamesMap.set(classType, className)



        }

        if (classList.includes(className) && classNamesMap.has(classType)) {

            classNamesMap.set(classType, className)



        }



    })



    return
}


const aBlockElementClassName =
    /^(?<lower_case_word>[a-z]+)__(?<element>[a-z]+)(?<modifier>--[a-z0-9]+)?$/

const aBlockModifierClassName =
    /^(?<lower_case_word>[a-z]+)--(?<modifier>[a-z0-9]+)$/


export const attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged: ClassMapChangerBasedOnClassName = (classNamesMap, className) => {


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

            classNamesMap.set(lowerCaseWord, `${element}${modifier ?? ''}`)

        }

        classNamesMap.set(lowerCaseWord, element)




    }

    if (blockAndModifierClassNameMatch) {

        const [
            ,
            lowerCaseWord,
            modifier
        ] = blockAndModifierClassNameMatch

        if (!lowerCaseWord || !modifier) return


        if (!classNamesMap.has(lowerCaseWord)) {

            classNamesMap.set(lowerCaseWord, modifier)

        }

        classNamesMap.set(lowerCaseWord, modifier)





    }




}

const arbitraryPropertyRE =
    /(?<modifier>(?:(?:(?:[\&:{1,2}[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?)\]|[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?):)*)\[(?<property_key>[a-z]+(?:\-[a-z]+)*:)(?<property_value>[_\-),.\/(a-z0-9]+)\]/


export const attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty: ClassMapChangerBasedOnClassName = (classMap, className) => {


    const arbitraryPropertyKeyAndValueMatch = arbitraryPropertyRE.exec(className)

    if (!arbitraryPropertyKeyAndValueMatch) return


    const [, modifier, propertyKey, propertyValue] = arbitraryPropertyKeyAndValueMatch


    if (!propertyKey || !propertyValue) return


    if (modifier) {

        classMap.set(`${modifier}${propertyKey}`, propertyValue)

        return
    }




    classMap.set(propertyKey, propertyValue)




}


