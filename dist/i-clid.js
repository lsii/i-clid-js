'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.iClid = function (options) {
  try {
    var selector = options.selector || 'article';
    var keys = options.keys || [];
    var enabledPathList = options.enabledPathList || [];

    var linkDecoration = function linkDecoration(locationHref, linkUrlStr, paramNames) {
      var locationUrl = new URL(locationHref);
      var paramRegexps = paramNames.map(function (paramName) {
        return new RegExp('(\\?|&)(?<param>' + paramName + '=.*?)(&|#|$)');
      });

      var matchParams = paramRegexps.map(function (regexp) {
        return locationUrl.search.match(regexp);
      }).filter(function (match) {
        return match && match.groups && match.groups.param;
      }).map(function (match) {
        return match.groups.param;
      });

      if (matchParams.length > 0) {
        var linkUrlObj = new URL(linkUrlStr, locationHref);
        var matchParamStr = matchParams.join('&');
        var modParamStr = '';
        if (linkUrlObj.search) {
          modParamStr = linkUrlObj.search + '&' + matchParamStr;
        } else {
          modParamStr = '?' + matchParamStr;
        }
        return linkUrlObj.origin + linkUrlObj.pathname + modParamStr + linkUrlObj.hash;
      } else {
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
      a.href = linkDecoration(location.href, a.href, keys);
    });
  } catch (e) {
    console.log(e);
  }
};
