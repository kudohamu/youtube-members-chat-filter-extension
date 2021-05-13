export type DropdownManagerParameter = {
  onActivate: () => void;
  onDeactivate: () => void;
};

/**
 * Youtubeのドロップダウンメニューの内容を管理するクラス
 */
export class DropdownManager {
  private activeIndex: number = 0;
  private tmpIndex: number | null = null;
  private injectedFilterMenu = false;
  private onActivate: () => void;
  private onDeactivate: () => void;

  constructor({ onActivate, onDeactivate }: DropdownManagerParameter) {
    this.onActivate = onActivate;
    this.onDeactivate = onDeactivate;
  }

  start() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!(mutation.target instanceof Element)) return;
        const dropdown = (mutation.target as Element).querySelector('tp-yt-iron-dropdown#dropdown');
        if (!this.injectedFilterMenu && !!dropdown) {
          this.handleShowDropdown();
        } else if (this.injectedFilterMenu && !dropdown) {
          this.handleHideDropdown();
        }
      });
    });

    const viewSelector = document.querySelector('span#view-selector');
    if (!viewSelector) throw new Error('span#view-selector is not found');

    this.handleShowDropdown();
    observer.observe(viewSelector, {
      childList: true,
      subtree: true
    });
  }

  private handleShowDropdown() {
    const menu = document.querySelector('tp-yt-paper-listbox#menu');
    if (!menu) throw new Error('tp-yt-paper-listbox#menu is not found');

    // 連続して呼ばれる可能性があるため子要素の数も監視する
    if (menu.childElementCount > 3) return;

    this.injectFilterMenu(menu);
    this.updateMenuItemsStyles(menu);
    this.registerMenuItemClickEventListener(menu);
    this.updateTitleLabel();
    this.injectedFilterMenu = true;
  }

  private handleHideDropdown() {
    this.injectedFilterMenu = false;
  }

  /**
   * メニューの項目にイベントリスナーを登録する
   */
  private registerMenuItemClickEventListener(menu: Element) {
    // 上位チャット
    menu.children[0].addEventListener('click', () => {
      if (this.tmpIndex) {
        this.tmpIndex = null;
        return;
      };

      this.activeIndex = 0;
      this.onDeactivate();
    });

    // すべてのチャット
    menu.children[1].addEventListener('click', () => {
      if (this.tmpIndex) {
        this.tmpIndex = null;
        return;
      };

      this.activeIndex = 1;
      this.onDeactivate();
    });

    // メンバーフィルタ
    menu.children[2].addEventListener('click', () => {
      if (menu.firstElementChild instanceof HTMLElement) {
        this.tmpIndex = 2;
        this.activeIndex = 2;

        // コメント欄的には上位チャットを選択したことにする
        menu.firstElementChild.click();
        this.onActivate();
      }
    });
  }

  /**
   * メニューの全項目のスタイルを更新する
   */
  private updateMenuItemsStyles(menu: Element) {
    Array.from(menu.children).slice(0, menu.children.length - 1).forEach((item, index) => {
      item.setAttribute('data-ytm-index', `${index}`);
      this.updateMenuItemStyles(item);
    });
  }

  /**
   * メニューの項目のスタイルを更新する
   */
  private updateMenuItemStyles(item: Element) {
    const index = item.getAttribute('data-ytm-index');
    if (index == null) return;

    if (Number(index) === this.activeIndex) {
      item.setAttribute('data-ext-ytm-selected', 'true');
      item.classList.add('iron-selected');
    } else {
      item.setAttribute('data-ext-ytm-selected', 'false');
      item.classList.remove('iron-selected');
    }
  }

  private updateTitleLabel() {
    const label = document.querySelector('div#label-text');
    if (!label) throw new Error('div#label-text is not found');

    const menu = document.querySelector('tp-yt-paper-listbox#menu');
    if (!menu) throw new Error('tp-yt-paper-listbox#menu is not found');

    Array.from(menu.children).slice(0, menu.children.length - 1).forEach((item) => {
      if (item.getAttribute('data-ext-ytm-selected') !== 'true') return;

      const title = item.querySelector('tp-yt-paper-item-body > div:first-child');
      if (!title) return;
      label.textContent = title.textContent;
    });
  }

  /**
   * コメントのフィルタメニューに「メンバーのコメントに限定してリプレイ」を追加する
   */
  private injectFilterMenu(menu: Element) {
    const item = this.generateMemberOnlyFilterMenuItem();

    menu.insertBefore(item, menu.lastElementChild);
  }

  /**
   * メンバーフィルタ用のメニューをドロップダウンに追加する
   */
  private generateMemberOnlyFilterMenuItem(): Element {
    // コンテナになるアンカータグ
    const a = document.createElement('a');
    a.setAttribute('class', 'yt-simple-endpoint style-scope yt-dropdown-menu');
    a.setAttribute('tabindex', '-1');
    a.setAttribute('aria-selected', 'false');

    const item = document.createElement('tp-yt-paper-item');
    item.setAttribute('class', 'style-scope yt-dropdown-menu');
    item.setAttribute('role', 'option');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-disabled', 'false');
    a.appendChild(item);

    const body = document.createElement('tp-yt-paper-item-body');
    body.setAttribute('class', 'style-scope yt-dropdown-menu');
    body.setAttribute('two-line', '');
    item.appendChild(body);

    const title = document.createElement('div');
    title.setAttribute('class', 'item style-scope yt-dropdown-menu');
    title.innerText = chrome.i18n.getMessage('member_filter_menu_title');
    body.appendChild(title);

    const description = document.createElement('div');
    description.setAttribute('id', 'subtitle');
    description.setAttribute('class', 'style-scope yt-dropdown-menu');
    description.innerText = chrome.i18n.getMessage('member_filter_menu_desc');
    body.appendChild(description);

    const continuation = document.createElement('yt-reload-continuation');
    continuation.setAttribute('class', 'style-scope yt-dropdown-menu');
    item.appendChild(continuation);

    return a;
  }
}
