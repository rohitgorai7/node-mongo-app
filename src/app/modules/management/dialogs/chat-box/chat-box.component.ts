import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { ManagementApiService } from '../../services/management-api.service';
import { MainService } from 'src/app/modules/main/services/main.service';
import { MainApiService } from 'src/app/modules/main/services/main-api.service';
import { MESSAGES } from 'src/app/shared/constants/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  currentChat: any = {};
  chatUsers: any = [];
  chatForm: FormGroup;
  subscription: Subscription;
  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;
  @ViewChild('sendMsg') sendMsg: ElementRef;
  isScroll: boolean = false;
  sendAudio = new Audio();
  receivedAudio = new Audio();
  currentMessagesLength: number = 0;
  newMessagesLength: number = 0;
  firstLoad: boolean = true;

  constructor(private commonService: CommonService, private formBuilder: FormBuilder, private mainApiService: MainApiService, public mainService: MainService, private managementApiService: ManagementApiService, private ngxSpinnerService: NgxSpinnerService, private notificationService: NotificationService) { }

  async ngOnInit() {
    try {
      this.ngxSpinnerService.show();
      this.getForm();
      this.sendAudio.src = "../../../../../assets/sounds/send-msg.mp3";
      this.sendAudio.load();
      this.receivedAudio.src = "../../../../../assets/sounds/rcvd-msg.wav";
      this.receivedAudio.load();
      await this.getChatUsers();
      const user: any = this.commonService.currentChatData;
      if (user?._id) {
        this.currentChat.userId = user._id;
        this.currentChat.isLoggedIn = user.isLoggedIn;
      }
      if (this.chatUsers.length) {
        await this.getMessages();
        this.isScroll = true;
        this.sendMsg.nativeElement.focus();
      }
      this.continuousApis();
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG);
    } finally {
      this.firstLoad = false;
      this.ngxSpinnerService.hide();
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(() => {
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    this.commonService.currentChatData = {};
    this.isScroll = false;
    this.commonService.runContinuous = false;
  }

  scrollToBottom() {
    try {
      if (this.isScroll) {
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
        this.isScroll = false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  continuousApis() {
    if (this.mainService.user && this.mainService.user.isLoggedIn) {
      this.subscription = interval(5000).subscribe(() => {
        if (this.mainService.user && this.mainService.user.isLoggedIn && this.commonService.runContinuous) {
          this.getChatUsers();
          this.getMessages();
        }
      });
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
      if (user._id) {
        to = user._id;
      } else if (this.currentChat.userId) {
        to = this.currentChat.userId;
      } else {
        to = this.chatUsers?.[0]?._id;
      }
      const params = {
        to
      }
      const response: any = await this.managementApiService.getMessages(params);
      this.currentChat = response['data'];
      this.currentChat.userId = to;
      this.newMessagesLength = this.currentChat.messages?.length;
      if (!this.firstLoad && this.currentChat.userId && (this.newMessagesLength > this.currentMessagesLength)) {
        if (this.currentChat.messages?.[this.currentChat.messages?.length - 1]?.sender !== this.mainService.user.userId) {
          this.receivedAudio.play();
        }
      }
      this.currentMessagesLength = this.newMessagesLength;
      if (user._id) {
        this.currentChat.isLoggedIn = user.isLoggedIn;
      } else if (this.currentChat.userId) {
        this.currentChat.isLoggedIn = this.chatUsers.find((user: any) => user._id === this.currentChat.userId)?.isLoggedIn;
      } else {
        this.currentChat.isLoggedIn = this.chatUsers?.[0]?.isLoggedIn;
      }
      if (user._id) {
        this.isScroll = true;
        this.sendMsg.nativeElement.focus()
      }
    } catch (error) {
      if (error.status === 0 || error.status >= 500) {
        this.commonService.runContinuous = false;
      }
      this.notificationService.error(error.error?.message || error.message || MESSAGES.WENT_WRONG);
    }
  }

  async getChatUsers() {
    try {
      const response: any = await this.mainApiService.getChatUsers() || [];
      this.prepareChatUsers([...response?.['users']]);
    } catch (error) {
      if (error.status === 0 || error.status >= 500) {
        this.commonService.runContinuous = false;
      }
      this.notificationService.error(error.error?.message || error.message);
    }
  }

  prepareChatUsers(response: any) {
    this.chatUsers = [...response].filter((user: any) => user._id !== this.mainService.user.userId);
    this.chatUsers.sort((a: any, b: any) => {
      if (b.lastMessage?.createdAt && a.lastMessage?.createdAt) {
        return Date.parse(b.lastMessage?.createdAt) - Date.parse(a.lastMessage?.createdAt);
      } else if (!b.lastMessage?.createdAt && a.lastMessage?.createdAt) {
        return -1;
      } else if (b.lastMessage?.createdAt && !a.lastMessage?.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  async sendMessage() {
    try {
      if (!(this.chatForm.status === 'VALID' && this.currentChat.userId)) {
        return;
      }
      const payload = {
        message: this.chatForm.controls['message'].value,
        messageType: this.chatForm.controls['messageType'].value,
        to: this.currentChat.userId
      }
      await this.managementApiService.sendChat(payload);
      this.sendAudio.play();
      this.chatForm.controls['message'].reset();
      this.getChatUsers();
      this.getMessages();
      this.isScroll = true;
      this.sendMsg.nativeElement.blur();
    } catch (error) {
      if (error.status === 0 || error.status >= 500) {
        this.commonService.runContinuous = false;
      }
      this.notificationService.error(error.error?.message || error.message);
    }
  }

  handleSendMessage(event: any) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
