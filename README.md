# cn-efs

The name `cn-efs` stands for **c**lass**n**ame **e**valuator **f**ilter and **s**orters.
This library is a set of functions that uses the `clsx` library
to evaluate arguments that evaluate to strings.
After that it filters out duplicates classes based on their structure.
Then the classes are sorted based on the kind of class it is.
How by looking at the shape of the class. It tries to handle classes
based on the way it is written. Using conventions like BEM, Tailwind and
WindiCSS. For more info check out the [guide](#guide).

## Installation

```shell
    npm i @code-fixer-23/cn-efs
```

To use this library you need to think about what framework you are using.

- Tailwind or Windi CSS

```js
import {tailwindOrWindi_CN_EFS} from "@code-fixer-23/cn-efs"

tailwindOrWindi_CN_EFS("bg-gray-500 bg-gray-700")

```

- BEM

```js
import {classNamesEvaluatorFilterAndSorter} from "@code-fixer-23/cn-efs"

classNamesEvaluatorFilterAndSorter("card card--md card--lg") 
```

- Bootstrap

```js
import {classNamesEvaluatorFilterAndSorter} from "@code-fixer-23/cn-efs"

classNamesEvaluatorFilterAndSorter("card card--md card--lg") 
```

**Warning If you are using Bootstrap don't add any breakpoints when configuring.**
I tried to make this library work with out this `(?<breakpoint>-(?:sm|md|lg|xl|xxl))`
regex but could not. I know that most people like to stick to the defaults.
This should be a small problem **but if you want to help me please talk to the
bootstrap people or be a part of this [discussion](https://github.com/orgs/twbs/discussions/39338)**.

## Guide

This library works by first checking if all the classes passed to it are truthy by using.
`clsx` then it will filter all the classes based on their structure.
It does this filtering checking the structure of the class and placing it in a map based on it's structure.
It knows what to do based on what kind of class is written. Utility classes are usually written like these.

```txt
    <!-- Digit -->
    
     border-1 
    
     border-[2rem] 
    
    <!-- Word -->
    
     border-solid
    
    <!-- Color -->

     border-gray-500

     border-[hsla(25,50%,90%,.5)]

    <!-- Arguments -->
    
     grid-cols-[5rem_15rem_repeat(1,fr)]

    <!-- (Non-color) Functions -->
    
     grid-cols-[repeat(auto-fill, minmax(384px, 1fr))]


    <!-- Class With prefix -->

     !px-2

     -top-4

    <!-- Variables -->

     grid-cols-[--_auto-fill-1]

     outline-[color:--primary-color]
    
     text-[length:--step-0]

     outline-[string:--outline-type]

    <!-- Variants -->

     md:block

     [&:is(:hover,:focus)]:text-gray-900
     
     [&:nth-child(3)]:bg-red-950

     hover:(text-gray-500 focus:bg-gray-600)
     
     <!-- Arbitrary Properties -->

     [font-size:4rem]
     
     hover:[background-color:#FFF924]

     <!-- Block Element and Modifier -->

     card 
     
     card--lg

     card__image


```

It two utility classes are in the same category then the last one
always wins. **Prefixes don't matter.**. When it comes to variants
if two classes have the same **variant type and category** the last one will win. When it comes to variables the normally if two utility classes
have the same variant and type the variable will be replaced with a different one. If a variable is hinted then it will replace a class
depending on the hint.

- `string:` replaces a class in the word category.
- `color:` replaces a class in the color category.
- `length:` replaces a class in the digit category.

When it comes to BEM classes it interacts tries to replace the class depending on if it's a block or modifier class.

- **modifier** it checks if the block is there if not when two classes conflict the last one wins else an error is thrown
- **element** it will just remove duplicate elements based even ones with that are different.

When it comes to variant groups they will be turned into their
long hand forms.

This

```txt
hover:(text-gray-500 bg-gray-500)
```

Will turn into.

```txt
hover:text-gray-500 hover:bg-gray-500
```

For classes with only one word there is no way to tell what to
do with them at all those classes have to be put in categories so
that the class name filter and sorter can tell what class to replace
with what. This is where the [Filter Object](#the-filter-object) comes in.
It's an object that allows you to define class lists and associate that with a name. When filtering the name will be used to determine if one
of the classes listed will be removed for a different one when filtering.

### The Filter Object

The filter object is a object literal that is used to tell the sorter that if a class name is the same kind as
another class; then please replace that one with the one that comes later in the series of class names.
The way do do this is by creating an object with lowercase keys and Array's of class names.
The key in is used to store one of the utilities that is found one as it's values in a map.

This is how you create a filter object.

```ts
   { position: ["fixed", "static", "relative", "sticky","absolute"] } 
```

This is how you use the filter map.

```ts
  const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter(
        {
           filterObject: { 
            position: ["fixed", "static", "relative", "sticky","absolute"]
            }

        } 
   )
```

### Safe Listing

A safe list is a list of classes that must be ignored.
The `classNamesSortersAndFilters` function will throw and error if duplicates are written in the class string.
The class names that are written in the class string are always going to appear first when sorted.

Passing in a safe list

```ts
  const classNamesEvaluatorFilterAndSorter = getClassNamesEvaluatorFilterAndSorter(
        {
           safelist: ["card", "article", "footer"]
        } 
   )
```

### Sorting

This library will sort your classes based on which type of class
it is or how it was filtered. This is done as a way to support better
debugging. Classes are sorted in this order from left to right.

1. Safe listed
2. BEM
3. Arbitrary Properties
4. Utility Classes
5. Classes listed in the Filter Object

### Limitations

This library can only filter out classes that look identical to each other.
It does not resolve conflicts based on symbols like.

- `[&:focus]:` vs `focus:` arbitrary variant vs regular variant
- `text-gray-500` vs `[color:#6b7280]` utility vs arbitrary property

I have decided to do this because I don't think it's good practice to write utility classes inconsistently.

We also don't have a cache. **When React rerenders all of the work will all be redone again**.
