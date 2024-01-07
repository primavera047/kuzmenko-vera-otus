import { AppConfig } from "./cutom-types"

export const defaultConf: AppConfig = {
    timeForSolve: 60,
    countOfWords: 10,
    sourceLang: {
        label: 'en',
        value: 'Английский'
    },
    foreignLang: {        
        label: 'ru',
        value: 'Русский'
    },
    availableLangs: [
        {
            label: 'ru',
            value: 'Русский'
        },
        {
            label: 'en',
            value: 'Английский'
        },
    ]
}