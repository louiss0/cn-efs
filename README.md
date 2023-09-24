# class-names-sorters-and-filters

This library is a library that tries to sort and filter duplicate class names in
a class. It split's the class string stores them in Maps that contain information
about each class.
If two classes are have identical information the the class that came after will
have it's information stored where the information about the previous one was.
This way the class names are both sorted and filtered. by the class name sorter.
The information that is stored in the class map is based on conventions that exist
in TailwindCSS UnoCSS and BEM.

**This means you don't need tailwind as a dependency to use this library.**

## Installation

```shell
    npm i  @code-fixer-23/class-names-sorters-and-filters
```

To use this library you need to think about what framework you are using

- Tailwind or Windi CSS

```js
import {tailwindOrWindiCSSClassNamesSorterAndFilter} from "@code-fixer-23/class-names-sorters-and-filters"

tailwindOrWindiCSSClassNamesSorterAndFilter("bg-gray-500 bg-gray-700")

```

- BEM

```js
import {classNamesSorterAndFilter} from "@code-fixer-23/class-names-sorters-and-filters"

classNamesSorterAndFilter("card card--md card--lg") 
```

## Guide

When using the class name filter and sorter by default it will support the class names that are written
using Both Tailwind and Windi CSS conventions. The reason why we have a tailwind version is to resolve.
**Single word class** conflicts or most conflicts not resolved by the basic sorting functions.
There are times where a set of classes can only be used once per set of class names.
When this is the case you can tell the `classNamesSorterAndFilter()` what type of classes you want
to appear once and a list of the classes that must appear once. This is called the **Class Filter Map**.

When it comes to using this library we support.

- utility (type-value)

```txt
    opacity-50
    
    border-1 
    
    border-[2rem] 
    
    border-solid

    border-gray-500

    bg-[url(/flower.jpg)]

    outline-[color:--primary-color]
    
    text-[length:--step-0]

    outline-[string:--outline-type]

```

- utility (type-subtype-value)

```txt
    grid-cols-50
    
    grid-cols-[5rem_15rem_repeat(1,fr)]
```

- variants

```txt
     md:block

     [&:is(:hover,:focus)]:text-gray-900
     
     [&:nth-child(3)]:bg-red-950
```

- variant groups

```txt
   hover:(text-gray-500 focus:bg-gray-600) 
```

- relational classes

```txt
    group-hover:text-gray-700

    peer-checked:bg-gray-900 

    peer-invalid:visible

    group-[.is-published]:block 

    @container/main

    @lg:text-sky-400
```

### The Filter Map

The filter Map is a Map that is used to tell the sorter that if a class name is the same kind as
another class; then please replace that one with the one that comes later in the series of class names.
The way do do this is by creating an object with lowercase keys and Array's of class names.
The key in is used to store one of the utilities that is found one as it's values in a map.

This is how you create a filter map.

```ts
   { position: ["fixed", "static", "relative", "sticky","absolute"] } 
```

This is how you use the filter map.

```ts
    classNamesSorterAndFilter(
    "fixed absolute", 
    { position: ["fixed", "static", "relative", "sticky","absolute"]}
   )
```

### Safe Listing

A safe list is a list of classes that must be ignored.
The `classNamesSortersAndFilters` function will throw and error if duplicates are written in the class string.
The class names that are written in the class string are always going to appear first when sorted.

### Limitations

This library can only filter out classes that look identical to each other.
It does not resolve conflicts based on symbols like.

- `[&:focus]:` vs `focus:` arbitrary variant vs regular variant
- `text-gray-500` vs `[color:#6b7280]` utility vs arbitrary property

I have decided to do this because I don't think it's good practice to write utility classes inconsistently.

We also don't have a cache. **When React rerenders all of the work will all be redone again**.
