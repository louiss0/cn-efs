import type { FilterMap } from "./classFilterMaps"


const cssVariableWithOptionalPrefixedHintRE =
    /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)

const cssTypeAndValueUtilityClassRE = /^(?<type>[a-z\][#&!:]+-)(?<value>[\w\][$.#),\/\-(%:]+)$/

const cssTypeSubTypeAndValueUtilityClassRE = /^(?<type>[a-z\][#&!:]+-)(?<sub_type>[a-z]+-)(?<value>[\w\][$.#),\-(%:]+)$/

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








type ClassMapChangerBasedOnClassName<T extends Map<string, Map<string | Omit<string, string>, string | undefined> | undefined>, U = undefined>
    = U extends undefined ? (classMap: T, className: string,) => void : (classMap: T, className: string, data: U) => void


export const attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValue:
    ClassMapChangerBasedOnClassName<SortedClasses["utility"]> = (classMap, className) => {



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




            if (!classMap.has(type)) {


                if (valueIsAViableDigit) {

                    classMap.set(type, new Map([[viableUtilityClassMapKeys[0], value]]))



                    return

                }


                if (valueIsAViableWord) {

                    classMap.set(type, new Map([[viableUtilityClassMapKeys[1], value]]))



                    return
                }

                if (valueIsAViableColor) {

                    classMap.set(type, new Map([[viableUtilityClassMapKeys[2], value]]))



                    return
                }

                if (arbitraryValueIsAViableNonColorFunction) {

                    classMap.set(type, new Map([[viableUtilityClassMapKeys[4], value]]))



                    return
                }


                if (arbitraryValueIsAViableCSSVariable) {

                    classMap.set(type, new Map([[viableUtilityClassMapKeys[3], value]]))



                    return
                }


                if (arbitraryValueIsASetOfArgs) {

                    classMap.set(type, new Map([[viableUtilityClassMapKeys[5], value]]))



                    return
                }




            }



            const result = classMap.get(type)



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


            const potentialColorRange = `${subType}${value}`

            const valueIsAViableColor = colorRangeRE.test(potentialColorRange)


            const valueOrArbitraryValueMatchSecondValueIsAViableWord = lowerCaseWordRE.test(value)
                || arbitraryValueMatchSecondValueBoolValue && lowerCaseWordRE.test(arbitraryValueMatchSecondValue)

            const arbitraryValueMatchSecondValueIsASetOfArgs = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsASetOfArgs(arbitraryValueMatchSecondValue)


            const arbitraryValueMatchSecondValueIsAViableCSSVariable =
                arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsACssVariableWithAnOptionalHint(arbitraryValueMatchSecondValue)


            const fullClassType = `${type}${subType}`


            const getCurrentClassNameMap = classMap.has(type) || classMap.has(fullClassType)


            if (!getCurrentClassNameMap) {



                if (valueIsAViableColor) {

                    classMap.set(`${type}`, new Map([[viableUtilityClassMapKeys[2], potentialColorRange]]))



                    return
                }


                if (valueIsAViableDigit) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[0], value]]))



                    return

                }



                if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[1], value]]))



                    return
                }

                if (valueIsAViableFunction) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[4], value]]))



                    return
                }


                if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[3], value]]))



                    return
                }

                if (arbitraryValueMatchSecondValueIsASetOfArgs) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[5], value]]))



                    return
                }







            }



            const result = classMap.get(type) || classMap.get(`${type}${subType}`)


            if (result) {


                if (valueIsAViableColor) {

                    result.set(viableUtilityClassMapKeys[2], `${subType}${value}`)



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





type TypeAndListClassMapChanger = ClassMapChangerBasedOnClassName<SortedClasses["customFiltered"], Record<string, Array<string>>>

export const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject: TypeAndListClassMapChanger = (classMap, className, classTypeAndListObject) => {


    Object.entries(classTypeAndListObject).forEach(([classType, classList]) => {



        const utilityClassVariantAndSelfMatch = utilityClassVariantAndSelfRE.exec(className)


        if (!utilityClassVariantAndSelfMatch) return


        const [, variant = "base", classTypeAndValue] = utilityClassVariantAndSelfMatch




        if (!classTypeAndValue) return

        if (!classMap.has(classType) && classList.includes(classTypeAndValue)) {

            classMap.set(
                classType,
                new Map([
                    [variant,
                        classTypeAndValue
                    ],
                ])
            )

            return
        }


        if (classList.includes(classTypeAndValue)) {


            classMap.get(classType,)
                ?.set(variant, classTypeAndValue)


        }








    })


}




const aBlockElementClassName =
    /^(?<lower_case_word>[a-z]+)(?<element>__[a-z]+(?:--[a-z0-9]+)?)$/

const aBlockModifierClassName =
    /^(?<lower_case_word>[a-z]+)(?<modifier>--[a-z0-9]+)$/


export const attemptToChangeClassNameMapAccordingToIfTheBEMConvention: ClassMapChangerBasedOnClassName<
    SortedClasses["bem"],
    Array<string>
> =
    (classMap, className, classNames) => {


        const blockAndElementClassNameMatch = className.match(aBlockElementClassName)

        const blockAndModifierClassNameMatch = className.match(aBlockModifierClassName)



        if (blockAndElementClassNameMatch) {

            const [
                ,
                lowerCaseWord,
                element,
            ] = blockAndElementClassNameMatch

            if (!lowerCaseWord || !element) return


            if (!classMap.has(lowerCaseWord)) {

                classMap.set(
                    lowerCaseWord,
                    new Map([
                        ["element", element],

                    ])
                )

                return

            }

            classMap.get(lowerCaseWord)
                ?.set("element", element)



        }

        if (blockAndModifierClassNameMatch) {

            const [
                ,
                lowerCaseWord,
                modifier
            ] = blockAndModifierClassNameMatch

            if (!lowerCaseWord || !modifier) return


            if (!classNames.includes(lowerCaseWord)) {

                throw new Error(
                    `To have a modifier you must have the block ${lowerCaseWord} in the list of classes already.
                    Please put the block as the class that requires the use of the modifier.`
                )

            }


            if (!classMap.has(lowerCaseWord)) {

                classMap.set(lowerCaseWord, new Map([["modifier", modifier]]))

                return

            }

            classMap.get(lowerCaseWord)?.set("modifier", modifier)





        }




    }

const arbitraryPropertyRE =
    /(?<variant>(?:(?:(?:[\&:{1,2}[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?)\]|[a-z0-9\-]+(?:\([a-z0-9\+\-\_]+\))?):)*)?\[(?<property_key>[a-z]+(?:\-[a-z]+)*:)(?<property_value>[_\-),.\/(a-z0-9]+)\]/


export const attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty: ClassMapChangerBasedOnClassName<SortedClasses["arbitraryProperties"]> =
    (classMap, className) => {


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

const relationClassUtilityRE = /^(?<relationship>@?[a-z-]+\/)(?<name>[a-z]+)$/


const relationalTypeAndValueUtilityClassRE =
    /^(?<variant_and_group_name>@?[a-z0-9\]\[&\-\.#@+),\/(:]+(?:\/[a-z]+):)(?<type>[a-z#&!]+-)(?<value>[\w\][$.#),\-(%:]+)$/

const arbitraryRelationalTypeAndValueUtilityClassRE =
    /^(?<group_name_and_variants>@?[a-z0-9\]\[&\-\.#@+),\/(:]+-\[[\.a-z\-_]+\]:(?:[a-z-]+:)*)(?<type>[a-z#&!]+-)(?<value>[\w\][$.#),\-(%:]+)$/

const relationalTypeSubTypeAndValueUtilityClassRE =
    /^(?<variant_and_group_name>@?[a-z0-9\]\[&\-\.#@+),\/(:]+(?:\/[a-z]+):)(?<type>[a-z#&!]+-)(?<sub_type>[a-z]+-)(?<value>[\w\][$.#),\-(%:]+)$/

const arbitraryRelationalTypeSubTypeAndValueUtilityClassRE =
    /^(?<group_name_and_variants>@?[a-z0-9\]\[&\-\.#@+),\/(:]+-\[[\.a-z\-_]+\]:(?:[a-z-]+:)*)(?<type>[a-z#&!]+-)(?<sub_type>[a-z]+-)(?<value>[\w\][$.#),\-(%:]+)$/




export const attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass: ClassMapChangerBasedOnClassName<SortedClasses["utility"]> =
    (classMap, className) => {






        const relationClassUtilityMatch = className.match(relationClassUtilityRE)




        if (relationClassUtilityMatch) {

            const [, relationship, name] = relationClassUtilityMatch;


            if (!relationship || !name) return

            if (!classMap.has(relationship)) {

                classMap.set(relationship, new Map([["word", name]]))

                return
            }

            classMap.get(relationship)?.set("word", name)


        }



        const cssTypeValueUtilityClassMatch = className.match(relationalTypeAndValueUtilityClassRE)
            || className.match(arbitraryRelationalTypeAndValueUtilityClassRE)




        if (cssTypeValueUtilityClassMatch) {

            const [, variant, type, value] = cssTypeValueUtilityClassMatch


            if (!variant || !type || !value) return




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




            if (!classMap.has(type)) {


                if (valueIsAViableDigit) {

                    classMap.set(`${variant}${type}`, new Map([[viableUtilityClassMapKeys[0], value]]))



                    return

                }


                if (valueIsAViableWord) {

                    classMap.set(`${variant}${type}`, new Map([[viableUtilityClassMapKeys[1], value]]))



                    return
                }

                if (valueIsAViableColor) {

                    classMap.set(`${variant}${type}`, new Map([[viableUtilityClassMapKeys[2], value]]))



                    return
                }

                if (arbitraryValueIsAViableNonColorFunction) {

                    classMap.set(`${variant}${type}`, new Map([[viableUtilityClassMapKeys[4], value]]))



                    return
                }


                if (arbitraryValueIsAViableCSSVariable) {

                    classMap.set(`${variant}${type}`, new Map([[viableUtilityClassMapKeys[3], value]]))



                    return
                }


                if (arbitraryValueIsASetOfArgs) {

                    classMap.set(`${variant}${type}`, new Map([[viableUtilityClassMapKeys[5], value]]))



                    return
                }




            }



            const result = classMap.get(`${variant}${type}`)



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




        const cssTypeSubTypeAndValueUtilityClassMatch =
            className.match(relationalTypeSubTypeAndValueUtilityClassRE)
            || className.match(arbitraryRelationalTypeSubTypeAndValueUtilityClassRE)




        if (cssTypeSubTypeAndValueUtilityClassMatch) {


            const [, variant, type, subType, value] = cssTypeSubTypeAndValueUtilityClassMatch


            if (!variant || !type || !subType || !value) return


            const arbitraryValueMatch = value.match(arbitraryValueRE)

            const arbitraryValueMatchSecondValue = arbitraryValueMatch?.[1]

            const arbitraryValueMatchSecondValueBoolValue = !!arbitraryValueMatchSecondValue

            const valueIsAViableDigit = checkIfStringIsAProperDigit(value)
                || arbitraryValueMatchSecondValueBoolValue && checkIfStringIsAProperDigit(arbitraryValueMatchSecondValue)


            const valueIsAViableFunction = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsAProperCSSNormalFunction(arbitraryValueMatchSecondValue)


            const potentialColorRange = `${subType}${value}`

            const valueIsAViableColor = colorRangeRE.test(potentialColorRange)


            const valueOrArbitraryValueMatchSecondValueIsAViableWord = lowerCaseWordRE.test(value)
                || arbitraryValueMatchSecondValueBoolValue && lowerCaseWordRE.test(arbitraryValueMatchSecondValue)

            const arbitraryValueMatchSecondValueIsASetOfArgs = arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsASetOfArgs(arbitraryValueMatchSecondValue)


            const arbitraryValueMatchSecondValueIsAViableCSSVariable =
                arbitraryValueMatchSecondValueBoolValue
                && checkIfStringIsACssVariableWithAnOptionalHint(arbitraryValueMatchSecondValue)


            const partialClassType = `${variant}${type}`

            const fullClassType = `${variant}${type}${subType}`


            const getCurrentClassNameMap = classMap.has(partialClassType) || classMap.has(fullClassType)


            if (!getCurrentClassNameMap) {



                if (valueIsAViableColor) {

                    classMap.set(partialClassType, new Map([[viableUtilityClassMapKeys[2], potentialColorRange]]))



                    return
                }


                if (valueIsAViableDigit) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[0], value]]))



                    return

                }



                if (valueOrArbitraryValueMatchSecondValueIsAViableWord) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[1], value]]))



                    return
                }

                if (valueIsAViableFunction) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[4], value]]))



                    return
                }


                if (arbitraryValueMatchSecondValueIsAViableCSSVariable) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[3], value]]))



                    return
                }

                if (arbitraryValueMatchSecondValueIsASetOfArgs) {

                    classMap.set(fullClassType, new Map([[viableUtilityClassMapKeys[5], value]]))



                    return
                }







            }



            const result = classMap.get(type) || classMap.get(`${type}${subType}`)


            if (result) {


                if (valueIsAViableColor) {

                    result.set(viableUtilityClassMapKeys[2], `${subType}${value}`)



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


const variantGroupRE =
    /(?<variant>[a-z0-9\]\[&\-\.#@+),\/(:]+:)\((?<class_names>(?:[\w\-\]\[$.#),(%:\/]+)(?:\s[\w\-\]\[$.#)\/,(%:]+)+)\)/

type PropsNeededFromSortedClasses = {
    utility: SortedClasses["utility"]
    customFiltered: SortedClasses["customFiltered"]
    arbitraryProperties: SortedClasses["arbitraryProperties"]
}

export const attemptToChangeClassMapBasedOnIfItIsAVariantGroup =
    ({ arbitraryProperties, customFiltered, utility }: PropsNeededFromSortedClasses, className: string, filterMap?: FilterMap) => {



        const variantGroupMatch = variantGroupRE.exec(className)


        if (!variantGroupMatch) return




        const [, variant, classNames] = variantGroupMatch


        if (!variant || !classNames) return

        const splitClassNames = classNames?.split(/\s/)


        splitClassNames
            .map(className => `${variant}${className}`)
            .forEach((className) => {

                attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValue(utility, className)
                attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass(utility, className)
                attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty(arbitraryProperties, className)

                if (filterMap) {

                    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject(customFiltered, className, filterMap)

                }

            })



    };














