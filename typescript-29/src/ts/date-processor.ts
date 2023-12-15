export function getDateString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getShortDate(dateString: string) {
    let date: Date = new Date(dateString);
    let shortDaysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    return `${shortDaysOfWeek[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}`
}

export function getFullDate(dateString: string) {
    let date: Date = new Date(dateString);
    let fullDaysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    let fullMonth = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    return `${fullDaysOfWeek[date.getDay()]}, ${date.getDate()} ${fullMonth[date.getMonth()]} ${date.getFullYear()}`
}