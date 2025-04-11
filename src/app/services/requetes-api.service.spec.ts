import { TestBed } from '@angular/core/testing';

import { RequetesApiService } from './requetes-api.service';

describe('RequetesApiService', () => {
  let service: RequetesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequetesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
