# Changelog

## [Unreleased]

## [2.1.0] - 2023-11-10

### Fixed

- The `!-` prefix is now taken account as a prefix that is taken into account.
- `tailwindCN_EFS()` no longer removes all classes with an identical type when
a class with directional part that is similar to a specific class type.

### Changed

- `tailwindCN_EFS()` removes identical variants from classes.

## [2.0.0] - 2023-11-05

## Added

- Created the function `cnEFS()`
- Created the function `bootstrapCN_EFS()`

## Changed

- `tailwindOrWindiCN_EFS()` now resolves conflicts between classes that use l|t|b|e|r|s.
- `tailwindOrWindiCN_EFS()` now resolves conflicts between classes that have the same type
but different subtype.
- Hide the Api's for users to create their own CN_EFS implementations.

## [1.1.1] - 2023-10-20

### Fixed

- classes with underscores and commas were filtered out.

## [1.1.0] - 2023-10-12

### Changed

- Made the names shorter for class name evaluators and sorters to align with library theme.

### Removed

- file for filter objects

## [1.0.0] - 2023-09-27

Initial release.

### Added

- Sorting and Filtering
  - BEM Elements and modifiers
  - Tailwind and Windi CSS classes
  
- Generic class names sorter and filter
- Tailwind or Windi CSS sorter and filter

## [0.0.0]

No release.
