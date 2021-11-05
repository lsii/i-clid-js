

const modeTypes = {
  ADD: 'add',
  REPLACE: 'replace'
}

/**
 * location.hrefを元に対象リンクのクエリを装飾する
 *
 * @param {string} locationHref
 * @param {string} linkUrlStr
 * @param {string[]} paramNames
 * @param {string[]} ignoreParamNames
 * @param {string} mode
 * @returns {string}
 */
const linkDecoration = (locationHref, linkUrlStr, paramNames, ignoreParamNames = [], mode = modeTypes.ADD) => {
  const locationUrl = new URL(locationHref);
  const linkUrlObj = new URL(linkUrlStr, locationHref);

  /**
   * クエリ文字列から指定されたキーを削除する
   *
   * @param {string} searchParamsStr
   * @param {string[]} ignoreParamNames
   * @returns {string}
   */
  const ignoreFromLocationSearch = (searchParamsStr, ignoreParamNames) => {
    ignoreParamNames.map(ignoreParamName => {
      searchParamsStr = searchParamsStr.replace(new RegExp(`(\\?|&)(${ignoreParamName}=.*?)(?=&|#|$)`, 'g'), '');
    });
    return searchParamsStr;
  }

  let newSearchStr = locationUrl.search;

  try {
    newSearchStr = ignoreFromLocationSearch(newSearchStr, ignoreParamNames);

    const paramRegexps = paramNames.map(paramName => new RegExp(`(\\?|&)(?<param>${paramName}=.*?)(&|#|$)`));

    const matchParams = paramRegexps
      .map(regexp => newSearchStr.match(regexp))
      .filter(match => match && match.groups && match.groups.param)
      .map(match => match.groups.param );

    if (matchParams.length > 0) {
      newSearchStr = '?' + matchParams.join('&');
    }

    if (newSearchStr === '') {
      return linkUrlStr;
    }

    if (mode === modeTypes.REPLACE) {
      return linkUrlObj.origin + linkUrlObj.pathname + newSearchStr + linkUrlObj.hash;
    } else if (mode === modeTypes.ADD) {
      const separator = linkUrlObj.search === '' ? '?' : '&'
      const modSearchStr = linkUrlObj.search + separator + newSearchStr.replace(/^\?/, '');
      return linkUrlObj.origin + linkUrlObj.pathname + modSearchStr + linkUrlObj.hash;
    } else {
      return linkUrlStr
    }
  } catch (e) {
    return linkUrlStr
  }
}

describe('linkDecoration', () => {
  it('ignoreに記載されたクエリパラメータを除外する', () => {
    const locationUrl = 'https://a.com/a/?lap02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?lap02'
    const keys = []
    const ignoreKeys = ['uid', 'type']
    const mode = modeTypes.REPLACE
    const expectLinkUrl = 'https://a.com/b/?lap02&clid=1'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })

  it('keysが空のときは、全てのパラメータを引き継ぐ', () => {
    const locationUrl = 'https://a.com/a/?lap02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?lap02'
    const keys = []
    const ignoreKeys = []
    const mode = modeTypes.REPLACE
    const expectLinkUrl = 'https://a.com/b/?lap02&clid=1&uid=2&type=3'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })

  it('mode=replaceのとき、リンクのパラメータを置換する', () => {
    const locationUrl = 'https://a.com/a/?lap02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?lap03'
    const keys = []
    const ignoreKeys = []
    const mode = modeTypes.REPLACE
    const expectLinkUrl = 'https://a.com/b/?lap02&clid=1&uid=2&type=3'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })

  it('keysのみ指定されたら、リンクのパラメータに追記される', () => {
    const locationUrl = 'https://a.com/a/?lap02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?lap02'
    const keys = [ 'clid' ]
    const ignoreKeys = []
    const mode = modeTypes.ADD
    const expectLinkUrl = 'https://a.com/b/?lap02&clid=1'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })
})
