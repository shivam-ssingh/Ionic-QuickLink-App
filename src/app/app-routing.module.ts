import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'add-link',
    loadChildren: () => import('./pages/add-link/add-link.module').then( m => m.AddLinkPageModule)
  },
  {
    path: 'view-article',
    loadChildren: () => import('./pages/view-article/view-article.module').then( m => m.ViewArticlePageModule)
  },
  {
    path: 'edit-article',
    loadChildren: () => import('./pages/edit-article/edit-article.module').then( m => m.EditArticlePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
