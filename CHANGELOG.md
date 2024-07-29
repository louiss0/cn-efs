<!-- markdownlint-disable-file MD024 a changelog must have multiple headings -->

# Legacy Changelog

## [Unreleased]

### Changed

- Release It is now configured to run build before bump.

## [legacy--v3.0.0-beta.1] - 2024-07-29

### Fixed

- a one decimal that allows only up to four numbers after it is allowed to be a viable number
- create named groups for properCSSDigitRE Regex to make it work as expected.
- make the word px into a viable digit.
- reimplement tagify utility regex inside attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue
- use regex specifically made for attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass.
  implement deletion of direction based classes based on in attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue
- make attemptToChangeClassMapIfAClassIsASingleWordClass add a class to the list if the class isn't in the list.
- make attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass change classes properly.
- comment out safe listing logic for classes
- resolve conflict between single word and utility classes
- add attemptToChangeClassMapIfAClassIsASingleWordClassATailwindAliasClass to tailwindCN_EFS

### Added

- implement deletion of direction based classes based on in attemptToChangeClassMapBasedOnIfItIsATypicalUtilityClassTypeAndValue

### Changed

- Change tailwindOrWindiCN_EFS to windiCN_EFS.

## [2.2.4] - 2023-11-24

### Fixed

- All possible variants are now detected when using `windiCN_EFS()`.

## [2.2.3] - 2023-11-19

### Fixed

- Remove filtering of classes based on different directions.

## [2.2.2] - 2023-11-16

### Changed

- `CN_EFS` functions no longer reinitialise getClassNamesEvaluatorFilterAndSorter.
instead they are created from it's resulting call.
- The error for checking if a class is more then one string is moved to the
returned function of getClassNamesEvaluatorFilterAndSorter

## [2.2.1] - 2023-11-15

### Fixed

- I finally added the repo to the package.json file.
- Removed all wrong info from ReadME.

## [2.2.0] - 2023-11-15

### Added

- `tailwindCN_EFS` can now resolve classes like  `text-sm leading-6 text-lg/6`.

### Fixed

- All possible tailwind directional class parts are accounted for in the
`attemptToDeleteKeysInTheTailwindUtilityClassMapWhenAClassThatHasDirectionPartsIsFoundAndASimilarClassIsFound()`

- Make sure that empty maps in `tailwindCN_EFS()` don't have their keys used when transforming.

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

- `windiCN_EFS()` now resolves conflicts between classes that use l|t|b|e|r|s.
- `windiCN_EFS()` now resolves conflicts between classes that have the same type
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
