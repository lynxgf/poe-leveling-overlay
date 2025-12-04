/**
 * Переводит описания шагов на русский, сохраняя названия на английском
 */
export function translateDescription(description: string): string {
    let result = description;

    // Действия в начале строки (порядок важен - более специфичные первыми)
    const actionPatterns: [RegExp, string][] = [
        // Portal/Waypoint
        [/^Portal to\s+/i, 'Портал в '],
        [/^Use portal to\s+/i, 'Использовать портал в '],
        [/^Waypoint to\s+/i, 'Waypoint в '],
        [/^Take waypoint to\s+/i, 'Waypoint в '],
        [/^TP to\s+/i, 'ТП в '],
        [/^Tag Waypoint/i, 'Активировать Waypoint'],

        // Kill variants
        [/^Kill\s+/i, 'Убить '],
        [/^Slay\s+/i, 'Убить '],

        // Enter/Exit
        [/^Enter\s+/i, 'Войти в '],
        [/^Exit\s+/i, 'Выйти из '],
        [/^Leave\s+/i, 'Покинуть '],

        // Talk/Speak
        [/^Talk to\s+/i, 'Поговорить с '],
        [/^Speak with\s+/i, 'Поговорить с '],
        [/^Speak to\s+/i, 'Поговорить с '],

        // Summon/Call
        [/^Summon\s+/i, 'Призвать '],
        [/^Call\s+/i, 'Позвать '],

        // Complete/Finish
        [/^Complete\s+/i, 'Завершить '],
        [/^Finish\s+/i, 'Завершить '],

        // Find/Locate
        [/^Find\s+/i, 'Найти '],
        [/^Locate\s+/i, 'Найти '],
        [/^Search for\s+/i, 'Искать '],

        // Get/Take/Grab/Pick up
        [/^Get\s+/i, 'Получить '],
        [/^Take\s+/i, 'Взять '],
        [/^Grab\s+/i, 'Взять '],
        [/^Pick up\s+/i, 'Подобрать '],
        [/^Pickup\s+/i, 'Подобрать '],
        [/^Loot\s+/i, 'Забрать '],

        // Use/Activate
        [/^Use\s+/i, 'Использовать '],
        [/^Activate\s+/i, 'Активировать '],
        [/^Interact with\s+/i, 'Взаимодействовать с '],

        // Defeat/Destroy
        [/^Defeat\s+/i, 'Победить '],
        [/^Destroy\s+/i, 'Уничтожить '],
        [/^Break\s+/i, 'Сломать '],

        // Open/Close
        [/^Open\s+/i, 'Открыть '],
        [/^Close\s+/i, 'Закрыть '],

        // Clear
        [/^Clear\s+/i, 'Очистить '],

        // Return/Go/Travel
        [/^Return to\s+/i, 'Вернуться в '],
        [/^Go to\s+/i, 'Перейти в '],
        [/^Go back to\s+/i, 'Вернуться в '],
        [/^Travel to\s+/i, 'Переместиться в '],
        [/^Head to\s+/i, 'Направиться в '],
        [/^Move to\s+/i, 'Перейти в '],
        [/^Rush to\s+/i, 'Бежать в '],
        [/^Proceed to\s+/i, 'Перейти в '],

        // Teleport
        [/^Teleport to\s+/i, 'Телепортироваться в '],

        // Visit
        [/^Visit\s+/i, 'Посетить '],

        // Rescue/Save/Free/Help
        [/^Rescue\s+/i, 'Спасти '],
        [/^Save\s+/i, 'Спасти '],
        [/^Free\s+/i, 'Освободить '],
        [/^Help\s+/i, 'Помочь '],
        [/^Protect\s+/i, 'Защитить '],

        // Collect/Gather
        [/^Collect\s+/i, 'Собрать '],
        [/^Gather\s+/i, 'Собрать '],

        // Follow/Escort
        [/^Follow\s+/i, 'Следовать за '],
        [/^Escort\s+/i, 'Сопроводить '],

        // Explore/Cross
        [/^Explore\s+/i, 'Исследовать '],
        [/^Cross\s+/i, 'Пересечь '],
        [/^Navigate\s+/i, 'Пройти через '],

        // Touch
        [/^Touch\s+/i, 'Коснуться '],
        [/^Click\s+/i, 'Нажать на '],

        // Ascend/Descend/Climb
        [/^Ascend\s+/i, 'Подняться в '],
        [/^Descend\s+/i, 'Спуститься в '],
        [/^Climb\s+/i, 'Подняться на '],

        // Accept/Start
        [/^Accept\s+/i, 'Принять '],
        [/^Start\s+/i, 'Начать '],
        [/^Begin\s+/i, 'Начать '],

        // Buy/Sell
        [/^Buy\s+/i, 'Купить '],
        [/^Sell\s+/i, 'Продать '],
        [/^Purchase\s+/i, 'Купить '],

        // Check/Examine
        [/^Check\s+/i, 'Проверить '],
        [/^Examine\s+/i, 'Осмотреть '],
        [/^Inspect\s+/i, 'Осмотреть '],

        // Read
        [/^Read\s+/i, 'Прочитать '],

        // Run/Walk
        [/^Run to\s+/i, 'Бежать в '],
        [/^Walk to\s+/i, 'Идти в '],

        // Wait
        [/^Wait for\s+/i, 'Подождать '],
        [/^Wait\s+/i, 'Подождать '],
    ];

    for (const [pattern, replacement] of actionPatterns) {
        if (pattern.test(result)) {
            result = result.replace(pattern, replacement);
            break;
        }
    }

    // Optional в начале
    result = result.replace(/^Optional:\s*/i, 'Опционально: ');
    result = result.replace(/^\[Optional\]\s*/i, '[Опционально] ');

    // Фразы внутри текста
    result = result.replace(/\bnear waypoint\b/gi, 'рядом с waypoint');
    result = result.replace(/\bnear\s+/gi, 'рядом с ');
    result = result.replace(/\bfor\s+Skill\s*\+?\s*Support\s+Gem\b/gi, 'за Skill + Support Gem');
    result = result.replace(/\bfor\s+Passive\s+Point\b/gi, 'за Passive Point');
    result = result.replace(/\bfor\s+Skill\s+Gem\b/gi, 'за Skill Gem');
    result = result.replace(/\bfor\s+reward\b/gi, 'за награду');
    result = result.replace(/\bGrants\s+/gi, 'Даёт ');
    result = result.replace(/\bbonus\b/gi, 'бонус');
    result = result.replace(/\bResistance\b/gi, 'сопротивление');
    result = result.replace(/\bCold\s+/gi, 'холоду ');
    result = result.replace(/\bFire\s+/gi, 'огню ');
    result = result.replace(/\bLightning\s+/gi, 'молнии ');
    result = result.replace(/\band\s+/gi, 'и ');
    result = result.replace(/\bwaypoint\b/gi, 'waypoint');
    result = result.replace(/\bWaypoint\b/g, 'Waypoint');
    result = result.replace(/\bAND\b/g, 'И');
    result = result.replace(/\bDesert Map:\s*/gi, 'Карта пустыни: ');

    return result;
}

/**
 * Переводит подсказки и советы по карте на русский
 */
export function translateHint(text: string): string {
    if (!text) return text;
    let result = text;

    const patterns: [RegExp, string][] = [
        // Locations/Directions
        [/^Often located near\s+/i, 'Обычно находится рядом с '],
        [/^Usually found near\s+/i, 'Обычно находится рядом с '],
        [/^Located near\s+/i, 'Находится рядом с '],
        [/^Found near\s+/i, 'Находится рядом с '],
        [/^Can be found near\s+/i, 'Можно найти рядом с '],
        [/^Look for\s+/i, 'Ищите '],
        [/^Check near\s+/i, 'Проверьте рядом с '],
        [/^Usually at\s+/i, 'Обычно в '],
        [/^At the\s+/i, 'В '],
        [/^Near the\s+/i, 'Рядом с '],
        [/^Inside\s+/i, 'Внутри '],
        [/^Outside\s+/i, 'Снаружи '],
        [/^Behind\s+/i, 'Позади '],
        [/^In front of\s+/i, 'Перед '],
        [/^Opposite of\s+/i, 'Напротив '],
        [/^Opposite side of\s+/i, 'На противоположной стороне '],

        // Navigation
        [/^Follow the\s+/i, 'Следуйте по '],
        [/^Follow\s+/i, 'Следуйте '],
        [/^Stick to the\s+/i, 'Держитесь '],
        [/^Stick to\s+/i, 'Держитесь '],
        [/^Go left\b/i, 'Идите налево'],
        [/^Go right\b/i, 'Идите направо'],
        [/^Go north\b/i, 'Идите на север'],
        [/^Go south\b/i, 'Идите на юг'],
        [/^Go east\b/i, 'Идите на восток'],
        [/^Go west\b/i, 'Идите на запад'],
        [/^Head\s+/i, 'Направляйтесь '],
        [/^Aim for\s+/i, 'Цельтесь на '],
        [/^Walk\s+/i, 'Идите '],
        [/^Run\s+/i, 'Бегите '],
        [/^Exit is\s+/i, 'Выход '],
        [/^Entrance is\s+/i, 'Вход '],
        [/^Path is\s+/i, 'Путь '],

        // Actions in hints
        [/^Kill\s+/i, 'Убейте '],
        [/^Find\s+/i, 'Найдите '],
        [/^Click\s+/i, 'Нажмите '],
        [/^Place portal\s+/i, 'Поставьте портал '],
        [/^Tag Waypoint/i, 'Активируйте Waypoint'],

        // Misc
        [/^This is a\s+/i, 'Это '],
        [/^No need to\s+/i, 'Не нужно '],
        [/^Make sure to\s+/i, 'Обязательно '],
        [/^Don't forget to\s+/i, 'Не забудьте '],
    ];

    for (const [pattern, replacement] of patterns) {
        if (pattern.test(result)) {
            result = result.replace(pattern, replacement);
            // Don't break here, as there might be multiple sentences
        }
    }

    // Common words and phrases replacements (global)
    const replacements: [RegExp, string][] = [
        [/\bImportant NPC\b/gi, 'Важный NPC'],
        [/\bfor quest progression\b/gi, 'для прохождения квеста'],
        [/\bquest progression\b/gi, 'прохождение квеста'],
        [/\bafter completing\b/gi, 'после завершения'],
        [/\bbefore entering\b/gi, 'перед входом в'],
        [/\bto the left\b/gi, 'слева'],
        [/\bto the right\b/gi, 'справа'],
        [/\bon the left\b/gi, 'слева'],
        [/\bon the right\b/gi, 'справа'],
        [/\bnorth\b/gi, 'на севере'],
        [/\bsouth\b/gi, 'на юге'],
        [/\beast\b/gi, 'на востоке'],
        [/\bwest\b/gi, 'на западе'],
        [/\bnorth-east\b/gi, 'на северо-востоке'],
        [/\bnorth-west\b/gi, 'на северо-западе'],
        [/\bsouth-east\b/gi, 'на юго-востоке'],
        [/\bsouth-west\b/gi, 'на юго-западе'],
        [/\babove\b/gi, 'выше'],
        [/\bbelow\b/gi, 'ниже'],
        [/\balong\b/gi, 'вдоль'],
        [/\bacross\b/gi, 'через'],
        [/\bthrough\b/gi, 'через'],
        [/\binto\b/gi, 'в'],
        [/\bfrom\b/gi, 'из'],
        [/\bwith\b/gi, 'с'],
        [/\barena\b/gi, 'арену'],
        [/\broad\b/gi, 'дороге'],
        [/\bwall\b/gi, 'стены'],
        [/\bedge\b/gi, 'краю'],
        [/\bcliff\b/gi, 'обрыва'],
        [/\bcoast\b/gi, 'побережью'],
        [/\briver\b/gi, 'реке'],
        [/\bbridge\b/gi, 'мост'],
        [/\bentrance\b/gi, 'вход'],
        [/\bexit\b/gi, 'выход'],
        [/\bdead end\b/gi, 'тупик'],
        [/\bzone\b/gi, 'зоны'],
        [/\bmap\b/gi, 'карте'],
        [/\blayout\b/gi, 'лейаут'],
        [/\bpattern\b/gi, 'паттерн'],
        [/\btriangle\b/gi, 'треугольник'],
        [/\bdirection\b/gi, 'направлении'],
        [/\bopposite\b/gi, 'напротив'],
        [/\bguaranteed\b/gi, 'гарантировано'],
        [/\brandom\b/gi, 'случайно'],
        [/\bfixed\b/gi, 'фиксировано'],
        [/\bstatic\b/gi, 'статично'],
        [/\busually\b/gi, 'обычно'],
        [/\brarely\b/gi, 'редко'],
        [/\balways\b/gi, 'всегда'],
        [/\bnever\b/gi, 'никогда'],
        [/\bif\b/gi, 'если'],
        [/\bthen\b/gi, 'затем'],
        [/\bor\b/gi, 'или'],
        [/\band\b/gi, 'и'],
        [/\bbut\b/gi, 'но'],
        [/\bthe\s+/gi, ''], // Remove 'the' mostly
        [/\bOptional:\s*/gi, 'Опционально: '],
        [/\bLeague-start only\b/gi, 'Только для старта лиги'],
        [/\bLeague-start recommended\b/gi, 'Рекомендуется для старта лиги'],
    ];

    for (const [pattern, replacement] of replacements) {
        result = result.replace(pattern, replacement);
    }

    return result;
}

/**
 * Алиас для translateHint, так как логика перевода советов по карте схожа
 */
export const translateLayoutTip = translateHint;

/**
 * Переводит текст награды
 */
export function translateReward(reward: string): string {
    let result = reward;

    result = result.replace(/\bSkill Gem\b/gi, 'Skill Gem');
    result = result.replace(/\bSupport Gem\b/gi, 'Support Gem');
    result = result.replace(/\bPassive Point\b/gi, 'Passive Point');
    result = result.replace(/\bBook of Skill\b/gi, 'Book of Skill');
    result = result.replace(/\bRespec Point\b/gi, 'Respec Point');
    result = result.replace(/\bQuicksilver Flask\b/gi, 'Quicksilver Flask');
    result = result.replace(/\bMovement Skills\b/gi, 'Movement Skills');
    result = result.replace(/\bUtility\b/gi, 'Utility');
    result = result.replace(/\bHeralds\b/gi, 'Heralds');

    return result;
}
