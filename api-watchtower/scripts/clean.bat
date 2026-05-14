@echo off
setlocal

echo.
echo ============================================================
echo  API WATCHTOWER - CLEAN
echo ============================================================
echo.

cd /d "%~dp0.."

echo Eliminando builds...
if exist "release" rmdir /s /q "release"
if exist "apps\desktop\dist" rmdir /s /q "apps\desktop\dist"
if exist ".vite" rmdir /s /q ".vite"

echo.
echo Limpieza finalizada.
echo.

endlocal
pause