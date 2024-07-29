# cn-efs

This library is a library has a set of functions that are created to **Evaluate**,
**Filter** and **Sort** **Class Names**. They are called **class name** evaluate,
filter sorters or `cnEFS`'s.

```js
  const classes = tailwindOrWindiCN_EFS('border-2 border-6')
  console.log(classes)// output: border-6
  
```

```js
const status = 'warning'

 const classes = cnEFS(
      {
            "bg-red-500": status === "error",
            "bg-green-500": status === "success",
            "bg-yellow-500": status === "warning",
      }
   )
  console.log(classes)// output: "bg-green-500"  
```

What each function does is.

1. Evaluate each class name passed to it using `clsx`.
2. Breaks apart and filter each class for duplicates based on conventions.
3. Reassemble each of the class that were kept in Step 2.
4. Return string with only the classes that were identical but on the right.

Each function only works on specific classes.
**If you don't have the correct string then it will be filtered out.**

**Only lowercased words are ignored.**

**Unless** it's not supposed to exist along side of another one.
This is decided by the kind of cnEFS you are using.

## Sorting

This library will sort your classes based on which type of class
it is or how it was filtered. This is done as a way to support better
debugging. Know that single word classes will always be put before utility ones.

## Usage

The following sections will show you how to use each of the functions.
This is based on what conventions or framework you are using.
When using this library remember to use it on components where you will deal
with conflicting classes.

### BEM, CUBE, Tachyons

```jsx
import { cnEFS } from "@code-fixer-23/cn-efs"

export function ErrorComponent({status}) {
   
  const filteredClasses =  cnEFS(
         "card",
          "card--md",
         "card--lg",
         "bg-primary",
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

### Bootstrap

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

### Tailwind, Windi  

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

## Limitations

This library can only filter out classes that look identical to each other.
It does not resolve conflicts based on symbols like.

- `[&:focus]:` vs `focus:` arbitrary variant vs regular variant
- `text-gray-500` vs `[color:#6b7280]` utility vs arbitrary property.

I have decided to do this because I don't think it's good practice to write utility classes inconsistently.

We also don't have a cache. **When React rerenders all of the work will all be redone again**.

## Comparison

This library is a set of functions that understands different CSS frameworks.
No function in this library is coupled to a specific framework by way of config.
Since this library only sorts and breaks apart strings it should be faster
than it's competitors. **It's an extension of `clsx`**.

**When compared to `tailwind-merge` you don't have to configure it to use objects.
**

It uses the JS `Map` to do filtering and breaks apart strings.
This makes it optimal for most projects.

## Recommendations

I recommend that you also use this library with.

- [Class Variance Authority](https://www.npmjs.com/package/class-variance-authority).
