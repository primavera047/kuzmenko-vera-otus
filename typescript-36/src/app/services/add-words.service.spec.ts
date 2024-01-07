import { TestBed } from '@angular/core/testing';

import { AddWordsService } from './add-words.service';

describe('AddWordsService', () => {
  let service: AddWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
