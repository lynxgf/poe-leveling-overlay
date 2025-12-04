# Быстрая загрузка проекта на GitHub

Репозиторий уже создан: **https://github.com/lynxgf/poe-leveling-overlay.git**

## Выполните эти команды в терминале (PowerShell или CMD):

```powershell
# 1. Перейдите в папку проекта
cd C:\Users\LynXGF\Documents\poe2ov

# 2. Инициализируйте Git (если еще не сделано)
git init

# 3. Добавьте все файлы
git add .

# 4. Создайте первый коммит
git commit -m "Initial commit: PoE Leveling Overlay web version"

# 5. Добавьте удаленный репозиторий
git remote add origin https://github.com/lynxgf/poe-leveling-overlay.git

# Если remote уже существует, обновите его:
# git remote set-url origin https://github.com/lynxgf/poe-leveling-overlay.git

# 6. Переименуйте ветку в main
git branch -M main

# 7. Загрузите код на GitHub
git push -u origin main
```

## Если нужна настройка Git пользователя:

```powershell
git config --global user.name "Ваше Имя"
git config --global user.email "ваш.email@example.com"
```

## Если требуется аутентификация:

При `git push` GitHub попросит авторизоваться:

1. **Используйте Personal Access Token** (рекомендуется):
   - Перейдите: https://github.com/settings/tokens
   - Создайте новый token (classic)
   - Выберите scope: `repo`
   - Скопируйте токен
   - При запросе пароля введите этот токен

2. **Или используйте GitHub CLI**:
   ```powershell
   gh auth login
   ```

## Альтернатива: Запустите готовый скрипт

Я создал файл `deploy.bat` - просто запустите его двойным кликом или выполните:

```powershell
.\deploy.bat
```

## Проверка результата

После успешной загрузки откройте:
https://github.com/lynxgf/poe-leveling-overlay

Все файлы должны быть видны в репозитории.

