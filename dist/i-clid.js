'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.iClid = function (options) {
  try {
    var modeTypes = {
      ADD: 'add',
      REPLACE: 'replace'
    };
    var selector = options.selector || 'article';
    var keys = options.keys || [];
    var ignoreKeys = options.ignoreKeys || [];
    var enabledPathList = options.enabledPathList || [];
    var mode = options.mode || modeTypes.ADD;

    var linkDecoration = function linkDecoration(locationHref, linkUrlStr, paramNames) {
      var ignoreParamNames = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : modeTypes.ADD;

      var locationUrl = new URL(locationHref);
      var linkUrlObj = new URL(linkUrlStr, locationHref);

      var ignoreFromLocationSearch = function ignoreFromLocationSearch(searchParamsStr, ignoreParamNames) {
        ignoreParamNames.map(function (ignoreParamName) {
          searchParamsStr = searchParamsStr.replace(new RegExp('(\\?|&)(' + ignoreParamName + '=.*?)(?=&|#|$)', 'g'), '');
        });
        return searchParamsStr;
      };

      var newSearchStr = locationUrl.search;

      try {
        newSearchStr = ignoreFromLocationSearch(newSearchStr, ignoreParamNames);

        var paramRegexps = paramNames.map(function (paramName) {
          return new RegExp('(\\?|&)(?<param>' + paramName + '=.*?)(&|#|$)');
        });

        var matchParams = paramRegexps.map(function (regexp) {
          return newSearchStr.match(regexp);
        }).filter(function (match) {
          return match && match.groups && match.groups.param;
        }).map(function (match) {
          return match.groups.param;
        });

        if (matchParams.length > 0) {
          newSearchStr = '?' + matchParams.join('&');
        }

        if (newSearchStr === '') {
          return linkUrlStr;
        }

        if (mode === modeTypes.REPLACE) {
          return linkUrlObj.origin + linkUrlObj.pathname + newSearchStr + linkUrlObj.hash;
        } else if (mode === modeTypes.ADD) {
          var separator = linkUrlObj.search === '' ? '?' : '&';
          var modSearchStr = linkUrlObj.search + separator + newSearchStr.replace(/^\?/, '');
          return linkUrlObj.origin + linkUrlObj.pathname + modSearchStr + linkUrlObj.hash;
        } else {
          return linkUrlStr;
        }
      } catch (e) {
        return linkUrlStr;
      }
    };

    var locationIsEnabledPage = function locationIsEnabledPage() {
      var pathSome = function pathSome(locationPathname, allowList) {
        return allowList.some(function (allow) {
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

    var anchors = [].concat(_toConsumableArray(document.querySelector(selector).getElementsByTagName('a')));
    anchors.forEach(function (a) {
      a.href = linkDecoration(location.href, a.href, keys, ignoreKeys, mode);
    });
  } catch (e) {
    console.log(e);
  }
};