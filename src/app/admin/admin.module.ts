import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared.module';

//ADMIN PAGES
import { AdminCollectionListComponent } from './pages/collection-list/collection-list.component';
import { AdminEditCollectionComponent } from './pages/edit-collection/edit-collection.component';
import { AdminEditProductComponent } from './pages/edit-product/edit-product.component';

const routes: Routes = [
  {
    path: 'list',
    component: AdminCollectionListComponent,
  },
  {
    path: 'edit-collection/:collectionUrl',
    component: AdminEditCollectionComponent,
  },
  {
    path: 'edit-product/:collectionUrl/:productUrl',
    component: AdminEditProductComponent,
  }
];

@NgModule({
  declarations: [
    AdminCollectionListComponent,
    AdminEditCollectionComponent,
    AdminEditProductComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
