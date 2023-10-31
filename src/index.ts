
import clsx from "clsx"
import {
    type SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject,
    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup,
    attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue,
    createSortedBEMClasses,
    createSortedTailwindClasses,
    createSortedBootstrapClasses,

} from "./classMapChangers"





const createStringFromCustomFilteredMapIfItIsNotEmptyAnEmptyStringIfItIs = (map: SortedClasses["customFiltered"]) => {



    let sortString = ""

    if (map.size === 0) return sortString



    for (const filterClassVariantsAndValues of map.values()) {


        if (!filterClassVariantsAndValues) continue

        for (const [variant, className] of filterClassVariantsAndValues) {


            sortString = sortString.concat(`${variant === "base" ? "" : variant}${className} `)

        }


    }

    return sortString


}

const createStringFromSafeListedMapIfItIsNotEmptyAnEmptyStringIfItIs = (safeListed: SortedClasses["safeListed"]) => {


    if (safeListed.length === 0) return ""


    return `${safeListed.join(" ")} `


}

type ClassMapChanger<T extends SortedClasses> = (classMap: T, value: string, filterObject: FilterObject | undefined) => T

type ClassMapTransformer<T extends SortedClasses> = (classMap: Omit<T, "customFiltered" | "safeListed">, value: string) => string

const classNameFilterSorterFactory = <
    T extends SortedClasses
>(
    classMap: T,
    classMapChanger: ClassMapChanger<T>,
    classMapToStringTransformer: ClassMapTransformer<T>
) => {



    return (
        classNames: string,
        filterObject?: FilterObject,
    ) => {


        const oneWordClass = /^[a-z]+$/

        const splitClassNames = classNames.split(/\s+/)

        if (splitClassNames.length < 2) {

            throw new Error(
                "This string has no sets of classes please add spaces between classes that need to be sorted"
            )

        }

        const { customFiltered, safeListed, ...restOfTheMap } = splitClassNames.reduce((carry, value) => {


            // ! It's important for safe-listed classes and classes in the class type and object to be accounted for first. 


            if (filterObject) {

                const result = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject(
                    carry.customFiltered,
                    value,
                    filterObject
                )

                if (result) return carry


            }

            if (oneWordClass.test(value)) {



                if (!carry.safeListed.includes(value)) {


                    carry.safeListed.push(value)

                    return carry
                }

                if (carry.safeListed.includes(value)) {


                    throw new Error(
                        `You have this class in the safelist and as a class name.
                     Classes that are safe listed are not filtered just prepended
                     to the start result of this function.
                     If you want them filtered then please use a filter map instead.
                    `
                    )

                }


            }






            return classMapChanger(carry, value, filterObject)

        }, classMap)

        const resultOfCreateStringFromSafeListedMapIfItIsNotEmpty =
            createStringFromSafeListedMapIfItIsNotEmptyAnEmptyStringIfItIs(safeListed)

        const resultOfCreateStringFromCustomFilteredMapIfItIsNotEmpty =
            createStringFromCustomFilteredMapIfItIsNotEmptyAnEmptyStringIfItIs(customFiltered)


        return classMapToStringTransformer(
            restOfTheMap,
            resultOfCreateStringFromSafeListedMapIfItIsNotEmpty.concat(resultOfCreateStringFromCustomFilteredMapIfItIsNotEmpty)
        ).trimEnd()


    }


}


function isString(value: unknown): value is string {
    return typeof value === "string"
}

function getCreateUtilityClassesBasedOnIfTheValueHasAPrefix(
    valueIsPrefixedWithAnExclamationMarkOrDashRE: RegExp,
    valueIsAUtilityClassVariantAndTypeRE: RegExp,
    utility: string) {
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



type GetClassNamesEvaluatorFilterAndSorterOptions<T extends SortedClasses> = {
    filterObject?: FilterObject
    classMap: T,
    classMapChanger: ClassMapChanger<T>,
    classMapToStringTransformer: ClassMapTransformer<T>
}

export const getClassNamesEvaluatorFilterAndSorter =
    <T extends SortedClasses>(options: GetClassNamesEvaluatorFilterAndSorterOptions<T>) =>
        (...args: Parameters<typeof clsx>) => {

            const { classMap, classMapChanger, classMapToStringTransformer, filterObject } = options

            const classNameFilterSorter = classNameFilterSorterFactory(
                classMap,
                classMapChanger,
                classMapToStringTransformer,
            )



            return classNameFilterSorter(
                clsx(...args),
                filterObject
            )

        }


export const cnEFS = (...args: Parameters<typeof clsx>) => {


    const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter(
        {
            classMap: createSortedBEMClasses(),
            classMapChanger(classMap, value) {


                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(classMap.bem, value, classMap.safeListed)


                return classMap

            },
            classMapToStringTransformer(classNameMap, sortString) {

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


                return sortString

            }
        }
    )

    return classNamesEvaluatorFilterAndSorter(...args)

}

type FilterObject = Record<Lowercase<string>, Array<Lowercase<string>>>;

const TailwindOrWindiFilterObject = {
    appearance: ["appearance-none"],
    grayscale: ["grayscale-0", "grayscale"],
    invert: ["invert-0", "invert"],
    display: [
        "flex",
        "inline-flex",
        "grid",
        "inline-grid",
        "block",
        "inline",
        "inline-block",
        "hidden",
        "table",
        "inline-table",
        "table-caption",
        "table-cell",
        "table-column",
        "table-column-group",
        "table-footer-group",
        "table-header-group",
        "table-row-group",
        "table-row",
        "flow-root",
        "contents",
        "list-item",
    ],
    position: ["absolute", "fixed", "static", "relative", "sticky"],
    sepia: ["sepia-0", "sepia"],
    italic: ["italic", "not-italic"],
    transition: [
        "transition",
        "transition-all",
        "transition-colors",
        "transition-opacity",
        "transition-shadow",
        "transition-transform",
    ],
    visibility: ["visible", "invisible", "collapse"],
    "screen-reader": ["sr-only", "not-sr-only",],
    "font-variant": [
        "normal-nums",
        "ordinal",
        "slashed-zero",
        "lining-nums",
        "oldstyle-nums",
        "proportional-nums",
        "tabular-nums",
        "diagonal-fractions",
        "stacked-fractions",
    ],

    "border-collapse": ["border-collapse", "border-separate"],
    "backdrop-grayscale": ["backdrop-grayscale", "backdrop-grayscale-0"],
    "backdrop-invert": ["backdrop-invert", "backdrop-invert-0"],
    "backdrop-sepia": ["backdrop-sepia", "backdrop-sepia-0"],
    "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
    "text-transform": ["uppercase", "lowercase", "normal-case", "capitalize",],
    "font-smoothing": ["antialiased", "subpixels-antialiased"],
} satisfies FilterObject

export const tailwindOrWindi_CN_EFS = (...args: Parameters<typeof clsx>) => {


    const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter({
        classMap: createSortedTailwindClasses(),
        classMapChanger(classNameMap, value, filterObject) {


            if (attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(classNameMap.tailwindCSSUtility, value))
                return classNameMap



            if (attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(classNameMap.arbitraryProperties, value))
                return classNameMap


            if (attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(classNameMap.tailwindCSSUtility, value))
                return classNameMap


            const { customFiltered, tailwindCSSUtility, arbitraryProperties } = classNameMap

            attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup(
                {
                    tailwindCSSUtility,
                    arbitraryProperties,
                    customFiltered
                },
                value,
                filterObject
            )

            return classNameMap


        },
        classMapToStringTransformer(classNameMap, sortString) {


            if (classNameMap.arbitraryProperties.size !== 0) {


                for (const [property, variantAndValueMap] of classNameMap.arbitraryProperties) {



                    if (!variantAndValueMap) continue;


                    for (const [variant, value] of variantAndValueMap) {

                        sortString = sortString.concat(`${variant === "base" ? "" : variant}[${property}${value}] `)
                    }



                }

            }

            if (classNameMap.tailwindCSSUtility.size !== 0) {


                const valueIsPrefixedWithAnExclamationMarkOrDashRE = /^(?<prefix>(-|!))(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d]+)$/

                const valueIsAUtilityClassVariantAndTypeRE = /^(?<variant>[a-z0-9\][#\.&:\-\)"=(\/]+:)?(?<type>[a-z\-]+-)$/


                for (const [utility, utilityValueMap] of classNameMap.tailwindCSSUtility) {


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

            return sortString

        },
        filterObject: TailwindOrWindiFilterObject,

    })
    return classNamesEvaluatorFilterAndSorter(...args)
}

const bootstrapFilterObject = {
    visibility: ["visible", "invisible", "collapse"],
    layout: ["d-flex", "grid"],
    stack: ["vstack", "hstack"]
} satisfies FilterObject




export const bootstrap_CN_EFS = (...args: Parameters<typeof clsx>) => {


    const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter({
        filterObject: bootstrapFilterObject,
        classMap: createSortedBootstrapClasses(),
        classMapChanger(classMap, value) {

            attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(classMap.bootstrapCSSUtility, value)

            return classMap


        },
        classMapToStringTransformer(classMap, sortString) {

            if (classMap.bootstrapCSSUtility.size !== 0) {


                for (const [classType, classValueMap] of classMap.bootstrapCSSUtility) {


                    if (!classValueMap) continue;


                    const [digitMap, wordMap] = [
                        classValueMap.get("digitMap"),
                        classValueMap.get("wordMap")
                    ]

                    if (digitMap) {

                        for (const [key, value] of digitMap.entries()) {

                            const returnEmptyStringIfKeyIsBaseElseKey =
                                key === "base" ? "" : key

                            sortString = sortString.concat(
                                `${classType}-${value}${returnEmptyStringIfKeyIsBaseElseKey} `
                            )

                        }

                    }

                    if (wordMap) {

                        for (const [key, value] of wordMap.entries()) {

                            const returnEmptyStringIfKeyIsBaseElseKey =
                                key === "base" ? "" : key

                            sortString = sortString.concat(
                                `${classType}-${value}${returnEmptyStringIfKeyIsBaseElseKey} `
                            )

                        }
                    }


                }

            }

            return sortString

        }
    })

    return classNamesEvaluatorFilterAndSorter(...args)


}

