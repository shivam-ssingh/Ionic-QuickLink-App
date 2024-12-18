import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLinkPage } from './add-link.page';

const routes: Routes = [
  {
    path: '',
    component: AddLinkPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLinkPageRoutingModule {}
