# cn-efs

This library is a library has a set of functions that are created to **Evaluate**,
**Filter** and **Sort** **Class Names**. They are called **class name** evaluate,
filter sorters or `cnEFS`'s.

What each function does is.

1. Evaluate each class name passed to it using `clsx`.
2. Breaks apart and filter each class for duplicates based on convention.
3. Reassemble each of the class that were kept in Step 2.

Each function only works on specific classes.
**If you don't have the correct string then it will be filtered out.**

**Only lowercased words are ignored.**
**Unless** it's not supposed to exist along side of another one.
This is decided by the kind of cnEFS you are using.

## Usage

- BEM, CUBE, Tachyons

```jsx
import { cnEFS } from "@code-fixer-23/cn-efs"

export function ErrorComponent({status}) {
   
  const filteredClasses =  cnEFS(
         "card",
          "card--md",
         "card--lg",
         "bg-primary"
          {
            "bg-red-500": status === "error",
            "bg-blue-500": status === "success",
          }
   )

   return <div className={filteredClasses}>
   { status === "error" && "Error"}
   </div>
    
}

```

`cnEFS()` is a function that will preserve and filter out conflicting.

- BEM  elements and modifiers.
- Tagify classes. `ma5` or `ma6`.
- Classes that include the word `ary`  like this `text-primary` or `text-primary-400`.
- Utility classes that look like this `border-1 border-red border-dashed`.

**Warning** if you are using CUBE CSS convention don't do this.

```astro
---
import {cnEFS} from "@code-fixer-23/cn-efs"

const {class:$class} = Astro.props

---
<div class={cnEFS("[word] [border-1] border-gray-500", $class)}>

</div>

```

**DO this**.

```astro
---
import {cnEFS} from "@code-fixer-23/cn-efs"

const {class:$class} = Astro.props
---
<div class:list={["[word] [border-1]", cnEFS("border-gray-500", $class)]}>

</div>

```

**All the symbols will be filtered out of the string.**

- Bootstrap

```ts
import {bootstrapCN_EFS} from "@code-fixer-23/cn-efs"

@Component({
   template:`
      <div [class]="filteredClasses">
      Hello World
      </div>
   `
})
class HelloWorld {
   
   @Input()
    status = "warning"
 
 filteredClasses = bootstrapCN_EFS(
   "bg-primary",
   this.status === "idle" && "bg-primary-emphasis",
   "text-warning-subtle-hover",
   this.status === "warning" && "text-warning" 
) 

}




```

`bootstrapCN_EFS()` is a function that will preserve and filter out conflicting
classes that abide by the `Bootstrap` CSS Framework.

**Warning If you are using Bootstrap don't add any breakpoints when configuring.**
I tried to make this library work with out this `(?<breakpoint>-(?:sm|md|lg|xl|xxl))`
regex but could not. I know that most people like to stick to the defaults.
This should be a small problem **but if you want to help me please talk to the
bootstrap people or be a part of this [discussion](https://github.com/orgs/twbs/discussions/39338)**.

- Tailwind, Windi  

```vue

<script setup>
import { tailwindOrWindiCN_EFS } from "@code-fixer-23/cn-efs"

const {class:$class} = useAttrs()

const sortedClasses = tailwindOrWindiCN_EFS(
   "border", 
   "border-gray-500", 
   $class
) 
</script>

<template>
<div :class="sortedClasses">
   Hello World
</div>
</template>

```

`tailwindOrWindiCN_EFS()` is a function that will preserve and filter out conflicting
classes that abide by the `Tailwind` and `Windi` CSS Framework.
It filters out conflicts between variants, states and breakpoints for each utility class.
It resolves conflicts between important and not important values.

**Warning** This library solves conflicts between classes that have. l|r|t|b, x|y
But it does not solve `m-` vs any of them to do that you need to remove it and replace it
with `ma` and other classes that use directions as well.

### Sorting

This library will sort your classes based on which type of class
it is or how it was filtered. This is done as a way to support better
debugging. Classes are sorted in this order from left to right.

1. Classes listed in the Filter Object
2. Safe listed
3. BEM
4. Arbitrary Properties
5. Utility Classes

### Limitations

This library can only filter out classes that look identical to each other.
It does not resolve conflicts based on symbols like.

- `[&:focus]:` vs `focus:` arbitrary variant vs regular variant
- `text-gray-500` vs `[color:#6b7280]` utility vs arbitrary property

I have decided to do this because I don't think it's good practice to write utility classes inconsistently.

We also don't have a cache. **When React rerenders all of the work will all be redone again**.
