@echo off
:: Simple tee equivalent for Windows batch
:: Usage: command | tee.bat output.txt
:: Or:     command | tee.bat -a output.txt (for append)

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: %0 [-a] output_file
    exit /b 1
)

set "append="
set "output_file="

if "%1"=="-a" (
    set "append=1"
    set "output_file=%2"
) else (
    set "output_file=%1"
)

if "%output_file%"=="" (
    echo Error: No output file specified
    exit /b 1
)

:: Create a temporary file to store the output
set "temp_file=%temp%\tee_temp_%random%.txt"

:: Read from stdin and write to both stdout and the output file
:read_loop
set "line="
set /p line=
if errorlevel 1 goto end_loop

echo !line!
if defined append (
    echo !line! >> "%output_file%"
) else (
    echo !line! > "%output_file%"
)

goto read_loop

:end_loop
del "%temp_file%" 2>nul