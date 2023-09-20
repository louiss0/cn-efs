
import { TailwindOrWindiFilterMap } from "./classFilterMaps"
import {
    SortedClasses,
    attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged,
    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapAccordingToIfTheClassISAnArbitraryProperty,
} from "./classMapChangers"





export type ClassFilterAndSorter = typeof classFilterAndSorter



function getClassNameMapCreator(classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>) {

    return (carry: SortedClasses, value: string) => {




        if (classTypesAndClassNames) {

            attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged(
                classTypesAndClassNames,
                carry.customFiltered,
                value
            )

        }



        attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(carry.utility, value)




        attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(carry.bem, value)


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



            sortString = sortString.concat(
                `${utility}-${utilityValueMap?.get("digit") ?? ""} `,
                `${utility}-${utilityValueMap?.get("word") ?? ""} `,
                `${utility}-${utilityValueMap?.get("color") ?? ""} `,
                `${utility}-${utilityValueMap?.get("function") ?? ""} `,
                `${utility}-${utilityValueMap?.get("variable") ?? ""} `,
                `${utility}-${utilityValueMap?.get("args") ?? ""} `,
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




    return sortString


}


export const tailwindOrWindiCSSClassFilterAndSorter = (classNames: string) => classFilterAndSorter(classNames, TailwindOrWindiFilterMap)







