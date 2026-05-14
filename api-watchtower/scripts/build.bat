@echo off
setlocal

echo.
echo ============================================================
echo  API WATCHTOWER - BUILD FRONTEND
echo ============================================================
echo.

cd /d "%~dp0.."

if not exist "node_modules" (
  call npm install
)

echo.
echo Compilando frontend...
echo.

call npm run build

echo.
echo Build finalizado.
echo.

endlocal
pause