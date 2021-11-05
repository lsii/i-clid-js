
window.iClid = function (options) {
  try {
    const modeTypes = {
      ADD: 'add',
      REPLACE: 'replace'
    }
    const selector = options.selector || 'article';
    const keys = options.keys || [];
    const ignoreKeys = options.ignoreKeys || [];
    const enabledPathList = options.enabledPathList || [];
    const mode = options.mode || modeTypes.ADD

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

    /**
     * 機能を有効にするページかどうかを返す
     *
     * @returns {boolean}
     */
    const locationIsEnabledPage = () => {
      const pathSome = (locationPathname, allowList) => {
        return allowList.some(allow => {
          return locationPathname.match(new RegExp(allow));
        });
      };
      if (enabledPathList.length > 0) {
        return pathSome(location.pathname, enabledPathList);
      } else {
        return true;
      }
    };

    if (!locationIsEnabledPage()) {
      return;
    }

    const anchors = [...document.querySelector(selector).getElementsByTagName('a')];
    anchors.forEach(a => {
      a.href = linkDecoration(location.href, a.href, keys, ignoreKeys, mode);
    });
  } catch (e) {
    console.log(e);
  }
};
