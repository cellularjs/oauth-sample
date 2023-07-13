import { lang } from '$share/lang';

export type MsgID = keyof typeof lang.en;

type LangGetter = () => string;

let _translations = {};

let _getLang: LangGetter;

export type LangArgs = { [k: string]: any };

export function setLangGetter(cb: LangGetter) {
  _getLang = cb;
}

export function setTranslations(translations) {
  _translations = translations;
}

/**
 * Translate text base on given message id.
 *
 * _Example:_
 * ```ts
 * const lang = {
 *   'string.invalid': 'Invalid string'
 * };
 *
 * t('string.invalid'); // Invalid string
 * ```
 */
export const t = (msgId: string, args: LangArgs = {}) => {
  const msg = getLangMsg(msgId);

  if (!msg) return msgId;

  return populateValues(msg, args);
};

function getLangMsg(msgId: string) {
  if (!_getLang) {
    return undefined;
  }

  const lang = _getLang();

  if (!_translations[lang]) {
    return undefined;
  }

  return _translations[lang][msgId];
}

function populateValues(rawMsg: string, args: LangArgs): string {
  return rawMsg.replace(/{{(\w+)}}/g, function (_, key) {
    return args[`${key}`] || '';
  });
}

/**
 * Register `t` as global function:
 **********************************************************/
global.t = t;

setLangGetter(() => {
  return 'en'; // hard code (TODO: use ALS)
});

setTranslations(lang);
