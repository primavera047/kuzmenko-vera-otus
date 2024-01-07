import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfig, Dictionary, DictMessage } from "../../ts/cutom-types";
import { LocalstorageService } from '../services/localstorage.service';
import { TranslatorService } from '../services/translator.service';
import { AddWordsService } from '../services/add-words.service';
import { Subscription } from 'rxjs';
import { defaultConf } from '../../ts/default-app-conf';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-recently-added',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './recently-added.component.html',
  styleUrl: './recently-added.component.css'
})
export class RecentlyAddedComponent {
  appConfig!: AppConfig;
  dictionary!: Dictionary;
  public inputWord: string = '';
  public recentlyAdded: string[] = [];

  lstorageSub$!: Subscription;

  constructor(
    private lstorage: LocalstorageService,
    private adder: AddWordsService,
  ) {
    this.lstorage.getConfig()
      .then((res) => {
        if (res !== null) {
          this.appConfig = res;
        }
        else {
          this.appConfig = defaultConf
        }

        const dictName = `${this.appConfig.sourceLang.label}-${this.appConfig.foreignLang.label}`;
        this.lstorage.getDict(dictName)
          .then((res) => {
            if (res !== null) {
              this.dictionary = res
            }
            else {
              this.dictionary = {}
            }

            console.log(dictName);

            this.recentlyAdded = Object.keys(this.dictionary).reverse().slice(0, 10);

            this.lstorageSub$ = this.lstorage.onDictSave().subscribe((record: DictMessage) => this.onStorageUpdate(record))
          });
      });
  }

  onStorageUpdate(record: DictMessage) {
    if (`${this.appConfig?.sourceLang.label}-${this.appConfig?.foreignLang.label}` === record.dictName) {
      this.dictionary[record.word] = record.translation;

      if (this.recentlyAdded.length < 10) {
        this.recentlyAdded = this.recentlyAdded.reverse();
        this.recentlyAdded.push(record.word);
      }
      else {
        this.recentlyAdded.pop();
        this.recentlyAdded = this.recentlyAdded.reverse();
        this.recentlyAdded.push(record.word);
      }

      this.recentlyAdded = this.recentlyAdded.reverse();
    }
  }

  ngOnDestroy() {
    this.lstorageSub$.unsubscribe();
  }

  async addWord(word: string): Promise<void> {
    console.log(`recently-added: add word ${word}`)
    if (word !== '') {
      this.adder.addWord(word, this.appConfig?.sourceLang.label!, this.appConfig?.foreignLang.label!);
    }
  }

  async addText(text: string): Promise<void> {
    if (text !== "") {
      console.log(text);
      this.adder.addText(text, this.appConfig?.sourceLang.label!, this.appConfig?.foreignLang.label!);
    }
  }
}
