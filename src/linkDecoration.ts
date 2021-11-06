
import ModeTypes from "./ModeTypes";

/**
 * クエリ文字列から指定されたキーを削除する
 */
function ignoreFromLocationSearch (searchParamsStr: string, ignoreParamNames: Array<string>): string {
  ignoreParamNames.map(ignoreParamName => {
    searchParamsStr = searchParamsStr.replace(new RegExp(`(\\?|&)(${ignoreParamName}=.*?)(?=&|#|$)`, 'g'), '');
  });
  return searchParamsStr;
}

/**
 * location.hrefを元に対象リンクのクエリを装飾する
 */
export default function linkDecoration (
  locationHref: string,
  linkUrlStr: string,
  paramNames: Array<string>,
  ignoreParamNames: Array<string> = [],
  mode: string = ModeTypes.ADD
): string {
  const locationUrl = new URL(locationHref);
  const linkUrlObj = new URL(linkUrlStr, locationHref);

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

    if (mode === ModeTypes.REPLACE) {
      return linkUrlObj.origin + linkUrlObj.pathname + newSearchStr + linkUrlObj.hash;
    } else if (mode === ModeTypes.ADD) {
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
