import { el, mount, unmount } from 'redom';

import storage from './storage';

/**
 * RE:DOM component representing single item in a shopping list.
 */
export default class Item {
  constructor () {
    this.el = el('li.collection-item.avatar.valign-wrapper',
      this.toggleButton = el('a.btn-flat.circle',
        this.icon = el('i.material-icons', 'check_box_outline_blank')
      ),
      this.mainContainer = el('span.title',
        { style: 'width: 100%' },
        this.textContainer = el('span', {
          style: 'width: 100%; display: inline-block'
        })
      ),
      this.deleteButton = el('a.btn.red.secondary-content',
        el('i.material-icons', 'delete')
      )
    );

    this.toggleButton.addEventListener('click', this.onToggle.bind(this));
    this.textContainer.addEventListener('click', this.onEdit.bind(this));
    this.deleteButton.addEventListener('click', this.onDelete.bind(this));
  }

  get isDone () {
    return this.icon.innerText === 'check_box';
  }

  set isDone (value) {
    this.icon.innerText = value ? 'check_box' : 'check_box_outline_blank';
  }

  get text () {
    return this.textContainer.innerText;
  }

  set text (text) {
    this.textContainer.innerText = text;
  }

  update ({ id, done, text }) {
    this.id = id;
    this.isDone = !!done;
    this.text = text;
  }

  onToggle () {
    this.isDone = !this.isDone;
    if (this.id) {
      storage.dispatchEvent(new CustomEvent('update', {
        detail: {
          id: this.id,
          done: this.isDone,
          text: this.text
        }
      }));
    }
  }

  onDelete () {
    if (this.id) {
      storage.dispatchEvent(new CustomEvent('delete', {
        detail: this.id
      }));
    }
  }

  onEdit () {
    const oldValue = this.text;
    const input = el(
      'input.input',
      {
        type: 'text',
        value: oldValue
      }
    );
    const submit = () => {
      const newValue = input.value.trim();

      unmount(this.mainContainer, input);
      mount(this.mainContainer, this.textContainer);
      this.text = newValue;

      if (oldValue !== newValue) {
        storage.dispatchEvent(new CustomEvent(this.id ? 'update' : 'create', {
          detail: {
            id: this.id,
            done: this.isDone,
            text: newValue
          }
        }));
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
}
