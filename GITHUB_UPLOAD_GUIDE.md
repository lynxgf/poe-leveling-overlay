# Инструкция по загрузке проекта на GitHub

## Шаг 1: Настройка Git (если еще не настроено)

Если вы еще не настроили Git, выполните следующие команды (замените на свои данные):

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш.email@example.com"
```

## Шаг 2: Локальный репозиторий (уже выполнено)

✅ Git репозиторий уже инициализирован
✅ Файлы добавлены в staging area
✅ Первый коммит создан (или нужно создать)

Если коммит еще не создан, выполните:

```bash
git add .
git commit -m "Initial commit: PoE Leveling Overlay web version"
```

## Шаг 3: Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com) и войдите в свой аккаунт
2. Нажмите на кнопку **"+"** в правом верхнем углу
3. Выберите **"New repository"** (Новый репозиторий)
4. Заполните форму:
   - **Repository name**: `poe-leveling-overlay` (или любое другое имя)
   - **Description**: `Web version of PoE Leveling Overlay from XileHUD`
   - Выберите **Public** или **Private** (на ваше усмотрение)
   - **НЕ устанавливайте** галочки на "Initialize this repository with a README", "Add .gitignore", "Choose a license" (так как у вас уже есть эти файлы)
5. Нажмите **"Create repository"**

## Шаг 4: Подключение локального репозитория к GitHub

После создания репозитория GitHub покажет вам инструкции. Выполните команды:

**Если ваш репозиторий называется `poe-leveling-overlay` и ваш GitHub username - `ваш-username`:**

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/poe-leveling-overlay.git

# Проверьте, что репозиторий добавлен
git remote -v

# Переименуйте ветку в main (если она называется master)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

**Альтернативный вариант (если используете SSH):**

```bash
git remote add origin git@github.com:YOUR_USERNAME/poe-leveling-overlay.git
git branch -M main
git push -u origin main
```

## Шаг 5: Аутентификация

При первом `git push` GitHub попросит вас войти. Используйте один из способов:

### Вариант A: Personal Access Token (рекомендуется)
1. Перейдите в GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Нажмите "Generate new token (classic)"
3. Дайте имя токену и выберите срок действия
4. Отметьте scope `repo` (полный доступ к репозиториям)
5. Скопируйте токен
6. При запросе пароля в терминале введите этот токен

### Вариант B: GitHub CLI
Установите и используйте GitHub CLI для более удобной аутентификации.

## Проверка

После успешной загрузки:
1. Обновите страницу вашего репозитория на GitHub
2. Все файлы должны быть видны
3. README.md отобразится на главной странице репозитория

## Полезные команды для будущего

```bash
# Проверить статус изменений
git status

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Загрузить изменения на GitHub
git push

# Скачать изменения с GitHub
git pull
```

## Решение проблем

**Проблема**: "remote origin already exists"
```bash
# Удалите существующий remote
git remote remove origin
# Или измените URL
git remote set-url origin https://github.com/YOUR_USERNAME/poe-leveling-overlay.git
```

**Проблема**: "failed to push some refs"
```bash
# Сначала получите изменения с GitHub
git pull origin main --allow-unrelated-histories
# Затем попробуйте снова
git push -u origin main
```

