@echo off
setlocal

echo.
echo ============================================================
echo  API WATCHTOWER - DEVELOPMENT MODE
echo ============================================================
echo.

cd /d "%~dp0.."

echo Instalando dependencias si falta node_modules...
if not exist "node_modules" (
  call npm install
)

echo.
echo Iniciando servidor, frontend y Electron...
echo.

call npm run dev

endlocal
pause