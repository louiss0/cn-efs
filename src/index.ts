
import clsx from "clsx"
import {
    type SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnAFilterObject,
    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup,
    attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue, SortedTailwindClasses,
    SortedBootstrapClasses,
    SortedBaseCN_EFSClasses,
    type FilterObject,
    attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue,
    attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass,
    attemptToChangeClassMapIfAClassIsASingleWordClass
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

type ClassMapChanger<T extends SortedClasses, U extends FilterObject | undefined> = (sortedClasses: T, value: string, filterObject: U) => T

type ClassMapTransformer<T extends SortedClasses> =
    (sortedClasses: Omit<T, "customFiltered" | "safeListed">, value: string) => string

const classNameFilterSorterFactory = <
    T extends SortedClasses
    , U extends FilterObject | undefined
>(
    sortedClassesCreator: () => T,
    classMapChanger: ClassMapChanger<T, U>,
    classMapToStringTransformer: ClassMapTransformer<T>
) => {

    return (classNames: Array<string>, filterObject: U) => {


        const sortedClassesObject = sortedClassesCreator()

        const { customFiltered, safeListed, ...restOfTheMap } = classNames
            .reduce(
                (sortedClassesObject, className) =>
                    classMapChanger(sortedClassesObject, className, filterObject),
                sortedClassesObject
            )

        const resultOfCreateStringFromSafeListedMapIfItIsNotEmpty =
            createStringFromSafeListedMapIfItIsNotEmptyAnEmptyStringIfItIs(safeListed)

        const resultOfCreateStringFromCustomFilteredMapIfItIsNotEmpty =
            createStringFromCustomFilteredMapIfItIsNotEmptyAnEmptyStringIfItIs(customFiltered)





        return classMapToStringTransformer(
            restOfTheMap,
            resultOfCreateStringFromSafeListedMapIfItIsNotEmpty
                .concat(resultOfCreateStringFromCustomFilteredMapIfItIsNotEmpty)
        ).trimEnd()


    }


}






type GetClassNamesEvaluatorFilterAndSorterOptions
    <T extends SortedClasses, U extends FilterObject | undefined> = {
        filterObject?: U
        sortedClassesCreator: () => T,
        classMapChanger: ClassMapChanger<T, U>,
        classMapToStringTransformer: ClassMapTransformer<T>
    }

const getClassNamesEvaluatorFilterAndSorter =
    <T extends SortedClasses, U extends FilterObject | undefined>(options: GetClassNamesEvaluatorFilterAndSorterOptions<T, U>) =>
        (...args: Parameters<typeof clsx>): string => {

            const {
                sortedClassesCreator,
                classMapChanger,
                classMapToStringTransformer,
                filterObject
            } = options



            const oneOrMoreSpacesRE = /\s+/

            const splitClassNames = clsx(...args).split(oneOrMoreSpacesRE)

            if (splitClassNames.length < 2) {

                throw new Error(
                    "This string has no sets of classes please add spaces between classes that need to be sorted"
                )

            }

            const classNameFilterSorter = classNameFilterSorterFactory(
                sortedClassesCreator,
                classMapChanger,
                classMapToStringTransformer,
            )


            return classNameFilterSorter(
                splitClassNames,
                filterObject as U
            )

        }


/**

 This function evaluates each argument passed to it using clsx
 Then it filters out classes based on whether each class is 
 based on the BEM Convention or is a basic utility class.
 @param {...Parameters<typeof clsx>} args -  arguments that clsx accepts
 @returns A string of sorted classes 
 */
export const cnEFS: (...args: Parameters<typeof clsx>) => string =
    getClassNamesEvaluatorFilterAndSorter({
        sortedClassesCreator: () => new SortedBaseCN_EFSClasses(),
        classMapChanger(sortedClasses, className) {



            const classMapIsChanged = [
                () =>
                    attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue(
                        sortedClasses.basicUtility,
                        className,
                    ),
                () => attemptToChangeClassMapIfAClassIsASingleWordClass(
                    sortedClasses.safeListed,
                    className,
                ),
            ].some(classMapChanger => classMapChanger())


            if (classMapIsChanged)
                return sortedClasses;


            attemptToChangeClassNameMapAccordingToIfTheBEMConvention(
                sortedClasses.bem,
                className,
                sortedClasses.safeListed,
            );

            return sortedClasses;
        },
        classMapToStringTransformer(classNameMap, _sortString) {
            let sortString = _sortString;

            if (classNameMap.bem.size !== 0) {
                for (const [block, value] of classNameMap.bem) {
                    const modifier = value?.get("modifier");
                    const element = value?.get("element");

                    if (modifier) {
                        sortString = sortString.concat(`${block} ${block}${modifier} `);
                    }

                    if (element) {
                        sortString = sortString.concat(`${block}${element} `);
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
                    ];

                    const utilityClassesFromValuesFromUtilityValueMap =
                        valuesFromUtilityValueMap
                            .filter((classNameValue) => typeof classNameValue === "string")
                            .map((classNameValue) => `${utility}${classNameValue} `);

                    sortString = sortString.concat(
                        ...utilityClassesFromValuesFromUtilityValueMap,
                    );
                }
            }

            return sortString;
        },
    });




/**

 This function evaluates each argument passed to it using clsx
 Then it filters out classes based on whether each class is 
 based on Tailwind' or WindiCSS's naming conventions.
 Finally a string is returned that is a sorted version of the  classes generated by clsx. 
 For people that use WindiCSS this function will sort variant groups as well. 
 @param {...Parameters<typeof clsx>} args -  arguments that clsx accepts
 @returns A string of sorted classes 

 */
export const tailwindOrWindiCN_EFS: (...args: Parameters<typeof clsx>) => string =
    getClassNamesEvaluatorFilterAndSorter({
        filterObject: {
            position: ['absolute', 'sticky', 'relative', "static", "fixed"],
            display: [
                'hidden',
                'list-item',
                "contents",
                'inline-grid',
                'flow-root',
                "table-row",
                "table-row-group",
                'table-header-group',
                'table-footer-group',
                'table-column-group',
                'table-column',
                'table-cell',
                "table-caption",
                "inline-table",
                'inline-flex',
                'inline-block',
                'flex',
                'grid',
                'flex-col',
                'table',
                'inline',
                'block'
            ],
            visibility: ['visible', "invisible", 'collaspe'],
            sr: ['sr-only', 'not-sr-only'],
            textDecoration: ['underline', 'overline', 'line-through', 'no-underline'],
            textTransform: ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
            textOverflow: ['truncate', 'text-ellipsis', "text-clip"],
            fontStyle: ['italic', 'not-italic'],
            fontSmoothing: ['antialiased', 'subpixel-antialiased'],
            fontVariantNumeric: [
                'oldstyle-nums',
                'diagonal-fractions',
                'proportional-nums',
                'tabular-nums',
                'lining-nums',
                'normal-nums',
                'ordinal',
                'slashed-zero'
            ],

        },
        sortedClassesCreator: () => new SortedTailwindClasses(),
        classMapChanger(classNameMap, className, filterObject) {


            const classMapWasChangedByAClassMapChanger = [
                () =>
                    attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass(
                        classNameMap,
                        className
                    )
                ,
                () =>
                    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(
                        classNameMap.tailwindCSSUtility,
                        className
                    ),
                () =>
                    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(
                        classNameMap.arbitraryProperties,
                        className
                    ),
                () =>
                    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(
                        classNameMap.tailwindCSSUtility,
                        className
                    ),
                () => attemptToChangeClassNameMapBasedOnAFilterObject(
                    classNameMap.customFiltered,
                    className,
                    filterObject
                ),
                () => attemptToChangeClassMapIfAClassIsASingleWordClass(
                    classNameMap.safeListed,
                    className
                ),
            ].some(callClassMapChanger => callClassMapChanger())


            if (classMapWasChangedByAClassMapChanger)

                return classNameMap

            const { customFiltered, tailwindCSSUtility, arbitraryProperties } = classNameMap

            attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup(
                {
                    tailwindCSSUtility,
                    arbitraryProperties,
                    customFiltered
                },
                className,
                filterObject
            )

            return classNameMap


        },
        classMapToStringTransformer(classNameMap, _sortString) {

            let sortString = _sortString

            if (classNameMap.arbitraryProperties.size !== 0) {


                for (const [property, variantAndValueMap] of classNameMap.arbitraryProperties) {



                    if (!variantAndValueMap) continue;

                    const variantAndValueMapIsEmpty = variantAndValueMap.size === 0

                    if (variantAndValueMapIsEmpty) continue;


                    for (const [variant, value] of variantAndValueMap) {

                        sortString = sortString
                            .concat(`${variant === "base" ? "" : variant}[${property}${value}] `)
                    }



                }

            }

            if (classNameMap.tailwindCSSUtility.size !== 0) {





                for (const [utility, utilityValueMap] of classNameMap.tailwindCSSUtility) {


                    if (!utilityValueMap) continue;

                    const utilityValueMapIsEmpty = utilityValueMap.size === 0


                    if (utilityValueMapIsEmpty) continue;


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
                            .filter((value) => value instanceof Map)
                            .map((prefixValueMap) => {
                                const prefix = prefixValueMap?.get("prefix")
                                const value = prefixValueMap?.get("value")


                                return `${utility}${prefix}${value} `

                            })


                    sortString = sortString.concat(
                        ...utilityClassesCreatedFromDefinedValuesFromTheUtilityValueMap

                    )





                }

            }


            return sortString

        },

    })



/**

 This function evaluates each argument passed to it using clsx
 Then it filters out classes based on whether each class is 
 based on BootstrapCSS's naming conventions.
 Finally a string is returned that is a sorted version of the classes generated by clsx. 
 
 @param {...Parameters<typeof clsx>} args -  arguments that clsx accepts
 @returns A string of sorted classes 

*/
export const bootstrapCN_EFS: (...args: Parameters<typeof clsx>) => string = getClassNamesEvaluatorFilterAndSorter({
    filterObject: {
        visibility: ["visible", "invisible", "collapse"],
        layout: ["d-flex", "grid"],
        stack: ["vstack", "hstack"]
    },
    sortedClassesCreator: () => new SortedBootstrapClasses(),
    classMapChanger(sortedClasses, className, filterObject) {



        const attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValueWasSuccessful =
            attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(
                sortedClasses.bootstrapCSSUtility,
                className
            )

        if (attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValueWasSuccessful)
            return sortedClasses

        const classMapHasChanged = [

            () => attemptToChangeClassNameMapBasedOnAFilterObject(
                sortedClasses.customFiltered,
                className,
                filterObject
            ),

            () => attemptToChangeClassMapIfAClassIsASingleWordClass(
                sortedClasses.safeListed,
                className
            ),
        ].some(classMapChanger => classMapChanger())

        if (classMapHasChanged)
            return sortedClasses

        return sortedClasses

    },
    classMapToStringTransformer(sortedClasses, _sortString) {

        let sortString = _sortString
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



