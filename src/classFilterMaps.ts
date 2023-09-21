


export type FilterMap = Record<Lowercase<string>, Array<Lowercase<string>>>;

export const TailwindOrWindiFilterMap = {
    grayscale: ["grayscale-0", "grayscale"],
    invert: ["invert-0", "invert"],
    layout: ["flex", "grid",],
    line: ["block", "inline", "inline-block"],
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
    appearance: ["appearance-none"],
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
    visibility: ["visible", "invisible", "collapse"],
} satisfies FilterMap

