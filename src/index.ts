
import clsx from "clsx"
import {
    type SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject,
    attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty,
    attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass,
    attemptToChangeClassMapBasedOnIfItIsAWindiVariantGroup,
    attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue, SortedTailwindClasses,
    SortedBootstrapClasses,
    SortedBaseCN_EFSClasses,
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
    sortedClassesCreator: () => T,
    classMapChanger: ClassMapChanger<T>,
    classMapToStringTransformer: ClassMapTransformer<T>
) => {

    return (classNames: Array<string>, filterObject?: FilterObject) => {


        const sortedClassesObject = sortedClassesCreator()

        const { customFiltered, safeListed, ...restOfTheMap } = classNames
            .reduce(
                getSortClassesBasedOnTheFilterObjectIfItsOneWordOrUseTheClassMapChanger<T>(filterObject, classMapChanger),
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


function getSortClassesBasedOnTheFilterObjectIfItsOneWordOrUseTheClassMapChanger
    <T extends SortedClasses>
    (filterObject: FilterObject | undefined, classMapChanger: ClassMapChanger<T>):
    (previousValue: T, currentValue: string, currentIndex: number, array: string[]) => T {
    return (carry, value) => {
        // ! It's important for safe-listed classes and classes in the class type and object to be accounted for first. 


        if (filterObject) {

            const attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectWasSuccessful = attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject(
                carry.customFiltered,
                value,
                filterObject
            )

            if (attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectWasSuccessful)
                return carry


        }

        const oneWordClass = /^[a-z]+$/

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

    }
}







type GetClassNamesEvaluatorFilterAndSorterOptions<T extends SortedClasses> = {
    filterObject?: FilterObject
    sortedClassesCreator: () => T,
    classMapChanger: ClassMapChanger<T>,
    classMapToStringTransformer: ClassMapTransformer<T>
}

const getClassNamesEvaluatorFilterAndSorter =
    <T extends SortedClasses>(options: GetClassNamesEvaluatorFilterAndSorterOptions<T>) =>
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
                filterObject
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
        classMapChanger(sortedClasses, value) {
            const attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValueWasSuccessful =
                attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue(
                    sortedClasses.basicUtility,
                    value,
                );

            if (
                attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValueWasSuccessful
            )
                return sortedClasses;

            attemptToChangeClassNameMapAccordingToIfTheBEMConvention(
                sortedClasses.bem,
                value,
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
                            .filter((value) => typeof value === "string")
                            .map((value) => `${utility}${value} `);

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

        sortedClassesCreator: () => new SortedTailwindClasses(),
        classMapChanger(classNameMap, value, filterObject) {



            const classMapWasChangedByAClassMapChanger = [
                () => attemptToChangeClassMapBasedOnTheTailwindCSSUtilityClassTypeAndValue(classNameMap.tailwindCSSUtility, value),
                () => attemptToChangeClassNameMapAccordingToIfTheClassIsATailwindArbitraryProperty(classNameMap.arbitraryProperties, value),
                () => attemptToChangeClassMapBasedOnIfItIsATailwindRelationalUtilityClass(classNameMap.tailwindCSSUtility, value)
            ].some(value => value() === true)


            if (classMapWasChangedByAClassMapChanger)

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
    classMapChanger(sortedClasses, value) {

        attemptToChangeClassMapBasedOnTheBootstrapCSSUtilityClassTypeAndValue(
            sortedClasses.bootstrapCSSUtility,
            value
        )

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



