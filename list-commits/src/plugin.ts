import { createComponentExtension, createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const listCommitsPlugin = createPlugin({
  id: 'list-commits',
  routes: {
    root: rootRouteRef,
  },
});

// export const ListCommitsPage = listCommitsPlugin.provide(
//   createRoutableExtension({
//     name: 'ListCommitsPage',
//     component: () =>
//       import('./components/ExampleComponent').then(m => m.ExampleComponent),
//     mountPoint: rootRouteRef,
//   }),
// );

export const ListCommitsContent = listCommitsPlugin.provide(
  createComponentExtension({
    name: 'listCommitsContent',
    component: {
      lazy: () =>
        import('./components/ExampleComponent').then(
          m => m.ExampleComponent,
        ),
    },
  }),
);