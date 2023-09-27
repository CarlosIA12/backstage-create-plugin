import { createDevApp } from '@backstage/dev-utils';
import { listCommitsPlugin } from '../src/plugin';

createDevApp()
  .registerPlugin(listCommitsPlugin)
  .render();
