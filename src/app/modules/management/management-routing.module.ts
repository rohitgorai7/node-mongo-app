import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { ManagementComponent } from './management.component';
import { ChatBoxComponent } from './dialogs/chat-box/chat-box.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat'
  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'chat', component: ChatBoxComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
