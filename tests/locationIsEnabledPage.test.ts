
import locationIsEnabledPage from "#/locationIsEnabledPage";

describe('locationIsEnabledPage', () => {
  beforeAll(() => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/path-a'
      }
    });
  });

  it('有効なページ', () => {
    const enabledPathList = [
      '/path-a',
      '/path-b'
    ];
    const expectResponse = true;
    expect(locationIsEnabledPage(enabledPathList)).toEqual(expectResponse);
  });

  it('無効なページ', () => {
    const enabledPathList = [
      '/path-b'
    ];
    const expectResponse = false;
    expect(locationIsEnabledPage(enabledPathList)).toEqual(expectResponse);
  });
});
