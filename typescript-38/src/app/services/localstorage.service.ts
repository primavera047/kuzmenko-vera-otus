import { Injectable } from '@angular/core';
import localforage from 'localforage';
import { Subject, Subscription } from 'rxjs';
import { AppConfig, DictMessage, Dictionary } from '../../ts/cutom-types';
import { TranslatorService } from './translator.service';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  dictSubject$ = new Subject<DictMessage>();
  configSubject$ = new Subject<any>();

  translationSub$: Subscription;

  dictionaries: Record<string, LocalForage> = {};
  configStore: LocalForage = localforage.createInstance({ name: 'config' });

  constructor(
    private translator: TranslatorService
  ) {
    this.translationSub$ = this.subscribe();
  }

  subscribe() {
    return this.translationSub$ = this.translator.onTranslate().subscribe(async (translation: DictMessage) => {            
      if (translation.word !== '' && translation.translation !== '') {
        console.log(`test message: ${JSON.stringify(translation)}`)
        await this.saveToDict(translation.word, translation.translation, translation.dictName);
      }
    })
  }

  ngOnDestroy() {
    this.translationSub$.unsubscribe();
  }

  async saveToDict(word: string, translation: string, dictName: string): Promise<void> {
    if (this.dictionaries[dictName] === undefined) {
      this.dictionaries[dictName] = localforage.createInstance({ name: dictName });      
    }

    this.dictionaries[dictName].setItem(word, translation);

    this.dictSubject$.next({ word: word, translation: translation, dictName: dictName });
  }

  async getDict(dictName: string): Promise<Dictionary | null> {
    if (this.dictionaries[dictName] === undefined) {
      this.dictionaries[dictName] = localforage.createInstance({ name: dictName });
    }

    let dict: Dictionary = {};

    const arrayOfWord = await this.dictionaries[dictName].keys();

    for (let word of arrayOfWord.values()) {
      const translation: string | null = await this.dictionaries[dictName].getItem(word);

      if (translation !== null) {
        dict[word] = translation;
      }
    }    

    return dict;
  }

  onDictSave() {
    return this.dictSubject$.asObservable();
  }

  async saveConfig(config: AppConfig): Promise<void> {
    await this.configStore.setItem('config', config);
  }

  async getConfig(): Promise<AppConfig | null> {
    return await this.configStore.getItem('config');
  }

  onConfigSave() {
    return this.configSubject$.asObservable();
  }
}
