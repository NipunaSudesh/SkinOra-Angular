import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  //  Dynamic category route → server render
  {
    path: 'product-category/:categorySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'product/slug/:slug',
    renderMode: RenderMode.Server,
  },

  // All other pages → prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
