
import clsx from "clsx"
import {
    type SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject,
    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup,
    attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue, createSortedTailwindClasses,
    createSortedBootstrapClasses,
    createSortedBaseCN_EFSClasses,
    type FilterObject,
    attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue
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

type ClassMapChanger<T extends SortedClasses> = (sortedClasses: T, value: string, filterObject: FilterObject | undefined) => T

type ClassMapTransformer<T extends SortedClasses> = (sortedClasses: Omit<T, "customFiltered" | "safeListed">, value: string) => string

const classNameFilterSorterFactory = <
    T extends SortedClasses
>(
    sortedClasses: T,
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



                if (carry.safeListed.includes(value)) {


                    throw new Error(
                        `You have this class in the safelist and as a class name.
                     Classes that are safe listed are not filtered just prepended
                     to the start result of this function.
                     If you want them filtered then please use a filter map instead.
                    `
                    )

                }




                carry.safeListed.push(value)

                return carry




            }






            return classMapChanger(carry, value, filterObject)

        }, sortedClasses)

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
    utility: string) {


    const valueIsPrefixedWithAnExclamationMarkOrDashRE = /^(?<prefix>(-|!))(?<value>\[[\w\-0-9$.#),(%\/:]+\]|[\w\d]+)$/

    const valueIsAUtilityClassVariantAndTypeRE = /^(?<variant>[a-z0-9\][#\.&:\-\)"=(\/]+:)?(?<type>[a-z\-]+-)$/


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
    sortedClasses: T,
    classMapChanger: ClassMapChanger<T>,
    classMapToStringTransformer: ClassMapTransformer<T>
}

const getClassNamesEvaluatorFilterAndSorter =
    <T extends SortedClasses>(options: GetClassNamesEvaluatorFilterAndSorterOptions<T>) =>
        (...args: Parameters<typeof clsx>) => {

            const { sortedClasses, classMapChanger, classMapToStringTransformer, filterObject } = options

            const classNameFilterSorter = classNameFilterSorterFactory(
                sortedClasses,
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
            sortedClasses: createSortedBaseCN_EFSClasses(),
            classMapChanger(sortedClasses, value) {


                if (attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue(sortedClasses.basicUtility, value))
                    return sortedClasses

                attemptToChangeClassNameMapAccordingToIfTheBEMConvention(sortedClasses.bem, value, sortedClasses.safeListed)


                return sortedClasses

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

                if (classNameMap.basicUtility.size !== 0) {



                    for (const [utility, utilityValueMap] of classNameMap.basicUtility) {


                        if (!utilityValueMap) continue;

                        const valuesFromUtilityValueMap = [
                            utilityValueMap.get("digit"),
                            utilityValueMap.get("word"),
                            utilityValueMap.get("color"),
                        ]


                        const utilityClassesFromValuesFromUtilityValueMap = valuesFromUtilityValueMap
                            .filter(isString)
                            .map((value) => `${utility}${value} `)

                        sortString = sortString.concat(
                            ...utilityClassesFromValuesFromUtilityValueMap
                        )

                    }



                }


                return sortString

            }
        }
    )

    return classNamesEvaluatorFilterAndSorter(...args)

}



export const tailwindOrWindiCN_EFS = (...args: Parameters<typeof clsx>) => {


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
        "backdrop-grayscale": ["backdrop-grayscale", "backdrop-grayscale-0"],
        "backdrop-invert": ["backdrop-invert", "backdrop-invert-0"],
        "backdrop-sepia": ["backdrop-sepia", "backdrop-sepia-0"],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-transform": ["uppercase", "lowercase", "normal-case", "capitalize",],
        "font-smoothing": ["antialiased", "subpixels-antialiased"],
    } satisfies FilterObject



    const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter({
        sortedClasses: createSortedTailwindClasses(),
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


export const bootstrapCN_EFS = (...args: Parameters<typeof clsx>) => {


    const bootstrapFilterObject = {
        visibility: ["visible", "invisible", "collapse"],
        layout: ["d-flex", "grid"],
        stack: ["vstack", "hstack"]
    } satisfies FilterObject



    const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter({
        filterObject: bootstrapFilterObject,
        sortedClasses: createSortedBootstrapClasses(),
        classMapChanger(sortedClasses, value) {

            attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(sortedClasses.bootstrapCSSUtility, value)

            return sortedClasses


        },
        classMapToStringTransformer(sortedClasses, sortString) {

            if (sortedClasses.bootstrapCSSUtility.size !== 0) {


                for (const [classType, classValueMap] of sortedClasses.bootstrapCSSUtility) {


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

