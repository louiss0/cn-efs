
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





export type ClassFilterAndSorter = typeof classFilterAndSorter



function getClassNameMapCreator(classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>) {

    return (carry: SortedClasses, value: string, _: number, array: Array<string>) => {




        if (classTypesAndClassNames) {

            attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject(
                carry.customFiltered,
                value,
                classTypesAndClassNames
            )

        }



        attemptToChangeClassMapBasedOnTheUtilityClassTypeAndValue(carry.utility, value)


        attemptToChangeClassNameMapAccordingToIfTheBEMConvention(carry.bem, value, array)


        attemptToChangeClassNameMapAccordingToIfTheClassIsAnArbitraryProperty(carry.arbitraryProperties, value)


        attemptToChangeClassMapBasedOnIfItIsARelationalUtilityClass(carry.utility, value)


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



const moreThanOneSpaceRE = /\s+/

export const classFilterAndSorter = (classNames: string, classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>) => {


    const splitClassNames = classNames.split(moreThanOneSpaceRE)

    if (splitClassNames.length < 2) {

        throw new Error(
            "This string has no sets of classes please add spaces between classes that need to be sorted",
        )

    }


    let classNameMap
    try {

        classNameMap =
            splitClassNames.reduce(
                getClassNameMapCreator(classTypesAndClassNames),
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

                sortString = sortString.concat(`${block}${element}`)
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
                    .filter(value => typeof value === "string")
                    .map((value) => `${utility}${value} `)

            sortString = sortString.concat(
                ...utilityClassesCreatedFromDefinedValuesFromTheUtilityValueMap

            )




        }

    }

    if (classNameMap.customFiltered.size !== 0) {

        for (const filterClassVariantsAndValues of classNameMap.customFiltered.values()) {


            if (!filterClassVariantsAndValues) continue

            for (const [variant, className] of filterClassVariantsAndValues) {


                sortString = sortString.concat(`${variant === "base" ? "" : variant}${className}`)

            }


        }

    }




    return sortString.trimEnd()


}


export const tailwindOrWindiCSSClassFilterAndSorter = (classNames: string) => classFilterAndSorter(classNames, TailwindOrWindiFilterMap)







