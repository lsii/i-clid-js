
import linkDecoration from './linkDecoration';
import ModeTypes from './ModeTypes';
import locationIsEnabledPage from './locationIsEnabledPage';

export default function iClid (options: IClidOptions) {
  try {
    const selector = options.selector || 'article';
    const keys = options.keys || [];
    const ignoreKeys = options.ignoreKeys || [];
    const enabledPathList = options.enabledPathList || [];
    const mode = options.mode || ModeTypes.ADD;

    if (!locationIsEnabledPage(enabledPathList)) {
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
