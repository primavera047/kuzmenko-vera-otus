import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DictMessage, toTranslate } from '../../ts/cutom-types';
import { AddWordsService } from './add-words.service';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  private subject$ = new Subject<DictMessage>();
  private addWordSub$: Subscription;

  constructor(
    private addWord: AddWordsService
  ) {
    this.addWordSub$ = this.addWord.onAdd().subscribe(async (data: toTranslate) => {
      console.log(`translator service: received message from addwordservice`)
      console.log(data);
      if (data.word !== '') {
        await this.translate(data.word, data.sLang, data.fLang);
      }
    })
  }

  ngOnDestroy() {
    this.addWordSub$.unsubscribe();
  }

  async mymemory_translate(word: string, fromLang: string, toLang: string): Promise<string> {
    let url = new URL("https://api.mymemory.translated.net/get");

    url.searchParams.set('q', word);
    url.searchParams.set('langpair', `${fromLang}|${toLang}`);    

    AbortSignal.timeout ??= function timeout(ms) {
      const ctrl = new AbortController()
      setTimeout(() => ctrl.abort(), ms)
      return ctrl.signal
    }

    let response = await fetch(url, { signal: AbortSignal.timeout(3000) });

    if (response.ok) {
      let json: any = await response.json();

      if (json['responseData'] !== undefined && json['responseData']['translatedText'] !== undefined) {
        const translation: string = json['responseData']['translatedText'];

        return translation;
      }      
    }
    else {
      alert("Ошибка HTTP: " + response.status);      
    }

    return ''
  }

  async translate(word: string, fromLang: string, toLang: string): Promise<void> {
    //const translation: string = `${toLang}_${word}`;
    const translation = await this.mymemory_translate(word, fromLang, toLang);

    const dictName = `${fromLang}-${toLang}`;

    console.log(`translator service: send translation of word: ${word} ${translation} ${dictName}`)

    this.subject$.next({
      word: word,
      translation: translation,
      dictName: dictName
    });
  }

  onTranslate() {
    return this.subject$.asObservable();
  }
}
