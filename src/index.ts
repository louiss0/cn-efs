
import { TailwindOrWindiFilterMap } from "./classFilterMaps"
import {
    SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject,
    attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAVariantGroup,
} from "./classMapChangers"





export type ClassNamesSorterAndFilter = typeof classNamesSorterAndFilter



function getSortClassesBasedOnClassType(
    classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>,
    safelist?: Array<string>
) {

    return (carry: SortedClasses, value: string, _: number, array: Array<string>) => {





        if (safelist) {



            if (safelist.includes(value) && !carry.safeListed.includes(value)) {


                carry.safeListed.push(value)

                return carry
            }

            if (safelist.includes(value) && carry.safeListed.includes(value)) {


                throw new Error(
                    `You have this class in the safelist and as a class name.
                     Classes that are safe listed are not filtered just prepended
                     to the start result of this function.
                     If you want them filtered then please use a filter map instead.
                    `
                )

            }


        }


        if (classTypesAndClassNames) {

            const result = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject(
                carry.customFiltered,
                value,
                classTypesAndClassNames
            )

            if (result) return carry


        }



        if (attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValue(carry.utility, value))
            return carry


        if (attemptToChangeClassNameMapAccordingToIfTheBEMConvention(carry.bem, value, array))
            return carry


        if (attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty(carry.arbitraryProperties, value))
            return carry


        if (attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass(carry.utility, value))
            return carry


        const { customFiltered, utility, arbitraryProperties } = carry

        attemptToChangeClassMapBasedOnIfItIsAVariantGroup(
            {
                utility,
                arbitraryProperties,
                customFiltered
            },
            value,
            classTypesAndClassNames
        )


        return carry


    }
}





function isString(value: unknown): value is string {
    return typeof value === "string"
}

export const classNamesSorterAndFilter = (
    classNames: string,
    classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>,
    safelist?: Array<string>
) => {


    const splitClassNames = classNames.split(/\s+/)

    if (splitClassNames.length < 2) {

        throw new Error(
            "This string has no sets of classes please add spaces between classes that need to be sorted",
        )

    }


    let classNameMap

    try {

        classNameMap =
            splitClassNames.reduce(
                getSortClassesBasedOnClassType(classTypesAndClassNames, safelist),
                new SortedClasses()
            )
    } catch (error) {


        throw error


    }



    let sortString = ""



    if (classNameMap.bem.size !== 0) {



        for (const [block, value] of classNameMap.bem) {



            const modifier = value?.get("modifier")
            const element = value?.get("element")


            if (modifier) {

                sortString = sortString.concat(`${block} ${block}${modifier} `)
            }

            if (element) {

                sortString = sortString.concat(`${block}${element} `)
            }



        }

    }



    if (classNameMap.arbitraryProperties.size !== 0) {


        for (const [property, variantAndValueMap] of classNameMap.arbitraryProperties) {



            if (!variantAndValueMap) continue;


            for (const [variant, value] of variantAndValueMap) {

                sortString = sortString.concat(`${variant === "base" ? "" : variant}[${property}${value}] `)
            }



        }

    }

    if (classNameMap.utility.size !== 0) {


        const valueIsPrefixedWithAnExclamationMarkOrDashRE = /^(?<prefix>(-|!))(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d]+)$/

        const valueIsAUtilityClassVariantAndTypeRE = /^(?<variant>[a-z0-9\][#\.&:\-\)"=(\/]+:)?(?<type>[a-z\-]+-)$/


        for (const [utility, utilityValueMap] of classNameMap.utility) {


            if (!utilityValueMap) continue;

            const valuesFromUtilityValueMap = [
                utilityValueMap.get("digit"),
                utilityValueMap.get("word"),
                utilityValueMap.get("color"),
                utilityValueMap.get("function"),
                utilityValueMap.get("variable"),
                utilityValueMap.get("args"),
            ]




            const utilityClassesCreatedFromDefinedValuesFromTheUtilityValueMap =
                valuesFromUtilityValueMap
                    .filter(isString)
                    .map(
                        getCreateUtilityClassesBasedOnIfTheValueHasAPrefix(
                            valueIsPrefixedWithAnExclamationMarkOrDashRE,
                            valueIsAUtilityClassVariantAndTypeRE,
                            utility
                        )
                    )

            sortString = sortString.concat(
                ...utilityClassesCreatedFromDefinedValuesFromTheUtilityValueMap

            )




        }

    }

    if (classNameMap.customFiltered.size !== 0) {

        for (const filterClassVariantsAndValues of classNameMap.customFiltered.values()) {


            if (!filterClassVariantsAndValues) continue

            for (const [variant, className] of filterClassVariantsAndValues) {


                sortString = sortString.concat(`${variant === "base" ? "" : variant}${className} `)

            }


        }

    }


    if (classNameMap.safeListed.length !== 0) {



        sortString = `${classNameMap.safeListed.join(" ")}${sortString} `

    }


    return sortString.trimEnd()





    function getCreateUtilityClassesBasedOnIfTheValueHasAPrefix(valueIsPrefixedWithAnExclamationMarkOrDashRE: RegExp, valueIsAUtilityClassVariantAndTypeRE: RegExp, utility: string) {
        return (classValue: string) => {


            const prefixAndValueGroup = valueIsPrefixedWithAnExclamationMarkOrDashRE.exec(classValue)?.groups

            const utilityAndClassValueWithASpace = `${utility}${classValue} `

            if (!prefixAndValueGroup) {

                return utilityAndClassValueWithASpace

            }


            const { prefix, value } = prefixAndValueGroup



            if (!prefix || !value) {



                return utilityAndClassValueWithASpace


            }


            const valueIsAUtilityClassVariantAndTypeGroup = valueIsAUtilityClassVariantAndTypeRE.exec(utility)?.groups


            if (!valueIsAUtilityClassVariantAndTypeGroup) {

                return utilityAndClassValueWithASpace

            }


            const { variant, type } = valueIsAUtilityClassVariantAndTypeGroup as {
                variant?: string
                type: string
            }



            return variant
                ? `${variant}${prefix}${type}${value} `
                : `${prefix}${type}${value} `





        }
    }
}


const tailwindOrWindiSafeList = ["group", "peer", "@container", "content", "appearance-none"]

export const tailwindOrWindiCSSClassNamesSorterAndFilter = (classNames: string) =>
    classNamesSorterAndFilter(classNames, TailwindOrWindiFilterMap, tailwindOrWindiSafeList)







