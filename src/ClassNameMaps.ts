

export const viableUtilityClassMapKeys = ["digit", "word", "color", "variable", "function", "args", "slashValue"] as const

export const viableBEMClassMapKeys = ["element", "modifier"] as const

export type ViableUtilityClassMapKeys = typeof viableUtilityClassMapKeys[number]


type ViableBemClassMapKeys = typeof viableBEMClassMapKeys[number]


type StringOrOmitFromString<T extends string> = T | Omit<string, T>


export class ClassNamesMap {

    public readonly customFiltered: Map<
        string,
        Map<StringOrOmitFromString<"base">,
            string | undefined> | undefined
    > = new Map()
    public readonly safeListed: Array<string> = []
}


export class BEMClassNamesMap extends ClassNamesMap {
    public readonly bem: Map<string, Map<ViableBemClassMapKeys, string | undefined> | undefined> = new Map()
}

export class BaseCN_EFSClassNamesMap extends BEMClassNamesMap {
    public readonly utility: Map<
        string, Map<
            Extract<
                ViableUtilityClassMapKeys,
                "word" | "digit" | "color"
            >,
            string | undefined
        >
        | undefined
    > = new Map()

}



export class BootstrapClassNamesMap extends ClassNamesMap {
    public readonly utility: Map<
        string,
        Map<`${Extract<ViableUtilityClassMapKeys, "word" | "digit">}Map`,
            Map<string, string> | undefined
        > | undefined
    > = new Map()

};

export class TailwindClassNamesMap extends ClassNamesMap {
    public readonly arbitraryProperties: Map<string, Map<StringOrOmitFromString<"base">, string | undefined> | undefined> = new Map()
    public readonly utility: Map<
        string,
        Map<
            ViableUtilityClassMapKeys,
            Map<"prefix" | "value", string> | undefined
        > | undefined
    > = new Map()

}




export type ClassNameMap = Map<
    string,
    Map<
        string | Omit<string, string>,
        string | Map<string, string> | undefined
    >
    | undefined
>;
