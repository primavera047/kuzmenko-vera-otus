import { Component } from '@angular/core';
import { AppConfig, Dictionary } from '../../ts/cutom-types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';
import { defaultConf } from '../../ts/default-app-conf';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-go',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  templateUrl: './go.component.html',
  styleUrl: './go.component.css'
})
export class GoComponent {
  public appConfig!: AppConfig;

  public wordToTranslate: string = '';
  public translatedWord: string = ''   

  public timeLeft: number | undefined; 
  public progressBarStatus: number = 0; 
  public currentWord: number = 0;
  public solvedWords: number = 0;

  public taskBoxHide: boolean = false;
  public okMessageHide: boolean = true;
  public wrongMessageHide: boolean = true;
  public translatedWordHide: boolean = true;
  public timeoutMessageHide: boolean = true;
  public resultHide: boolean = true;
  
  private interval: any;
  private dictionary: Dictionary = {};

  constructor(
    private router: Router,
    private lstorage: LocalstorageService
  ) {}

  async ngOnInit() {
    console.log('init');
    const loadedConfig = await this.lstorage.getConfig();

    if (loadedConfig === null) {
      console.log('null config')
      this.appConfig = defaultConf;
    }
    else {
      console.log(loadedConfig);
      this.appConfig = loadedConfig;  
    }

    const dictName = `${this.appConfig.sourceLang.label}-${this.appConfig.foreignLang.label}`;
    const loadedDictionary = await this.lstorage.getDict(dictName);

    if (loadedDictionary !== null) {
      this.dictionary = loadedDictionary
    }

    this.timeLeft = this.appConfig.timeForSolve;

    await this.showNewWord();
  }

  private timer() {
    if (this.timeLeft && this.timeLeft > 0) {
      --this.timeLeft;
      this.progressBarStatus = Math.floor((this.appConfig.timeForSolve - this.timeLeft) / this.appConfig.timeForSolve * 100);
    }
    else {
      this.taskBoxHide = true;
      this.timeoutMessageHide = false;
    }
  }

  private async showNewWord() {
    if (this.currentWord < this.appConfig.countOfWords) {
      this.taskBoxHide = false;

      const randomWord = await this.getRandomWord();          
      this.wordToTranslate = this.dictionary[randomWord];     
      this.translatedWord = randomWord

      this.interval = setInterval(() => this.timer(), 1000)
    }
    else {
      this.taskBoxHide = true;
      this.resultHide = false;
    }
  }

  onAnswer(translation: string) {
    clearInterval(this.interval);

    ++this.currentWord;

    if (translation.toLowerCase() === this.translatedWord.toLowerCase()) {
      ++this.solvedWords;
      this.okMessageHide = false;

      setTimeout(() => { this.okMessageHide = true; }, 3000);

      this.showNewWord();
    }
    else {
      this.taskBoxHide = true;
      this.wrongMessageHide = false;
    }
  }

  onWrongYes() {
    this.translatedWordHide = false;
    this.wrongMessageHide = true;
  }

  onWrongNo() {
    this.wrongMessageHide = true;

    this.showNewWord();
  }

  onWrongOk() {
    this.translatedWordHide = true;    
        
    this.showNewWord();
  }

  onTimeoutOk() {    
    this.timeoutMessageHide = true;
    this.taskBoxHide = true;
    this.resultHide = false;


    clearInterval(this.interval);    
  }

  async onResultAgain() {
    this.resultHide = true;
    this.currentWord = 0;

    this.ngOnInit();
  }

  onEnd() {    
    this.router.navigate(['/recently-added'])
  }

  ngOnDestroy() {    
    clearInterval(this.interval);
  }

  private async getRandomWord(): Promise<string> {
    
    
    if (this.dictionary !== null) {     
      const arrayOfWords = Object.keys(this.dictionary);
      const randomWord = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];

      return randomWord
    }  

    return '';
  }
}
