import { mount } from 'redom';

import App from './app';

import '../../node_modules/materialize-css/sass/materialize.scss';

window.addEventListener(
  'DOMContentLoaded',
  () => mount(document.body, new App())
);
