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

```js
import {cnEFS} from "@code-fixer-23/cn-efs"

cnEFS("card card--md card--lg") 
```

- Bootstrap

```js
import {bootstrapCN_EFS} from "@code-fixer-23/cn-efs"

bootstrapCN_EFS("bg-primary bg-primary-emphasis text-warning-subtle-hover text-warning-hover") 
```

**Warning If you are using Bootstrap don't add any breakpoints when configuring.**
I tried to make this library work with out this `(?<breakpoint>-(?:sm|md|lg|xl|xxl))`
regex but could not. I know that most people like to stick to the defaults.
This should be a small problem **but if you want to help me please talk to the
bootstrap people or be a part of this [discussion](https://github.com/orgs/twbs/discussions/39338)**.

- Tailwind, Windi  

```js
import { tailwindOrWindiCN_EFS } from "@code-fixer-23/cn-efs"

tailwindOrWindiCN_EFS("border border-gray-500 border-gray-700") 
```


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
