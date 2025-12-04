/**
 * Функция для правильного склонения слов в русском языке
 * @param count - число
 * @param one - форма для 1 (задача)
 * @param few - форма для 2-4 (задачи)
 * @param many - форма для 5-20 (задач)
 * @returns правильная форма слова
 */
export function pluralize(count: number, one: string, few: string, many: string): string {
    const absCount = Math.abs(count);
    const lastTwo = absCount % 100;
    const lastOne = absCount % 10;

    if (lastTwo >= 11 && lastTwo <= 19) {
        return many;
    }

    if (lastOne === 1) {
        return one;
    }

    if (lastOne >= 2 && lastOne <= 4) {
        return few;
    }

    return many;
}

/**
 * Склонение слова "задача"
 */
export function pluralizeTask(count: number): string {
    return pluralize(count, 'задача', 'задачи', 'задач');
}
