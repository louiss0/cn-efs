# Class Names - Evaluator Filter Sorter

This library is one that was created to have a set of functions that
are good at removing duplicate class names based on the class name that is
being used. It does this in a series of steps.

This is how things would work if this series of classes were passed in.

```ts
 const status = 'red'

  cnEFS(
    'border-blue-500',  
    status === 'red' && 'border-red-500',
   'border-2'
   status === 'red' && 'border-4',
   'border-dotted',
   status === 'red' && 'border-solid',   
  )
```

1. **Evaluate** classes using `clsx`.

```ts
//  clsx output
 ['border-blue-500', 'border-red-500', 'border-2', 'border-4', 'border-dotted', 'border-solid'] 
```

1. **Filter** and **sort** classes based on duplicates with last being one being created.

```ts
//  cnEFS filtering and sorting output
 ['border-4','border-solid','border-red-500', ] 
```

1. Create new string from there.

```ts
//  cnEFS final output
 'border-4 border-solid border-red-500' 
```

## Theory

The way this works is that it tries to find out what type of classes you are using.
Then it stores it's **name** in a map with it's **value type**  when a similar class comes along it then replaces
it's **value type** with one that is appropriate.

This library supports many different class types. The most common being

Single word

```txt
   group
```

Type-value and  type-subtype-value

```txt
type    value
border- solid

type    subtype value 
scroll-  p-     0
    
```

Block Element Modifier

```txt
block  element
card   __stat

block  element modifier 
card   __stat   --1
```

### Single Word Classes

When it comes to sorting no matter which framework you are using single
word classes will always be come before any other classes. This is strange
but sorting and filtering are linked because of the nature of storage.
**Single word classes are always the most important ones** so they should go first.

When it comes to single word classes there are two kinds.

- Framework based
- Non framework based

**Framework based** classes are filtered are based on the function that is built for that library.
Let's say that `relative` and `absolute` are conflicting with each other but we are using
`windiCN_EFS()` then which ever one came last will be preserved. This is done
because windi-cn-efs knows that `absolute` and `relative` are associated with the `position`
property. This type of relationship is expressed with something called a **filter object**.
This object is one that knows which classes need to be replaced with the other.
The key is **kind** of class the value is the set of classes associated with that **kind**.

**Non framework based** single word classes are assumed to be needed by the developer.
This means that they will not be filtered through at all. Instead they will be left alone.
When using `windiCN_EFS()` it will always be replaced with a version of the same class
with a that is a **type-value** or **type-subtype-value** and the reverse will happen as well.

## Usage

Each function is tailored to a specific framework.

- `cnEFS()` can deal with tagify, type-value and type-subtype-value classes.
- `bootstrapCN_EFS()` can deal with bem, **bootstrap-based** type-value, and type-subtype-value classes.
- `windiCN_EFS()` can only deal with these tailwind/windi-based classes.
  - type-value
  - type-subtype-value
  - arbitrary properties.
  - variant
  - variant-groups

```ts
  import {windiCN_EFS} from "@code-fixer/cn-efs"

   const fixedClasses = windiCN_EFS(
    {
      'border-red-500': false,
      'border-blue-500': true,
      'border-green-500': false,
    }
   )
```

```ts
  import {cnEFS} from "@code-fixer/cn-efs"

   const fixedClasses = cnEFS(
    {
      'bg-red-500': false,
      'bg-blue-500': true,
      'bg-green-500': true,
      'ma-2': true, 
      'mr-4': true, 
    }
   )
```

## Recommendations

This library can be used alongside.

[Class Variance Authority](https://cva.style/docs/getting-started/installation)

For most CSS frameworks `cnEFS()` is the recommended solution.
For Tailwind Windi and most UnoCSS frameworks `windiCN_EFS()` is the one.
