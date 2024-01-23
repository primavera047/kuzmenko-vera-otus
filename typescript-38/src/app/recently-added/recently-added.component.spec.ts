import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RecentlyAddedComponent } from './recently-added.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DictMessage } from '../../ts/cutom-types';
import { defaultConf } from '../../ts/default-app-conf';
import { LocalstorageService } from '../services/localstorage.service';

describe('RecentlyAddedComponent', () => {
  let component: RecentlyAddedComponent;
  let fixture: ComponentFixture<RecentlyAddedComponent>;

  let randomString: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentlyAddedComponent],
      providers: [provideAnimations(), LocalstorageService]
    })
    .compileComponents();   

    fixture = TestBed.createComponent(RecentlyAddedComponent);
    component = fixture.componentInstance;

    randomString = Math.floor(Math.random() * Date.now()).toString(36); 

    spyOn(component, 'getConfig').and.returnValue(new Promise((res, rej) => { res(defaultConf); }));
    spyOn(component, 'getDict').and.returnValue(new Promise((res, rej) => { res({}); }))
    spyOn(component, 'addWord').and.callThrough();
    spyOn(component, 'addText').and.callThrough();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(RecentlyAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it ('should add new word to list if list length less than 10', fakeAsync(() => {   
    component.ngOnInit();
    tick();
    
    const message: DictMessage = {
      word: randomString,
      translation: randomString,
      dictName: `${component.appConfig.sourceLang.label}-${component.appConfig.foreignLang.label}`
    };

    const uniq_message: DictMessage = {
      word: randomString+'_uniq',
      translation: randomString+'_uniq',
      dictName: `${component.appConfig.sourceLang.label}-${component.appConfig.foreignLang.label}`
    };

    const initRecentlyAddedLength = component.recentlyAdded.length;

    for (let i = 0; i < 9; ++i) {
      component.onStorageUpdate(message);

      expect(component.recentlyAdded.length).toEqual(initRecentlyAddedLength + i + 1);
      expect(JSON.stringify(component.recentlyAdded[0])).toEqual(JSON.stringify(message.word));
    }

    component.onStorageUpdate(uniq_message);

    expect(component.recentlyAdded.length).toEqual(initRecentlyAddedLength + 10);
    expect(JSON.stringify(component.recentlyAdded[0])).toEqual(JSON.stringify(uniq_message.word));
  }))

  it ('should add new word to list and remove last if list length equal to 10', fakeAsync(() => {   
    component.ngOnInit();
    tick();

    const first_message: DictMessage = {
      word: randomString + '_first',
      translation: randomString + '_first',
      dictName: `${component.appConfig.sourceLang.label}-${component.appConfig.foreignLang.label}`
    };
    
    const message: DictMessage = {
      word: randomString,
      translation: randomString,
      dictName: `${component.appConfig.sourceLang.label}-${component.appConfig.foreignLang.label}`
    };

    const uniq_message: DictMessage = {
      word: randomString + '_uniq',
      translation: randomString + '_uniq',
      dictName: `${component.appConfig.sourceLang.label}-${component.appConfig.foreignLang.label}`
    };

    const initRecentlyAddedLength = component.recentlyAdded.length;

    component.onStorageUpdate(first_message);

    expect(component.recentlyAdded.length).toEqual(initRecentlyAddedLength + 1);
    expect(JSON.stringify(component.recentlyAdded[0])).toEqual(JSON.stringify(first_message.word));

    for (let i = 0; i < 9; ++i) {
      component.onStorageUpdate(message);

      expect(component.recentlyAdded.length).toEqual(initRecentlyAddedLength + i + 2);
      expect(JSON.stringify(component.recentlyAdded[0])).toEqual(JSON.stringify(message.word));
    }

    expect(JSON.stringify(component.recentlyAdded[9])).toEqual(JSON.stringify(first_message.word));
    expect(component.recentlyAdded.length).toEqual(initRecentlyAddedLength + 10);

    component.onStorageUpdate(uniq_message);

    expect(component.recentlyAdded.length).toEqual(initRecentlyAddedLength + 10);
    expect(JSON.stringify(component.recentlyAdded[0])).toEqual(JSON.stringify(uniq_message.word));
    expect(JSON.stringify(component.recentlyAdded[9])).toEqual(JSON.stringify(message.word));
  }))

  it ('should send word from user input', () => {    
    let wordInput = fixture.debugElement.nativeElement.querySelector('#wordInput');
    wordInput.value = randomString;

    let addWordButton = fixture.debugElement.nativeElement.querySelector('#addWordButton');
    addWordButton.click();

    expect(component.addWord).toHaveBeenCalled();
  })

  it ('should send text from user input', () => {    
    let wordInput = fixture.debugElement.nativeElement.querySelector('#textInput');
    wordInput.value = randomString;

    let addWordButton = fixture.debugElement.nativeElement.querySelector('#addTextButton');
    addWordButton.click();

    expect(component.addText).toHaveBeenCalled();
  })
});
