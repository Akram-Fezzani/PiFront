import { TestBed } from '@angular/core/testing';

import { CommentReactService } from './comment-react.service';

describe('CommmentReactService', () => {
  let service: CommentReactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentReactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
