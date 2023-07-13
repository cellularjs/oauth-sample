import type { MsgID } from '$share/i18n';
import { LangArgs } from '../i18n';

declare global {
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
  function t(msgId: MsgID, args?: LangArgs): string;
}
