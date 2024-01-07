import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../ts/cutom-types';
import { LocalstorageService } from '../services/localstorage.service';
import { CommonModule, Location } from '@angular/common';
import { Lang } from '../../ts/cutom-types';
import { defaultConf } from '../../ts/default-app-conf';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  appConfig: AppConfig;
  message: string | undefined;
  
  settingsForm = new FormGroup({
    mainLang: new FormControl('', [Validators.minLength(1), Validators.pattern('^[a-z]{2}$')]),
    foreignLang: new FormControl('', [Validators.minLength(1), Validators.pattern('^[a-z]{2}$')]),
    timeForSolve: new FormControl(1, [Validators.min(1), Validators.pattern('^[0-9]+$'), Validators.required]),
    countOfWords: new FormControl(1, [Validators.min(1), Validators.pattern('^[0-9]+$'), Validators.required]),
  })

  constructor(
    private lstorage: LocalstorageService,
    private location: Location,
  ) {
    this.appConfig = defaultConf;
  }

  async ngOnInit() {
    console.log(this.appConfig);    
    
    const loadedAppConfig = await this.lstorage.getConfig();
    
    if (loadedAppConfig === null) {
      this.lstorage.saveConfig(this.appConfig);
    }
  }

  private getValueByLabel(langLabel: string): string | undefined {
    for (let aLang of this.appConfig!.availableLangs) {
      if (aLang.label === langLabel) {
        return aLang.value;
      }
    }
    
    return undefined;
  }

  private getAvailableLang(langLabel: string): Lang | undefined {
    const langValue: string | undefined = this.getValueByLabel(langLabel);

    if (langValue !== undefined) {      
      return {label: langLabel, value: langValue};
    }
    else {
      return undefined;
    }
  }

  async onSubmit() {
    this.appConfig!.timeForSolve = this.settingsForm.value.timeForSolve!;
    this.appConfig!.countOfWords = this.settingsForm.value.countOfWords!;

    this.appConfig!.sourceLang = this.getAvailableLang(this.settingsForm.value.mainLang!)!

    this.appConfig!.foreignLang = this.getAvailableLang(this.settingsForm.value.foreignLang!)!    

    //await this.lstorage.setToStorage<AppConfig>('config', this.appConfig)

    await this.lstorage.saveConfig(this.appConfig!);

    this.message = "Настройки сохранены";

    setTimeout(() => {this.message = undefined}, 1000);
  }

  onBack() {
    this.location.back();
  }
}
