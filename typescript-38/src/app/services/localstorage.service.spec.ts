import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LocalstorageService } from './localstorage.service';
import { TranslatorService } from './translator.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;
  let translator: TranslatorService;
  let randomString: string;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [LocalstorageService, TranslatorService]});   

    service = TestBed.inject(LocalstorageService);   
    translator = TestBed.inject(TranslatorService); 

    randomString = Math.floor(Math.random() * Date.now()).toString(36); 

    spyOn(translator, 'mymemory_translate').and.resolveTo(randomString);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to TranslationService', () => {
    expect(service.translationSub$).toBeDefined();
  })

  it('should receive data from subscribtion', fakeAsync(() => {
    spyOn(service, 'saveToDict').and.callThrough();
    
    translator.translate(randomString, randomString, randomString);
    tick();

    expect(service.saveToDict).toHaveBeenCalled();
    expect(service.saveToDict).toHaveBeenCalledWith(randomString, randomString, `${randomString}-${randomString}`);
  }))
});
