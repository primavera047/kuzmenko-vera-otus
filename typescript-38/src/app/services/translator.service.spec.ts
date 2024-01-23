import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TranslatorService } from './translator.service';

describe('TranslatorService', () => {
  let service: TranslatorService;
  let randomString: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslatorService);

    randomString = Math.floor(Math.random() * Date.now()).toString(36); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send request to api and parse response', fakeAsync(() => {
    const response = {
      responseData: {
        translatedText: randomString
      }
    };

    spyOn(service, 'doRequest').and.resolveTo(response);

    service.mymemory_translate(randomString, randomString, randomString).then((translation) => {
      expect(translation).toEqual(randomString);
    })

    tick();

    expect(service.doRequest).toHaveBeenCalled();    
  }))

  it('null response', fakeAsync(() => {
    spyOn(service, 'doRequest').and.resolveTo(null);

    service.mymemory_translate(randomString, randomString, randomString).then((translation) => {
      expect(translation).toEqual('');
    })

    tick();

    expect(service.doRequest).toHaveBeenCalled();  
  }))
});
