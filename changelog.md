# 0.8.2 05.09.2019
## Storage
* Export v3: All currently supported timetable settings are being exported.
! Export files v2 and v1 will reset unsupported for the version timetable settings (for v1 it means resetting all the timetable settings)

# 0.8.1 04.09.2019
## Storage
+ Export and import now support multi-week timetables
* Temply now uses export file schema ver. 2
! Old export files are still supported. The timetable length preferences will be reset to 1 week, as it was in earlier versions

# 0.8.0 04.09.2019
## Time Management
+ Multiple weeks support

## General
* Core updated to actual version

# 0.7.5 23.08.2019
## General
* Core updated to actual version
+ Help articles list and search in about menu

# 0.7.4 26.07.2019
## General
* Small fixes

# 0.7.3 23.07.2019
## Navigation
* History API instead of hashes. All old links are broken. That means now Temply uses real URLs.

## General
* New error page

# 0.7.2 22.07.2019
## General
* CoreLoader fixes
* New CoreLoader listener
* Language autoload fix

# 0.7.1 21.07.2019
## General
+ Now you can enable Tasks in experiments
* New way to load app modules

# 0.7.0 15.07.2019
## General
* Full refactoring by splitting code to different parts
- Hidden the tasks module from menu

## Core
+ CoreLoader to control the order of init actions
* main and uiinit now united to the single chunk
* United app init console output
+ Report output without trace

# 0.6.3 27.05.2019
## Core
+ New syntethic test type
+ CSS Animations core
+ Window Transitions: CSS-Powered
+ Window Transitions: No animation
+ Window animation switch in settings

# 0.6.3 26.05.2019
## UI
+ System theme in settings (no selection option instead of showing current theme)
+ Automatic theme switching based on system settings
* Fixed browser color changing when user was switching theme from dark to default
* Removed margin below the app name in About screen
* Fixed mobile-gesture block color in dark theme

# 0.6.2 20.05.2019
## Core
* Code fixes

# 0.6.2 20.05.2019
## UI
* Button fixes

# 0.6.2 18.05.2019
## UI
+ WarningConstructor
+ WarningConstructorButton
* Rewritten all warnings to use WarningConstructor

# 0.6.2 15.05.2019
## UI
* Typo fixes in Ukrainian
* Removed margin for title in mobile-flip container
- MD Icons load from Google Servers (some icons were missing for unknown reason)

# 0.6.2 14.05.2019
## Settings
+ Theme manager
- Dark mode flag

## Core
* New theme loader

## Webpack
+ Theme list generator
+ BG, Main and Accent colors extractor

# 0.6.2 09.05.2019
## UI
+ Theme engine
+ Dark mode in experiments
* Slightly updated design

## Time Management
+ Started tasks development

## Core
+ Date/Time functions

# 0.6.1 02.05.2019
## Core
+ Ukrainian language

# 0.6.1 01.05.2019
## Time Management
+ Remove subject
+ Edit subject

## Settings
* Now timetable related settings are divided
+ Subject list with edit and delete options

# 0.6.0 01.05.2019
## Time Management
+ Record creator and editor
+ Timetable editor

## Core
+ HintsHistory to save a limited amount of data
+ WinRT availability check
+ IDB incompatibility detection
* Report now works on OSTool
+ Time convertors
* Render() ignores null 
* Button now does not require the handler
* Fixed link parse in changelog
* Fixed Prod detection in webpack script

## Language
* Replace library function didn't work correctly

## UI
+ Widget editables
+ Numeric widget input
+ Time widget input
* Fixed switches in Edge
+ Location Chooser
+ Subject Chooser
- Removed updates settings from Edge
* Popup backdrop was above the popup in Safari
+ Prompt object
+ Preloader styling
+ CardList class support

## DB
+ User Interactions presence
+ GetAll polyfill

# 0.5.1 26.04.2019
## Core
+ getWhere for OSTool
+ Dynamic property setter
* DB User Presence in settings now warns about cleanup status

## UI
+ ContentEditable widgets
+ HTML Input
+ Big number input widget

# 0.5.1 19.04.2019
## Core
+ Detailed startup log
+ Recovery mode on #recoveryMode hash
* ObjectStore params support in proxy
* Async SettingsLayout loader

## DOM
* Fix generation from HTML code

## UI
+ Experimental iOS splash screen support

# 0.5.1 17.04.2019
## Core
+ IDB Range generator
+ IDB Cursor creator
* Event params weren't applied
* Rewritten navigation

## UI
* Now toasts and swipe-up menus feel smoother

# 0.5.0 16.04.2019
## UI
+ Generic context menus
+ Empty icon on null
+ Mobile swipe-up main menu
+ Right-click main menu in compact layout

## General
* Typo fixes

## Core
+ Get float automatically from CSS vars
+ Get distance between elements (unused)
* CamelCase reversion
+ RegExp escaper
+ Rgba alpha modifier (unused)

## DOM
* "Params" in DOM's emitEvent method now defaults to {}
+ Set DOM Events listeners
* Changed the way style applicators work
+ Important tag support in style applicators
+ Set events modificator

# 0.4.2 12.04.2019
## UI
- Removed card border
+ Added additional shadow
This is in order to fix Chrome's weird rendering bug

## Building
* Fixed bugs in changelog generation

# 0.4.2 12.04.2019
## Items
* Fixed linebreaks in inputs
+ Context menu

## UI
+ Now menu button works
+ Empty Icon on null
+ Change event type trigger for buttons

## Core
+ PointerInfo contextmenu listening
- Disabled back/forward rendering optimisation since it made more bugs rather profits
+ Contains DOM modifier
+ DestructSelf modifier
+ Catching support in EventSetter

## Animations
+ Added cubicBeier timing

# 0.4.2 01.04.2019
## Inputs
+ Content editables
+ File inputs
+ Option selectors
* Preloader color replacement

## Core
* Fixed various typos

# 0.4.2 26.03.2019
## Look and feel
* Skip assets loading if update settings fail
+ New SlideIn/Out effect
* Smoother animations

## Core
* MS Edge DB-related fixes
+ OnRendered listener
+ Add listeners by modificators

## Settings
+ Language settings
+ Storage settings

# 0.4.2 25.03.2019
## Look and feel
+ Columns
+ Animations core
* App screen change transition
* Promise-based animation callback

## Core
+ Languages (+ Russian)
+ Changelog in About screen
* Updated dependencies (idb v4, etc.)
+ New modificators

## Elements
+ Radios
+ SVG Preloader
+ Button ripples
+ Toasts


# 0.4.1 19.03.2019
## General
+ Update notifications
+ Toasts and toasts queue
+ Animation engine
+ Window change transition
+ Changelog in /about screen

# 0.4.0 11.03.2019
## General
+ App changelog generation
+ Last version changelog loading for update popup