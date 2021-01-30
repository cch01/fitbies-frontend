import {
  toJS, observable, computed, action, decorate,
} from 'mobx';

interface User {
  _id: string;
  nickname: string;
  isLeft?: string;
  email?: string;
}
interface Message {
  userId: string;
  content: string;
  sentAt: Date;
}

interface MeetingInput {
  _id: string;
  roomId: string;
  initiator: User;
  participants: User[];
}

enum MeetingEventType {
  USER_JOINED = 'USER_JOINED',
  MESSAGE = 'MESSAGE',
  BLOCK_USER = 'BLOCK_USER',
  END_MEETING = 'END_MEETING',
  LEAVE_MEETING = 'LEAVE_MEETING',
}

interface MeetingChannelInput {
  type: MeetingEventType;
  from: User;
  toMeeting: string;
  message?: any;
  userToBeKickedOut?:User
}

// Scope: only handle channel stuff, not streaming
class MeetingSubscriptionStore {
  @observable meetingId?: string;

  @observable roomId?: string;

  @observable initiator?: User;

  @observable participants?: User[];

  @observable messages?: Message[];

  @action initMeeting(meetingInput: MeetingInput):void {
    this.meetingId = meetingInput._id;
    this.roomId = meetingInput.roomId;
    this.initiator = meetingInput.initiator;
    this.participants = meetingInput.participants;
  }

  @action actionDispatcher(meetingChannelInput: MeetingChannelInput) {
    // TODO: with snack bar / toast
    switch (meetingChannelInput.type) {
    }
  }

  @computed getOtherJoiners() { // except self and initiator

  }
}
