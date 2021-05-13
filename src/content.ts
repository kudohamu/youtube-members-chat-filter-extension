/**
 * YoutubeのDOMを触ることができるスクリプト
 * ここでコメント欄のDOMを見てフィルタリングを行う
 */

import './content.scss';
import { rootClassName } from './constants';
import { DropdownManager } from './DropdownManager';
import { printError } from './utils';

// メンバーフィルタ用のメニューが選択されたらコメント欄をフィルタする
async function execute() {
  // Youtube本体のエラー監視に迷惑をかけないように全体をtry-catchする
  try {
    console.warn('loaded!!!');
    document.body.classList.add(rootClassName);

    const manager = new DropdownManager({
      onActivate: () => document.body.setAttribute('data-ext-ytm-active', 'true'),
      onDeactivate: () => document.body.setAttribute('data-ext-ytm-active', 'false'),
    });
    manager.start();
  } catch (e) {
    printError(e);
  }
}

execute();
