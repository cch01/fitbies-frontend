import _ from 'lodash';
import {
  toJS, observable, computed, action, decorate,
} from 'mobx';
import Peer from 'peerjs';
// TODO split components to substores!!!
interface User {
  _id: string;
  nickname: string;
  isLeft?: string;
  email?: string;
}

enum MessageType {
  SYSTEM,
  CHAT
}

export interface Message {
  type?: MessageType;
  userId?: string;
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

interface Meeting{
  _id: string;
  initiator: User;
}

interface MeetingChannelInput {
  type: MeetingEventType;
  from: User;
  toMeeting: Meeting;
  message?: Message;
  userToBeKickedOut?:User
}

// Scope: only handle channel stuff, not streaming
class MeetingStore {
  @observable isInitiator: boolean = false;

  @observable meetingId?: string;

  @observable userId?: string;

  @observable roomId?: string;

  @observable initiator?: User;

  @observable participants: User[] = [];

  @observable messages: Message[] = [];

  @observable peer?: Peer;

  @observable joinersStreams: {[x:string]: MediaStream} = {};

  @observable joinersCallsObjects: {[x:string]: Peer.MediaConnection} = {};

  @computed get currentMessages(): Message[] {
    return toJS(this.messages);
  }

  @computed get currentParticipants(): User[] {
    return toJS(this.participants);
  }

  @action reset():void {
    console.log('reset meeting store');
    this.meetingId = undefined;
    this.userId = undefined;
    this.roomId = undefined;
    this.initiator = undefined;
    this.participants = [];
    this.messages = [];
    this.peer = undefined;
    this.joinersStreams = {};
    this.joinersCallsObjects = {};
  }

  @action setMeeting(meetingInput: MeetingInput, userId: string):void {
    this.meetingId = meetingInput._id;
    this.roomId = meetingInput.roomId;
    this.initiator = meetingInput.initiator;
    this.participants = meetingInput.participants;
    this.userId = userId;
    this.isInitiator = meetingInput.initiator._id === userId;
  }

  @action setPeer(peer: Peer): void {
    this.peer = peer;
  }

  @action disconnectServer():void {
    this.peer?.disconnect();
    this.peer = undefined;
  }

  @action addVideoStream = (connectorId: string, stream: MediaStream) => {
    this.joinersStreams = { ...this.joinersStreams, [connectorId]: stream };
  };

  @action removeVideoStream = (id: string) => {
    this.joinersStreams = _.omit(this.joinersStreams, [id]);
  };

  @action addCallObject = (connectorId: string, call: Peer.MediaConnection) => {
    this.joinersCallsObjects = { ...this.joinersCallsObjects, [connectorId]: call };
  }

  @action removeCallObject = (connectorId: string, call: Peer.MediaConnection) => _.omit(this.joinersCallsObjects, [connectorId])

  @action connectToPeer = (designatedId: string, localMediaStream: MediaStream):void => {
    if (!this.peer) {
      console.log('no peer instance');
      return;
    }
    console.log(`Connecting to ${designatedId}...`);
    const call = this.peer.call(designatedId, localMediaStream!, { metadata: { connectorId: this.userId } });
    console.log(call);
    call!.on('stream', (stream) => {
      console.log('stream coming');
      this.addVideoStream(designatedId, stream);
    });

    call!.on('close', () => {
      console.log(`media stream connection with ${designatedId} closed`);
      this.removeVideoStream(designatedId);
    });

    call!.on('error', () => {
      console.log(`error occurred with ${designatedId} `);
      this.removeVideoStream(designatedId);
    });
    this.joinersCallsObjects = { ...this.joinersCallsObjects, [designatedId]: call };
  }

  @action disconnectPeer = (designatedId: string): void => {
    if (!this.joinersCallsObjects[designatedId]) return;
    console.log(`closing media connection with ${designatedId}`);
    this.joinersCallsObjects[designatedId].close();
    this.removeVideoStream(designatedId);
    this.joinersCallsObjects = _.omit(this.joinersCallsObjects, [designatedId]);
  };

  @action getJoinerIds(userId:string): string[] { // except self and initiator
    if (!this.initiator) return [];
    const result = this.participants
      .filter((p) => !(p._id === userId || p._id === this.initiator?._id));
    return result.map((_r) => _r._id);
  }

  private updateLeftParticipant(target: User): void {
    const index = _.findIndex(this.participants, (_p) => _p._id === target._id);
    if (index > -1) {
      this.participants = this.participants.splice(index, 1, target);
      this.disconnectPeer(target._id);
    }
  }

  @action eventDispatcher(meetingChannelInput: MeetingChannelInput): void {
    const { from } = meetingChannelInput;
    const { toMeeting, userToBeKickedOut, message } = meetingChannelInput;
    if (toMeeting._id !== this.meetingId) return;

    // TODO: with snack bar / toast
    switch (meetingChannelInput.type) {
      case MeetingEventType.USER_JOINED: {
        const index = _.findIndex(this.participants, (_p) => _p._id === from._id);
        if (index > -1) {
          this.participants = this.participants.splice(index, 1, from);
          this.disconnectPeer(from._id);
        } else {
          this.participants.push(from);
        }
        this.messages.push({
          type: MessageType.SYSTEM,
          sentAt: new Date(),
          content: `${from!.nickname} joined`,
        });
        break;
      }

      case MeetingEventType.LEAVE_MEETING:
        this.updateLeftParticipant(from);
        this.messages.push({
          type: MessageType.SYSTEM,
          sentAt: new Date(),
          content: `${from!.nickname} left`,
        });
        break;

      case MeetingEventType.BLOCK_USER:
        if (userToBeKickedOut!._id === this.userId) {
          this.disconnectServer();
        } else {
          this.updateLeftParticipant(userToBeKickedOut!);
        }
        this.messages.push({
          type: MessageType.SYSTEM,
          sentAt: new Date(),
          content: `${userToBeKickedOut!.nickname} has been blocked by meeting holder`,
        });
        break;

      case MeetingEventType.END_MEETING:
        this.disconnectServer();
        this.reset();
        // TODO: toast for end meeting
        break;

      case MeetingEventType.MESSAGE:
        this.messages.push({ ...message!, type: MessageType.CHAT, userId: from._id });
        break;

      default:
    }
  }
}

export default MeetingStore;
