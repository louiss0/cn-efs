
import clsx from "clsx"
import {
    SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject,
    attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAVariantGroup,
} from "./classMapChangers"


type ClassNamesSorterAndFilter = typeof classNamesSorterAndFilter


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



        if (attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(carry.tailwindCSSUtility, value))
            return carry


        if (attemptToChangeClassNameMapAccordingToIfTheBEMConvention(carry.bem, value, array))
            return carry


        if (attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty(carry.arbitraryProperties, value))
            return carry


        if (attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass(carry.tailwindCSSUtility, value))
            return carry


        const { customFiltered, tailwindCSSUtility: utility, arbitraryProperties } = carry

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

const classNamesSorterAndFilter = (
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
}


type GetClassNamesEvaluatorFilterAndSorterOptions = {
    filterObject?: Parameters<ClassNamesSorterAndFilter>[1]
    safelist?: Parameters<ClassNamesSorterAndFilter>[2]
}

export const getClassNamesEvaluatorFilterAndSorter =
    (options?: GetClassNamesEvaluatorFilterAndSorterOptions) =>
        (...args: Parameters<typeof clsx>) =>
            classNamesSorterAndFilter(clsx(...args), options?.filterObject, options?.safelist)

export const classNamesEFS = getClassNamesEvaluatorFilterAndSorter();


const tailwindOrWindiSafeList = ["group", "peer", "@container", "content", "appearance-none"]

type FilterObject = Record<Lowercase<string>, Array<Lowercase<string>>>;

const TailwindOrWindiFilterObject = {
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

export const tailwindOrWindiClassNamesEFS = (...args: Parameters<typeof clsx>) =>
    getClassNamesEvaluatorFilterAndSorter({ filterObject: TailwindOrWindiFilterObject, safelist: tailwindOrWindiSafeList })(...args)



