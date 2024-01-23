import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks, flush } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { defaultConf } from '../../ts/default-app-conf';
import { JsonPipe } from '@angular/common';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let randomString: string;
  let randomNumber: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideAnimations()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    randomString = Math.floor(Math.random() * Date.now()).toString(36);
    randomNumber = Math.floor(Math.random() * 100);

    //spyOn(component, 'getConfig').and.returnValue(new Promise((res, rej) => { res(defaultConf) }));
    spyOn(component, 'getConfig').and.resolveTo(defaultConf);
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'saveConfig').and.returnValue(new Promise((res, rej) => { res() }));
    spyOn(component, 'onBack').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    spyOn(component, 'getConfig').and.callThrough();

    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(component.getConfig).toHaveBeenCalled();
  });

  it('should save default config to localstorage if not exists', fakeAsync(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    spyOn(component, 'getConfig').and.returnValue(new Promise((res, rej) => { res(null); }))
    spyOn(component, 'saveConfig').and.returnValue(new Promise((res, rej) => { res(); }))

    fixture.detectChanges();
    
    tick();

    expect(component.getConfig).toHaveBeenCalled();    
    expect(component.saveConfig).toHaveBeenCalled();
  }))

  it('should return lang info by providing label', () => {    
    expect(component.getValueByLabel(component.appConfig.availableLangs[0].label)).toEqual(component.appConfig.availableLangs[0].value);
  })

  it('should return undefined if lang not in avaliable list', () => {
    expect(component.getValueByLabel(randomString)).toBeUndefined();
  })

  it('should return available lang by label', () => {
    expect(JSON.stringify(component.getAvailableLang(component.appConfig.availableLangs[0].label))).toEqual(JSON.stringify(component.appConfig.availableLangs[0]));
  })

  it('should return undefined available lang if lang not in avaliable list', () => {
    expect(JSON.stringify(component.getAvailableLang(randomString))).toBeUndefined();
  })

  it('should call function to save provided settings', fakeAsync(() => {
    let mainLangSelector = fixture.debugElement.nativeElement.querySelector('#mainLangSelector');
    let foreignLangSelector = fixture.debugElement.nativeElement.querySelector('#foreignLangSelector');
    let countInput = fixture.debugElement.nativeElement.querySelector('#countInput');
    let timeInput = fixture.debugElement.nativeElement.querySelector('#timeInput');
    let saveButton = fixture.debugElement.nativeElement.querySelector('#saveButton');

    mainLangSelector.value = component.appConfig.availableLangs[0].value;
    foreignLangSelector.value = component.appConfig.availableLangs[1].value;
    countInput.value = randomNumber;
    timeInput.value = randomNumber;
    saveButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.saveConfig).toHaveBeenCalled();

    expect(fixture.debugElement.nativeElement.querySelector('#statusMessage')).toBeDefined();
    tick(1001);
    expect(fixture.debugElement.nativeElement.querySelector('#statusMessage')).toBeNull();
  }))

  it('should save provided settings', () => {    
    component.settingsForm.value.mainLang = component.appConfig.availableLangs[0].label;
    component.settingsForm.value.foreignLang = component.appConfig.availableLangs[1].label;
    component.settingsForm.value.countOfWords = randomNumber;
    component.settingsForm.value.timeForSolve = randomNumber;

    component.onSubmit();

    expect(JSON.stringify(component.appConfig.sourceLang)).toEqual(JSON.stringify(component.appConfig.availableLangs[0]));
    expect(JSON.stringify(component.appConfig.foreignLang)).toEqual(JSON.stringify(component.appConfig.availableLangs[1]));
    expect(component.appConfig.countOfWords).toEqual(randomNumber);
    expect(component.appConfig.timeForSolve).toEqual(randomNumber);
  })

  it('should return to previous page when submit button', () => {
    let backButton = fixture.debugElement.nativeElement.querySelector('#backButton');
    backButton.click();

    expect(component.onBack).toHaveBeenCalled();
  })
});
