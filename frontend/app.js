import { escape, partition } from 'lodash';
import M from 'materialize-css';
import { el, list, mount } from 'redom';

import apiClient from './api';
import Item from './item';
import storage from './storage';

export default class App {
  constructor () {
    this.el = el('',
      el('nav.nav-extended',
        el('.nav-wrapper',
          el('a.brand-logo',
            { href: '#' },
            el('i.material-icons', 'shopping_cart'),
            'Ostoslista'
          ),
          el('ul.right',
            el('li', this.addButton = el('a', el('i.material-icons', 'add')))
          ),
        ),
        el('.nav-content',
          this.tabContainer = el('ul.tabs.tabs-transparent',
            el('li.tab', el('a.active',
              { href: '#todo' },
              'ToDo',
              el('i.material-icons.left', 'check_box_outline_blank')
            )),
            el('li.tab', el('a',
              { href: '#done' },
              'Done',
              el('i.material-icons.left', 'check_box')
            ))
          )
        )
      ),
      el('.container',
        this.todoList = list('ul.collection#todo', Item, 'id'),
        this.doneList = list('ul.collection#done', Item, 'id')
      )
    );

    this.addButton.addEventListener('click', (ev) => {
      const item = new Item();

      ev.preventDefault();
      if (this.tabs) {
        this.tabs.select('todo');
      }
      mount(this.todoList, item);
      item.onEdit();
    });

    this.items = [];
  }

  onmount () {
    storage.addEventListener('create', (ev) => {
      const item = ev.detail;

      apiClient.put('/', item)
        .then((response) => {
          this.items.push({
            id: response.data.id,
            text: response.data.text,
            done: response.data.done !== '0'
          });
          this.updateItemLists();
        })
        .catch((err) => {
          console.error(err);
          M.toast({
            html: escape(`${err}`),
            classes: 'red'
          });
        });
    });

    storage.addEventListener('delete', (ev) => {
      const id = ev.detail;

      apiClient.delete(`/${id}`)
        .then((response) => {
          this.items = this.items.filter((item) => item.id !== id);
          this.updateItemLists();
        })
        .catch((err) => {
          console.error(err);
          M.toast({
            html: escape(`${err}`),
            classes: 'red'
          });
        });
    });

    storage.addEventListener('update', (ev) => {
      const item = ev.detail;

      apiClient.patch(`/${item.id}`, item)
        .then((response) => {
          Object.assign(this.items.find((i) => i.id === response.data.id), {
            id: response.data.id,
            text: response.data.text,
            done: response.data.done !== '0'
          });
          this.updateItemLists();
        })
        .catch((err) => {
          console.error(err);
          M.toast({
            html: escape(`${err}`),
            classes: 'red'
          });
        });
    });

    apiClient.get('/')
      .then((response) => {
        this.items = response.data.map((item) => ({
          id: item.id,
          text: item.text.trim(),
          done: item.done !== '0'
        }));
        this.updateItemLists();
      })
      .catch((err) => {
        console.error(err);
        M.toast({
          html: 'Unable to connect to the server.',
          classes: 'red'
        });
      });

    this.tabs = M.Tabs.init(this.tabContainer);
  }

  onunmount () {
    if (this.tabs) {
      this.tabs.destroy();
      delete this.tabs;
    }
  }

  updateItemLists () {
    const [ todo, done ] = partition(this.items, (item) => !item.done);

    this.todoList.update(todo);
    this.doneList.update(done);
  }
}
