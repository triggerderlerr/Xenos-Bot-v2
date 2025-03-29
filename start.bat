@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo Kontrol ediliyor...
if not exist "node_modules" (
    echo Modüller bulunamadı, yükleniyor...
    npm install >nul 2>&1
    echo Modüller yüklendi, panel yeniden açılıyor...
    start cmd /k "node shard.js"
    exit
) else (
    echo Modüller: Yüklü.
)
cmd /k "node shard.js"
pause
