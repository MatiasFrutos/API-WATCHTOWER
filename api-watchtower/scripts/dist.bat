@echo off
setlocal

echo.
echo ============================================================
echo  API WATCHTOWER - WINDOWS INSTALLER
echo ============================================================
echo.

cd /d "%~dp0.."

if not exist "node_modules" (
  call npm install
)

echo.
echo Generando instalador .exe...
echo.

call npm run dist

echo.
echo ============================================================
echo  Instalador generado en carpeta release
echo ============================================================
echo.

endlocal
pause