import { TestBed } from '@angular/core/testing';

import { AssetReader } from './asset-reader';

describe('AssetReader', () => {
  let service: AssetReader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetReader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
