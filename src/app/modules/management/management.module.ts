import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './components/users/users.component';
import { HeaderComponent } from './components/header/header.component';
import { ManagementComponent } from './management.component';
import { ChatBoxComponent } from './dialogs/chat-box/chat-box.component';

@NgModule({
  declarations: [ManagementComponent, UsersComponent, HeaderComponent, ChatBoxComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    SharedModule
  ]
})
export class ManagementModule { }
