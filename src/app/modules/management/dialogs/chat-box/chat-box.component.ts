import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { ManagementApiService } from '../../services/management-api.service';
import { MainService } from 'src/app/modules/main/services/main.service';
import { MainApiService } from 'src/app/modules/main/services/main-api.service';
import { MESSAGES } from 'src/app/shared/constants/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  currentChat: any = {};
  chatUsers: any = [];
  chatForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private mainApiService: MainApiService,public mainService: MainService, private managementApiService: ManagementApiService, private ngxSpinnerService: NgxSpinnerService, private notificationService: NotificationService) { }

  async ngOnInit() {
    try {
      this.ngxSpinnerService.show();
      this.getForm(); 
      await this.getChatUsers();
      if(this.chatUsers.length){
        await this.getMessages();
      }
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG );
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  getForm() {
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
      messageType: ['text', Validators.required]
    });
  }

  async getMessages(user: any = {}) {
    try {
      let to = '';
      if(user._id) {
        to = user._id;
      } else {
        to = this.chatUsers?.[0]?._id;
      }
      const params = {
        to
      }
      const response: any = await this.managementApiService.getMessages(params);
      this.currentChat = response['data'];
      this.currentChat.userId = to;
      if(user._id) {
        to = user._id;
        this.currentChat.isLoggedIn = user.isLoggedIn;
      } else {
        to = this.chatUsers?.[0]?._id;
        this.currentChat.isLoggedIn = this.chatUsers?.[0]?.isLoggedIn;
      }
      this.chatForm.controls['message'].reset();
    } catch (error) {
      console.log(error);
      this.notificationService.error(error.error?.message || error.message || MESSAGES.WENT_WRONG );
    }
  }

  async getChatUsers() {
    try {
      const response: any = await this.mainApiService.getChatUsers() || [];
      this.chatUsers = response['users'].filter((user: any) => user._id !== this.mainService.user.userId) || [];
    } catch (error) {
      this.notificationService.error(error.error?.message || error.message );
    }
  }

  async sendMessage() {
    try {
      if(!(this.chatForm.status === 'VALID' && this.currentChat.userId)) {
        return;
      }
      console.log(this.currentChat);
      const payload = {
        message: this.chatForm.controls['message'].value,
        messageType: this.chatForm.controls['messageType'].value,
        to: this.currentChat.userId
      }
      console.log(payload);
      await this.managementApiService.sendChat(payload);
      this.chatForm.controls['message'].reset();
      this.getChatUsers();
      this.getMessages({_id: this.currentChat.userId});
    } catch (error) {
      this.notificationService.error(error.error?.message || error.message );
    }
  }
}
