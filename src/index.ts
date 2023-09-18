
import { TailwindOrWindiFilterMap } from "./classFilterMaps"
import {
    type ClassNamesMap,
    type ViableClassObjectMapKeys,
    attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged,
    attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged,
    attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged,
} from "./classMapChangers"





export type ClassFilterAndSorter = typeof classFilterAndSorter



function getClassNameMapCreator(classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>) {

    return (carry: ClassNamesMap, value: string) => {




        if (classTypesAndClassNames) {

            attemptToChangeClassNameMapBasedOnTypeOfClassToClassesObjectThenReturnResultOfItHasChanged(
                classTypesAndClassNames,
                carry,
                value
            )

        }



        attemptToChangeUtilityClassBasedOnTheTypeAndValueThenReturnResultOfItHasChanged(carry, value)




        attemptToChangeClassNameMapAccordingToIfTheBEMConventionAndReturnResultOfIfItHasChanged(carry, value)




        return carry


    }
}



export const classFilterAndSorter = (classNames: Array<string>, classTypesAndClassNames?: Record<Lowercase<string>, Array<Lowercase<string>>>) => {


    const classNameMap = classNames
        .reduce(
            getClassNameMapCreator(classTypesAndClassNames),
            new Map<string, string | Map<ViableClassObjectMapKeys, string | undefined> | undefined>()
        )



    return Array.from(classNameMap).map(([key, value]) => {


        if (!value) return ""


        if (typeof value === "string") {

            return value

        }

        let dashedClassName = ""



        if (value.has("digit") || value.has("word") || value.has("color")) {


            const digit = value.get("digit")

            const secondLowerCaseWord = value.get("word")

            const color = value.get("color")


            if (digit) {

                dashedClassName = dashedClassName.concat(`${key}-${digit}`)
            }


            if (secondLowerCaseWord) {

                dashedClassName = dashedClassName.concat(` ${key}-${secondLowerCaseWord}`)

            }


            if (color) {

                dashedClassName = dashedClassName.concat(` ${key}-${color}`)

            }


        }

        return dashedClassName

    }).join(" ")





}


export const tailwindOrWindiCSSClassFilterAndSorter = (classNames: string) => classFilterAndSorter(classNames.split(" "), TailwindOrWindiFilterMap)







