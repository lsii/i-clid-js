
/**
 * 機能を有効にするページかどうかを返す
 */
export default function locationIsEnabledPage (
  enabledPathList: Array<string>
): boolean {
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
}
