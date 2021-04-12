
window.iClid = function (options) {
  try {
    const selector = options.selector || 'article';
    const keys = options.keys || [];
    const enabledPathList = options.enabledPathList || [];

    const linkDecoration = (locationHref, linkUrlStr, paramNames) => {
      const locationUrl = new URL(locationHref);
      const paramRegexps = paramNames.map(paramName => new RegExp(`(\\?|&)(?<param>${paramName}=.*?)(&|#|$)`));

      const matchParams = paramRegexps
        .map(regexp => locationUrl.search.match(regexp))
        .filter(match => match && match.groups && match.groups.param)
        .map(match => match.groups.param );

      if (matchParams.length > 0) {
        const linkUrlObj = new URL(linkUrlStr, locationHref);
        const matchParamStr = matchParams.join('&');
        let modParamStr = '';
        if (linkUrlObj.search) {
          modParamStr = linkUrlObj.search + '&' + matchParamStr;
        } else {
          modParamStr = '?' + matchParamStr;
        }
        return linkUrlObj.origin + linkUrlObj.pathname + modParamStr + linkUrlObj.hash;
      } else {
        return linkUrlStr;
      }
    }

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
      a.href = linkDecoration(location.href, a.href, keys);
    });
  } catch (e) {
    console.log(e);
  }
};
