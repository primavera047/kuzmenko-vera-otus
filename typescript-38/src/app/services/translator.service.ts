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

    let json = await this.doRequest(url);

    if (json !== null && json['responseData'] !== undefined && json['responseData']['translatedText'] !== undefined) {
      const translation: string = json['responseData']['translatedText'];

      return translation;
    }

    return '';
  }

  async doRequest(url: URL): Promise<any> {
    AbortSignal.timeout ??= function timeout(ms) {
      const ctrl = new AbortController()
      setTimeout(() => ctrl.abort(), ms)
      return ctrl.signal
    }

    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });

    if (response.ok) {
      return response.json();
    }
    else {
      console.error("Ошибка HTTP: " + response.status);

      return null;
    }
  }

  async translate(word: string, fromLang: string, toLang: string): Promise<void> {
    const translation = await this.mymemory_translate(word, fromLang, toLang);

    const dictName = `${fromLang}-${toLang}`;     

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
