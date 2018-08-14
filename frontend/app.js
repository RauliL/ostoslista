import { partition } from 'lodash';
import { el, list, mount } from 'redom';
import swal from 'sweetalert';

import apiClient from './api';
import Item from './item';
import storage from './storage';

export default class App {
  constructor () {
    this.el = el('section.section',
      el('.field', el('.control',
        this.addButton = el('button.button',
          el('span.icon.is-small', el('i.fas.fa-plus')),
          el('span', 'Add new item')
        )
      )),
      this.todoList = list('.panel', Item, 'id'),
      this.doneList = list('.panel', Item, 'id')
    );

    this.addButton.addEventListener('click', (ev) => {
      const item = new Item();

      ev.preventDefault();
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
          swal({
            icon: 'error',
            text: `${err}`
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
          swal({
            icon: 'error',
            text: `${err}`
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
          swal({
            icon: 'error',
            text: `${err}`
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
        swal({
          icon: 'error',
          text: 'Unable to connect to the server.'
        });
      });
  }

  updateItemLists () {
    const [ todo, done ] = partition(this.items, (item) => !item.done);

    this.todoList.update(todo);
    this.doneList.update(done);
  }
}
