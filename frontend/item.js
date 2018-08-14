import { el, mount, unmount } from 'redom';

import storage from './storage';

/**
 * RE:DOM component representing single item in a shopping list.
 */
export default class Item {
  constructor () {
    this.el = el('.panel-block',
      this.toggleButton = el('button.is-marginless.is-paddingless',
        {
          style: {
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer'
          }
        },
        el('span.panel-icon', this.icon = el('i.far.fa-square.fa-fw'))
      ),
      this.mainContainer = el('',
        { style: { width: '100%' } },
        this.textContainer = el('span')
      ),
      this.deleteButton = el('button.button',
        el('span.icon', el('i.fas.fa-trash-alt'))
      )
    );

    this.toggleButton.addEventListener('click', this.onToggle.bind(this));
    this.textContainer.addEventListener('click', this.onEdit.bind(this));
    this.deleteButton.addEventListener('click', this.onDelete.bind(this));
  }

  get isDone () {
    return this.icon.classList.contains('fa-check-square');
  }

  set isDone (value) {
    const { classList } = this.icon;

    if (value) {
      classList.remove('fa-square');
      classList.add('fa-check-square');
    } else {
      classList.remove('fa-check-square');
      classList.add('fa-square');
    }
  }

  get text () {
    return this.textContainer.textContent;
  }

  set text (text) {
    this.textContainer.textContent = text;
  }

  update({ id, done, text }) {
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
        value: oldValue,
        style: {
          width: '100%'
        }
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
