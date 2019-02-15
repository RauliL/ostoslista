import { partition } from 'lodash';
import M from 'materialize-css';
import { List, el, list, mount } from 'redom';
import { Unsubscribe } from 'redux';

import { Item } from '../common/types';

import { listItems } from './actions';
import ItemDisplay from './item-display';
import store from './store';

export default class App {
  public el: HTMLElement;
  private addButton: HTMLElement;
  private tabContainer: HTMLElement;
  private todoList: List;
  private doneList: List;
  private tabs?: M.Tabs;
  private unsubscribe?: Unsubscribe;

  constructor() {
    this.el = el('',
      el('.navbar-fixed',
        { style: { height: '112px' } },
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
        )
      ),
      el('.container',
        this.todoList = list('ul.collection#todo', ItemDisplay, 'id'),
        this.doneList = list('ul.collection#done', ItemDisplay, 'id')
      )
    );

    this.addButton.addEventListener('click', (ev) => {
      const item = new ItemDisplay();

      ev.preventDefault();
      if (this.tabs) {
        this.tabs.select('todo');
      }
      mount(this.todoList, item);
      item.onEdit();
    });
  }

  public onmount() {
    this.unsubscribe = store.subscribe(() => {
      const { items } = store.getState();
      const [ todo, done ] = partition(items, (item) => !item.done);

      this.todoList.update(todo);
      this.doneList.update(done);

      this.todoList.el.classList.toggle('hide', todo.length === 0);
      this.doneList.el.classList.toggle('hide', done.length === 0);
    });

    this.tabs = M.Tabs.init(this.tabContainer);

    store.dispatch(listItems());
  }

  public onunmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      delete this.unsubscribe;
    }

    if (this.tabs) {
      this.tabs.destroy();
      delete this.tabs;
    }
  }
}
