


export type FilterMap = Record<Lowercase<string>, Array<Lowercase<string>>>;

export const TailwindOrWindiFilterMap = {
    grayscale: ["grayscale-0", "grayscale"],
    invert: ["invert-0", "invert"],
    layout: ["flex", "grid",],
    line: ["block", "inline", "inline-block"],
    position: ["absolute", "fixed", "static", "relative", "sticky"],
    sepia: ["sepia-0", "sepia"],
    smoothing: ["antialiased", "subpixels-antialiased"],
    visibility: ["visible", "invisible", "collapse"],
} satisfies FilterMap

