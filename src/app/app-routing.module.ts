import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoContentComponent } from './pages/404/no-content.component'
import { HomeComponent } from './pages/home/home.component';
import { RoutingPageComponent } from './pages/routing-page/routing-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: ':collectionUrl',
    component: RoutingPageComponent
  },
  {
    path: 'arts&fashion',
    component: ListPageComponent,
    data: { url: 'arts&fashion' }
  },
  {
    path: 'music',
    component: ListPageComponent,
    data: { url: 'music' }
  },
  {
    path: 'sports',
    component: ListPageComponent,
    data: { url: 'sports' }
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  },

  {
    path: '404',
    component: NoContentComponent
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
