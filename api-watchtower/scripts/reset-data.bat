@echo off
setlocal

echo.
echo ============================================================
echo  API WATCHTOWER - RESET LOCAL DATA
echo ============================================================
echo.

cd /d "%~dp0.."

echo Reiniciando archivos JSON locales...

echo []> apps\server\data\projects.json
echo []> apps\server\data\endpoints.json
echo []> apps\server\data\history.json
echo { "theme": "dark", "timeout": 30000 } > apps\server\data\settings.json

echo.
echo Data local reiniciada.
echo.

endlocal
pause