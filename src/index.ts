
import { TailwindOrWindiFilterMap } from "./classFilterMaps"
import {
    SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConvention,
    attemptToChangeUtilityClassBasedOnTheTypeAndValue,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObject,
    attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty,
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



        attemptToChangeUtilityClassBasedOnTheTypeAndValue(carry.utility, value)




        attemptToChangeClassNameMapAccordingToIfTheBEMConvention(carry.bem, value, array)


        attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty(carry.arbitraryProperties, value)


        return carry


    }
}



const moreThanOneSpaceRE = /\s+/

export const classFilterAndSorter = (classNames: string, classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>) => {


    const splitClassNames = classNames.split(moreThanOneSpaceRE)

    if (splitClassNames.length === 0) {

        throw new Error(
            "This string has no sets of classes please add spaces between classes that need to be sorted",
        )

    }


    const classNameMap =
        splitClassNames.reduce(
            getClassNameMapCreator(classTypesAndClassNames),
            new SortedClasses()
        )




    let sortString = ""



    if (classNameMap.bem.size !== 0) {

        for (const [block, value] of classNameMap.bem) {


            sortString = sortString.concat(
                `${block}${value?.get("modifier") ?? ""} `,
                `${block}${value?.get("element") ?? ""} `
            )


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
                    .map((value) => `${utility}-${value} `)

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







