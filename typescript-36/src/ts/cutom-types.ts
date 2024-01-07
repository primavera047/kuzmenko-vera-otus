export type Dictionary = Record<string,string>

export type Lang = {
    label: string,
    value: string,
}

export type AppConfig = {
    timeForSolve: number,
    countOfWords: number,
    sourceLang: Lang,
    foreignLang: Lang,
    availableLangs: Lang[],
}

export type DictMessage = {
    word: string,
    translation: string,
    dictName: string,
}

export type toTranslate = {
    word: string,
    sLang: string,
    fLang: string,
}