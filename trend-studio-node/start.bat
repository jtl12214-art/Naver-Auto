@echo off
setlocal
title NAVER Trend Studio - Development Server

echo ===================================================
echo        NAVER Trend Studio - Launcher
echo ===================================================
echo.

cd /d "%~dp0"

if not exist "package.json" (
    echo [ERROR] package.json not found in current directory.
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [1/3] Checking Node.js environment...
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo [INFO] Dependencies not found. Running npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [3/3] Starting development servers...
echo       - Frontend: http://localhost:5173
echo       - Backend:  http://127.0.0.1:3001
echo.

:: Pre-flight port conflict check
netstat -ano | findstr /R /C:":3001 .*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 3001 is already occupied by another process.
    echo [INFO] If a previous server is already running, it will continue to be used.
)

echo [INFO] A browser window will automatically open once servers are ready.
echo [INFO] Press Ctrl+C in this window to stop the servers.
echo ===================================================
echo.

:: Launch health checker in background to auto-open browser when ready
start "" node scripts/health-check.js --open

:: Run frontend and backend concurrently in this window
call npm run dev

if errorlevel 1 (
    echo.
    echo ===================================================
    echo [ERROR] Development server terminated unexpectedly.
    echo ===================================================
    pause
)

endlocal
