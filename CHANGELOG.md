# Changelog

## [1.2.0] - 2023-02-04

### Breaking changes
- FsFx will no longer set the styling of fullscreen buttons to `display: inline-block` because that relies on the user setting `display:none` in their CSS, for buttons in unsupported browsers. A compatibilitymode is added.

### Added
- Added auto-mode
	- Includes a predesigned fullscreen icon.
	- Has a user-definable color and opposite color
	- Has user-definable position


## [1.1.5] - 2022-10-19

### Changed
- Changed the way of how unsupported fullscreen buttons are hidden.


## [1.1.5] - 2022-10-14

### Fixed
- JS code fix


## [1.1.4] - 2022-10-09

### Fixed
- Insert CSS rule as a style tag for filesystem presentations on Chrome.


## [1.1.3] - 2022-10-07

### Changed
- Insert CSS rule to fix fullscreen background color in presentations that have no specific background set.


## [1.1.2] - 2021-12-10

### Changed
- Update Screenfull to 2.0.11


## [1.1.1] - 2021-12-10

### Added
- Started keeping the changelog.

### Changed
- Import Screenfull, remove script
- Add class no-fsfx to body if device not supported
- Minify code


## [1.1.0] - 2021-12-10

### Changed
- Change Screenfull check
- Change FS button display


## [1.0.9] - 2020-05-31

### Changed
- This version fixes a bug, and has some code optimisations.



## [1.0.8] - 2020-05-22

### Changed
- Compatibility with Reveal.js 4


## [1.0.7] - 2020-05-22

### Changed
- First GitHub commit
- Fix Screenfull enabled issue


## [1.0.6] - 2019-09-08

### Added
- Added "go-next" functionality

