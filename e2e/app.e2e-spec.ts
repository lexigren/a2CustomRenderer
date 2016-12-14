import { A2CustomRenderer1Page } from './app.po';

describe('a2-custom-renderer1 App', function() {
  let page: A2CustomRenderer1Page;

  beforeEach(() => {
    page = new A2CustomRenderer1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
