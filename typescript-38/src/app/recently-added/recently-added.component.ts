import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfig, Dictionary, DictMessage } from "../../ts/cutom-types";
import { LocalstorageService } from '../services/localstorage.service';
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
export class RecentlyAddedComponent implements OnInit {
  appConfig!: AppConfig;
  dictionary!: Dictionary;
  public inputWord: string = '';
  public recentlyAdded: string[] = [];

  lstorageSub$!: Subscription;

  constructor(
    private lstorage: LocalstorageService,
    private adder: AddWordsService,
  ) {}

  ngOnInit() {
    this.getConfig()
      .then((res) => {
        if (res !== null) {
          this.appConfig = res;
        }
        else {
          this.appConfig = defaultConf
        }

        const dictName = `${this.appConfig.sourceLang.label}-${this.appConfig.foreignLang.label}`;
        this.getDict(dictName)
          .then((res):any => {
            if (res !== null) {
              this.dictionary = res
            }
            else {
              this.dictionary = {}
            }                        

            this.recentlyAdded = Object.keys(this.dictionary).reverse().slice(0, 10);

            this.lstorageSub$ = this.lstorage.onDictSave().subscribe((record: DictMessage) => this.onStorageUpdate(record))
          });       
      });  
  }

  getConfig() {
    return this.lstorage.getConfig();
  }

  getDict(dictName: string) {
    return this.lstorage.getDict(dictName)
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
    if (this.lstorageSub$) {
      this.lstorageSub$.unsubscribe();
    }    
  }

  async addWord(word: string): Promise<void> {    
    if (word !== '') {
      this.adder.addWord(word, this.appConfig?.sourceLang.label!, this.appConfig?.foreignLang.label!);
    }
  }

  async addText(text: string): Promise<void> {
    if (text !== "") {      
      this.adder.addText(text, this.appConfig?.sourceLang.label!, this.appConfig?.foreignLang.label!);
    }
  }
}
