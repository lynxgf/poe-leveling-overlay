# Скрипт для загрузки проекта на GitHub
# Репозиторий: https://github.com/lynxgf/poe-leveling-overlay.git

Write-Host "=== Загрузка проекта на GitHub ===" -ForegroundColor Green
Write-Host ""

# Проверка, инициализирован ли Git
Write-Host "1. Проверка Git репозитория..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    Write-Host "   Инициализация Git репозитория..." -ForegroundColor Cyan
    git init
} else {
    Write-Host "   Git репозиторий уже инициализирован" -ForegroundColor Green
}

# Проверка настроек пользователя Git
Write-Host ""
Write-Host "2. Проверка настроек Git пользователя..." -ForegroundColor Yellow
$userName = git config user.name
$userEmail = git config user.email

if ([string]::IsNullOrWhiteSpace($userName)) {
    Write-Host "   ВНИМАНИЕ: user.name не настроен!" -ForegroundColor Red
    Write-Host "   Выполните: git config --global user.name 'Ваше Имя'" -ForegroundColor Yellow
} else {
    Write-Host "   user.name: $userName" -ForegroundColor Green
}

if ([string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "   ВНИМАНИЕ: user.email не настроен!" -ForegroundColor Red
    Write-Host "   Выполните: git config --global user.email 'ваш@email.com'" -ForegroundColor Yellow
} else {
    Write-Host "   user.email: $userEmail" -ForegroundColor Green
}

# Добавление файлов
Write-Host ""
Write-Host "3. Добавление файлов в staging area..." -ForegroundColor Yellow
git add .
$status = git status --short
if ($status) {
    Write-Host "   Файлы добавлены:" -ForegroundColor Green
    Write-Host $status
} else {
    Write-Host "   Нет изменений для коммита" -ForegroundColor Cyan
}

# Создание коммита
Write-Host ""
Write-Host "4. Создание коммита..." -ForegroundColor Yellow
$commitOutput = git commit -m "Initial commit: PoE Leveling Overlay web version" 2>&1
Write-Host $commitOutput

# Проверка remote
Write-Host ""
Write-Host "5. Проверка удаленного репозитория..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Добавление удаленного репозитория..." -ForegroundColor Cyan
    git remote add origin https://github.com/lynxgf/poe-leveling-overlay.git
    Write-Host "   ✓ Удаленный репозиторий добавлен" -ForegroundColor Green
} else {
    Write-Host "   Удаленный репозиторий: $remote" -ForegroundColor Green
    # Проверяем, правильный ли URL
    if ($remote -ne "https://github.com/lynxgf/poe-leveling-overlay.git") {
        Write-Host "   Обновление URL удаленного репозитория..." -ForegroundColor Cyan
        git remote set-url origin https://github.com/lynxgf/poe-leveling-overlay.git
    }
}

# Переименование ветки в main
Write-Host ""
Write-Host "6. Переименование ветки в main..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    git branch -M main
    Write-Host "   Ветка переименована в main" -ForegroundColor Green
} else {
    Write-Host "   Ветка уже называется main" -ForegroundColor Green
}

# Загрузка на GitHub
Write-Host ""
Write-Host "7. Загрузка кода на GitHub..." -ForegroundColor Yellow
Write-Host "   Это может потребовать аутентификации." -ForegroundColor Cyan
Write-Host ""
$pushOutput = git push -u origin main 2>&1
Write-Host $pushOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== ✓ Проект успешно загружен на GitHub! ===" -ForegroundColor Green
    Write-Host "   URL: https://github.com/lynxgf/poe-leveling-overlay" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "=== ✗ Ошибка при загрузке ===" -ForegroundColor Red
    Write-Host "   Возможные причины:" -ForegroundColor Yellow
    Write-Host "   1. Необходима аутентификация (Personal Access Token)" -ForegroundColor Yellow
    Write-Host "   2. Репозиторий уже содержит коммиты" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Попробуйте:" -ForegroundColor Cyan
    Write-Host "   git push -u origin main --force" -ForegroundColor White
}

Write-Host ""

