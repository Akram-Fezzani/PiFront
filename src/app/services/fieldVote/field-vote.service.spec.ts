import { TestBed } from '@angular/core/testing';

import { FieldVoteService } from './field-vote.service';

describe('FieldVoteService', () => {
  let service: FieldVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
