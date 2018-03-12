@echo off &setlocal
setlocal enabledelayedexpansion

set "search=    amp(volume: number|object, rampTime?: number, timeFromNow?: number): void"
set "replace=    amp(volume: number|object, rampTime?: number, timeFromNow?: number): AudioParam"
set "textfile=%~dp0node_modules\p5\lib\p5.d.ts"
set "newfile=%~dp0node_modules\p5\lib\p5_1.d.ts"
(for /f "delims=" %%i in (%textfile%) do (
    set "line=%%i"
    set "line=!line:%search%=%replace%!"
    echo(!line!
))>"%newfile%"
del %textfile%
rename %newfile%  p5.d.ts
endlocal
