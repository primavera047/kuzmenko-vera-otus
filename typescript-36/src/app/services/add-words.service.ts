import { Injectable } from '@angular/core';
import { toTranslate } from '../../ts/cutom-types';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AddWordsService {
  private subject$ = new Subject<toTranslate>;

  onAdd(): Observable<any> {
    return this.subject$.asObservable();
  }

  addWord(word: string, sLang: string, fLang: string): void {
    console.log(`add-word-service: add word ${word}, sLang: ${sLang}, fLang ${fLang}`)
    word = word.toLowerCase();

    this.subject$.next({ word: word, sLang: sLang, fLang: fLang });
  }

  addText(text: string, sLang: string, fLang: string) {        
    const words = [...new Set(text.match(/\w+/gu))];
    
    for (let word of words) {
      this.addWord(word, sLang, fLang);
    }
  }
}
