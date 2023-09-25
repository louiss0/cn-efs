import type { FilterMap } from "./classFilterMaps"


const cssVariableWithOptionalPrefixedHintRE =
    /^(?<variable_hint>[a-z]+:)?(?<variable_value>--_?[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*)$/

const checkIfStringIsACssVariableWithAnOptionalHint = (string: string) => cssVariableWithOptionalPrefixedHintRE.test(string)


const cssTypeAndValueUtilityClassRE =
    /^(?<variant>[a-z0-9\][#\.&:\-\)"=(\/]+:)?(?<prefix>!|-)?(?<type>(?:[a-z]+-)(?:[a-z]+-)*)(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d]+)$/



const properCSSDigitRE = /^(?<digit>\d{1,4}(?:[a-z]{2,4})?)$/

const checkIfStringIsAProperDigit = (string: string) => properCSSDigitRE.test(string)


const colorRangeRE = /^(?<class_type>[\w]+-)(?:(?<color>[a-z]+-)(?<range>[0-9]{2,4}))$/

const hexColorRE = /^(?<hex_color>#[A-Fa-f0-9]{3,6})$/

const cssColorFunctionRE = /(?<css_color_function>[a-z]{3,9}\((?:\d{1,4}(?:%|[a-z]{3,4}|\.\d+)?(?:,|_)?){3,4}\))/

const utilityClassVariantAndSelfRE = /(?<variant>[a-z0-9)\-(\]\[&,]+:)?(?<class_type_and_value>[a-z0-9\-_\]\[,)(%#!]+)/

const isAColorRange = (string: string) => colorRangeRE.test(string)

const checkIfStringIsAProperColor = (string: string) =>
    hexColorRE.test(string)
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

    public readonly safeListed: Array<string> = []



}



const variableHasAColorHint = (arbitraryValue: string) =>
    cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.["variable_hint"] === "color:"

const variableHasALengthHint = (arbitraryValue: string) =>
    cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.["variable_hint"] === "length:"

const variableHasAStringHint = (arbitraryValue: string) =>
    cssVariableWithOptionalPrefixedHintRE.exec(arbitraryValue)?.groups?.["variable_hint"] === "string:"


type ClassMapChangerBasedOnClassName<T extends Map<string, Map<string | Omit<string, string>, string | undefined> | undefined>, U = undefined>
    = U extends undefined ? (classMap: T, className: string,) => void : (classMap: T, className: string, data: U) => void


export const attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValue:
    ClassMapChangerBasedOnClassName<SortedClasses["utility"]> = (classMap, className) => {



        const cssTypeValueUtilityClassMatchGroups = cssTypeAndValueUtilityClassRE.exec(className)?.groups



        if (cssTypeValueUtilityClassMatchGroups) {


            const { variant = "", type, value, prefix = "" } = cssTypeValueUtilityClassMatchGroups


            if (!type || !value) return




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
                || isAColorRange(`${type}${value}`)


            const variantAndClassType = `${variant}${type}`


            if (prefix === "-" && !valueIsAViableDigit) {

                throw new Error(`The ${prefix} only works with digits don't use it on classes that aren't numbers`)
            }

            const prefixAndClassValue = `${prefix}${value}`

            const colorRangeGroups = colorRangeRE.exec(`${type}${value}`)?.groups




            if (!classMap.has(variantAndClassType)) {


                if (valueIsAViableColor) {

                    if (colorRangeGroups) {


                        const { class_type, color, range } = colorRangeGroups

                        if (!class_type || !color || !range) return


                        if (!classMap.has(class_type)) {

                            classMap.set(
                                `${variant}${class_type}`,
                                new Map([
                                    [
                                        viableUtilityClassMapKeys[2],
                                        `${prefix}${color}${range}`
                                    ]
                                ])
                            )

                            return
                        }


                        classMap.get(`${variant}${class_type}`)?.set("color", `${prefix}${color}${range}`)

                        return

                    }



                    classMap.set(variantAndClassType, new Map([[viableUtilityClassMapKeys[2], prefixAndClassValue]]))

                    return

                }


                if (valueIsAViableDigit) {

                    classMap.set(variantAndClassType, new Map([[viableUtilityClassMapKeys[0], prefixAndClassValue]]))



                    return

                }


                if (valueIsAViableWord) {

                    classMap.set(variantAndClassType, new Map([[viableUtilityClassMapKeys[1], prefixAndClassValue]]))



                    return
                }



                if (arbitraryValueIsAViableNonColorFunction) {

                    classMap.set(variantAndClassType, new Map([[viableUtilityClassMapKeys[4], prefixAndClassValue]]))



                    return
                }


                if (arbitraryValueIsAViableCSSVariable) {

                    classMap.set(variantAndClassType, new Map([[viableUtilityClassMapKeys[3], prefixAndClassValue]]))



                    return
                }


                if (arbitraryValueIsASetOfArgs) {

                    classMap.set(variantAndClassType, new Map([[viableUtilityClassMapKeys[5], prefixAndClassValue]]))



                    return
                }




            }





            const result = colorRangeGroups?.class_type && classMap.get(colorRangeGroups?.class_type)
                || classMap.get(variantAndClassType)


            if (result) {

                if (valueIsAViableColor) {

                    if (!colorRangeGroups) {

                        result.set(viableUtilityClassMapKeys[2], prefixAndClassValue)
                        return
                    }


                    result.set(viableUtilityClassMapKeys[2], `${colorRangeGroups.color}${colorRangeGroups.range}`)


                    return

                }



                if (valueIsAViableDigit) {

                    result.set(viableUtilityClassMapKeys[0], prefixAndClassValue)



                    return
                }


                if (valueIsAViableWord) {

                    result.set(viableUtilityClassMapKeys[1], prefixAndClassValue)



                    return

                }



                if (arbitraryValueIsAViableNonColorFunction) {

                    result.set(viableUtilityClassMapKeys[4], prefixAndClassValue)



                    return
                }

                if (arbitraryValueIsAViableCSSVariable) {

                    result.set(viableUtilityClassMapKeys[3], prefixAndClassValue)



                    return
                }

                if (arbitraryValueIsASetOfArgs) {

                    result.set(viableUtilityClassMapKeys[5], prefixAndClassValue)



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


        const blockAndElementClassNameGroups = aBlockElementClassName.exec(className)?.groups

        const blockAndModifierClassNameGroups = aBlockModifierClassName.exec(className)?.groups



        if (blockAndElementClassNameGroups) {

            const {
                lower_case_word,
                element,
            } = blockAndElementClassNameGroups

            if (!lower_case_word || !element) return


            if (!classMap.has(lower_case_word)) {

                classMap.set(
                    lower_case_word,
                    new Map([
                        ["element", element],

                    ])
                )

                return

            }

            classMap.get(lower_case_word)
                ?.set("element", element)



        }

        if (blockAndModifierClassNameGroups) {


            const { lower_case_word, modifier } = blockAndModifierClassNameGroups



            if (!lower_case_word || !modifier) return


            if (!classNames.includes(lower_case_word)) {

                throw new Error(
                    `To have a modifier you must have the block ${lower_case_word} in the list of classes already.
                    Please put the block as the class that requires the use of the modifier.`
                )

            }


            if (!classMap.has(lower_case_word)) {

                classMap.set(lower_case_word, new Map([["modifier", modifier]]))

                return

            }


            classMap.get(lower_case_word)?.set("modifier", modifier)





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














