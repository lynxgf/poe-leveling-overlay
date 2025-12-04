@echo off
echo ========================================
echo Загрузка проекта на GitHub
echo ========================================
echo.

echo [1/7] Инициализация Git репозитория...
git init
if %errorlevel% neq 0 (
    echo ОШИБКА при инициализации Git
    pause
    exit /b 1
)

echo.
echo [2/7] Добавление файлов...
git add .
if %errorlevel% neq 0 (
    echo ОШИБКА при добавлении файлов
    pause
    exit /b 1
)

echo.
echo [3/7] Проверка настроек Git пользователя...
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo ВНИМАНИЕ: user.name не настроен!
    echo Установите: git config --global user.name "Ваше Имя"
)

git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo ВНИМАНИЕ: user.email не настроен!
    echo Установите: git config --global user.email "ваш@email.com"
)

echo.
echo [4/7] Создание коммита...
git commit -m "Initial commit: PoE Leveling Overlay web version"
if %errorlevel% neq 0 (
    echo ВНИМАНИЕ: Коммит не создан. Возможно, нет изменений или не настроен пользователь Git.
)

echo.
echo [5/7] Настройка удаленного репозитория...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/lynxgf/poe-leveling-overlay.git
if %errorlevel% neq 0 (
    echo ОШИБКА при добавлении удаленного репозитория
    pause
    exit /b 1
)
echo Удаленный репозиторий добавлен

echo.
echo [6/7] Переименование ветки в main...
git branch -M main
if %errorlevel% neq 0 (
    echo ВНИМАНИЕ: Не удалось переименовать ветку
)

echo.
echo [7/7] Загрузка на GitHub...
echo ВНИМАНИЕ: Это может потребовать ввода логина и пароля (Personal Access Token)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo УСПЕХ! Проект загружен на GitHub
    echo ========================================
    echo URL: https://github.com/lynxgf/poe-leveling-overlay
) else (
    echo.
    echo ========================================
    echo ОШИБКА при загрузке
    echo ========================================
    echo Возможные причины:
    echo 1. Необходима аутентификация (Personal Access Token)
    echo 2. Репозиторий уже содержит коммиты
    echo.
    echo Создайте Personal Access Token на GitHub:
    echo https://github.com/settings/tokens
    echo.
)

echo.
pause

