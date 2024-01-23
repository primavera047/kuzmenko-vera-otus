import { ComponentFixture, TestBed, fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';

import { GoComponent } from './go.component';
import { provideAnimations } from '@angular/platform-browser/animations';

import { defaultConf } from '../../ts/default-app-conf';

describe('GoComponent', () => {
  let component: GoComponent;
  let fixture: ComponentFixture<GoComponent>;
  let randomNumber: number;
  let randomString: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoComponent],
      providers: [provideAnimations()]
    })
    .compileComponents();   
    
    fixture = TestBed.createComponent(GoComponent);
    component = fixture.componentInstance;

    spyOn(component, 'getConfig').and.returnValue(new Promise((res, rej) => { res(null); }));

    randomString = Math.floor(Math.random() * Date.now()).toString(36);

    spyOn(component, 'getRandomWord').and.returnValue(new Promise((res, rej) => res(randomString)));

    spyOn(component, 'onAnswer').and.callThrough();
    spyOn(component, 'showNewWord').and.callThrough();

    fixture.detectChanges();
    
    randomNumber = Math.floor(Math.random()*100);
  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getter should return defined currentWord value', () => {
    component.currentWord = randomNumber;

    expect(component.currentWordValue).toEqual(randomNumber);
  })

  it ('getter should return defined appConfig.countOfWords value', () => {
    component.appConfig = defaultConf;

    expect(component.appConfig).toBeDefined();
    expect(component.appConfig.countOfWords).toBeDefined();
    expect(component.countOfWords).toEqual(defaultConf.countOfWords);
  })

  it ('getter should return 0 if appConfig is undefined', () => {
    component.appConfig = undefined;

    expect(component.appConfig).toBeUndefined();
    expect(component.countOfWords).toEqual(0);
  })

  it ('getter should return defined solvedWords value', () => {
    component.solvedWords = randomNumber;

    expect(component.solvedWords).toBeDefined();
    expect(component.solvedWordsValue).toEqual(randomNumber);
  })

  it ('should use default config if getConfig returned null', fakeAsync(() => {
    tick();

    expect(JSON.stringify(component.appConfig)).toEqual(JSON.stringify(defaultConf));
  }))

  it ('shoould use loaded config if not null', fakeAsync(() => {
    fixture = TestBed.createComponent(GoComponent);
    component = fixture.componentInstance;

    let config = defaultConf;
    ++config.countOfWords;
    
    spyOn(component, 'getConfig').and.returnValue(new Promise((res, rej) => { res(config); }));

    fixture.detectChanges();

    tick();

    expect(component.appConfig?.countOfWords).toEqual(config.countOfWords);
  }))

  it ('timer function should decrement timeLeft if timeLeft value more than 0', fakeAsync(() => {    
    tick();

    component.timeLeft = randomNumber;

    component.timer();

    expect(component.timeLeft).toEqual(randomNumber - 1);    
  }))

  it ('timer function should hide taskBox and show timeout message', fakeAsync(() => {
    tick();

    component.timeLeft = 0;

    component.timer();

    expect(component.taskBoxHide).toBeTrue();
    expect(component.timeoutMessageHide).toBeFalse();

    discardPeriodicTasks();    
  }))

  it ('should end game when countOfWords value reached', () => {
    component.currentWord = component.appConfig!.countOfWords;

    component.showNewWord();

    expect(component.taskBoxHide).toBeTrue();
    expect(component.resultHide).toBeFalse();
  })

  it ('got correct translation', fakeAsync(() => {
    component.translatedWord = randomString;
    const initCurrentWord = component.currentWordValue;
    const initSolvedWord = component.solvedWordsValue;

    let input = fixture.debugElement.nativeElement.querySelector('#answerValue');
    input.value = randomString;
    let button = fixture.debugElement.nativeElement.querySelector('#answerButton');
    button.click();
    tick(3001);

    expect(component.onAnswer).toHaveBeenCalled();
    expect(component.onAnswer).toHaveBeenCalledWith(randomString);  
    
    expect(component.currentWordValue).toEqual(initCurrentWord + 1);
    expect(component.solvedWordsValue).toEqual(initSolvedWord + 1);

    flush();    
  }))

  it ('got wrong translation', fakeAsync(() => {
    component.translatedWord = randomString + 'notequal';
    const initCurrentWord = component.currentWordValue;
    const initSolvedWord = component.solvedWordsValue;

    let input = fixture.debugElement.nativeElement.querySelector('#answerValue');
    input.value = randomString;
    let button = fixture.debugElement.nativeElement.querySelector('#answerButton');
    button.click();
    tick();

    expect(component.onAnswer).toHaveBeenCalled();
    expect(component.onAnswer).toHaveBeenCalledWith(randomString);  
    
    expect(component.currentWordValue).toEqual(initCurrentWord + 1);
    expect(component.solvedWordsValue).toEqual(initSolvedWord);

    expect(component.taskBoxHide).toBeTrue();
    expect(component.wrongMessageHide).toBeFalse();

    discardPeriodicTasks();    
  }))

  it ('send wrong answer and press Yes button', () => {
    component.translatedWord = randomString;
    let buttonAnswer = fixture.debugElement.nativeElement.querySelector('#answerButton');
    buttonAnswer.click();

    expect(component.onAnswer).toHaveBeenCalled();
    expect(component.onAnswer).toHaveBeenCalledWith("");  

    expect(component.wrongMessageHide).toBeFalse();

    fixture.detectChanges();

    let buttonYes = fixture.debugElement.nativeElement.querySelector('#wrongYes');
    buttonYes.click();    

    expect(component.translatedWordHide).toBeFalse();
    expect(component.wrongMessageHide).toBeTrue();

    fixture.detectChanges();

    let buttonOk = fixture.debugElement.nativeElement.querySelector('#wrongOk');
    buttonOk.click(); 

    expect(component.translatedWordHide).toBeTrue();
    expect(component.showNewWord).toHaveBeenCalled();
  })

  it ('send wrong answer and press No button', () => {
    component.translatedWord = randomString;
    let buttonAnswer = fixture.debugElement.nativeElement.querySelector('#answerButton');
    buttonAnswer.click();

    expect(component.onAnswer).toHaveBeenCalled();
    expect(component.onAnswer).toHaveBeenCalledWith("");  

    expect(component.wrongMessageHide).toBeFalse();

    fixture.detectChanges();

    let buttonYes = fixture.debugElement.nativeElement.querySelector('#wrongNo');
    buttonYes.click();    

    expect(component.translatedWordHide).toBeTrue();
  })
});
