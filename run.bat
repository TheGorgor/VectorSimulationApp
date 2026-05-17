@echo off
title Physics Simulation App
cd /d "%~dp0"

if not exist dist (
  echo ERROR: "dist" klasoru bulunamadi. Lutfen once npm run build calistirin.
  pause
  exit /b 1
)

echo Port 8080 kontrol ediliyor...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /C:":8080" ^| findstr /I LISTENING') do (
  echo Port 8080 uzerinde calisan eski islem bulunuyor: %%P
  taskkill /PID %%P /F >nul 2>&1
)

echo Uygulama baslatiliyor...
start "Physics Simulation App" cmd /k "npx http-server dist -p 8080 -o"
exit /b 0
