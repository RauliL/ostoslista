import { el, mount, unmount } from 'redom';

import { Item } from '../common/types';

import { createItem, deleteItem, updateItem } from './actions';
import store from './store';

/**
 * RE:DOM component representing single item in a shopping list.
 */
export default class ItemDisplay {
  public el: HTMLElement;
  private toggleButton: HTMLElement;
  private icon: HTMLElement;
  private mainContainer: HTMLElement;
  private textContainer: HTMLElement;
  private deleteButton: HTMLElement;
  private id?: string;

  public constructor() {
    this.el = el('li.collection-item.row.valign-wrapper',
      el('.col.s2.l1',
        this.toggleButton = el('a.btn-flat',
          {
            style: {
              paddingLeft: 0,
              paddingRight: 0
            }
          },
          this.icon = el('i.material-icons', 'check_box_outline_blank')
        ),
      ),
      this.mainContainer = el('.col.s8.l10',
        this.textContainer = el('span', {
          style: 'width: 100%; display: inline-block'
        })
      ),
      el('.col.s2.l1',
        this.deleteButton = el('a.btn.red',
          el('i.material-icons', 'delete')
        )
      )
    );

    this.toggleButton.addEventListener('click', this.onToggle.bind(this));
    this.textContainer.addEventListener('click', this.onEdit.bind(this));
    this.deleteButton.addEventListener('click', this.onDelete.bind(this));
  }

  public get isDone(): boolean {
    return this.icon.innerText === 'check_box';
  }

  public set isDone(value: boolean) {
    this.icon.innerText = value ? 'check_box' : 'check_box_outline_blank';
  }

  public get text(): string {
    return this.textContainer.textContent || '';
  }

  public set text(text: string) {
    this.textContainer.textContent = text;
  }

  public update({ id, done, text }: Item) {
    this.id = id;
    this.isDone = !!done;
    this.text = text;
  }

  public onEdit() {
    const oldValue = this.text;
    const input = el(
      'input.input',
      {
        type: 'text',
        value: oldValue
      }
    ) as HTMLInputElement;
    const submit = () => {
      const newValue = input.value.trim();

      unmount(this.mainContainer, input);
      mount(this.mainContainer, this.textContainer);
      this.text = newValue;

      if (this.id) {
        // Only update existing items when the text has changed.
        if (oldValue !== newValue) {
          store.dispatch(updateItem({
            id: this.id,
            text: newValue,
            done: this.isDone,
          }));
        }
      } else {
        store.dispatch(createItem(newValue));
      }
    };

    unmount(this.mainContainer, this.textContainer);

    input.addEventListener('blur', submit);
    input.addEventListener('keydown', (ev) => {
      const { key } = ev;

      if (key === 'Enter' || key === 'Accept') {
        ev.preventDefault();
        submit();
      }
    });

    mount(this.mainContainer, input);
    input.focus();
  }

  private onToggle() {
    this.isDone = !this.isDone;
    if (this.id) {
      store.dispatch(updateItem({
        id: this.id,
        text: this.text,
        done: this.isDone,
      }));
    }
  }

  private onDelete() {
    if (this.id) {
      store.dispatch(deleteItem({
        id: this.id,
        text: this.text,
        done: this.isDone,
      }));
    }
  }
}
