@echo off
title Push Locanear to GitHub
echo ========================================================
echo   Mengunggah Locanear (Web + iOS) ke GitHub pradzy77
echo ========================================================
echo.
cd /d "%~dp0"
"C:\Users\ASUS\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  BERHASIL! Project telah terunggah ke GitHub.
    echo  Kunjungi: https://github.com/pradzy77/Locanear/actions
    echo  untuk memantau proses build otomatis aplikasi iOS.
    echo ========================================================
) else (
    echo [Perhatian] Jika diminta login, silakan ikuti petunjuk login browser di layar.
)
echo.
pause
