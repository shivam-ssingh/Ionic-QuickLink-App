import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLinkPageRoutingModule } from './add-link-routing.module';

import { AddLinkPage } from './add-link.page';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddLinkPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddLinkPage],
  providers: [provideHttpClient()],
})
export class AddLinkPageModule {}
