import { listCommitsPlugin } from './plugin';

describe('list-commits', () => {
  it('should export plugin', () => {
    expect(listCommitsPlugin).toBeDefined();
  });
});
