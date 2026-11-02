@echo off
setlocal
cd /d "%~dp0trend-studio-node"
if not exist "start.bat" (
    echo [ERROR] trend-studio-node/start.bat not found.
    pause
    exit /b 1
)
call start.bat
endlocal
