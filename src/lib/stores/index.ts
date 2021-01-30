import { createContext } from 'react';
import AuthStore from './authStore';
import UIStore from './uiStore';
import MeetingStore from './meetingStore';

const authStore = new AuthStore();
const uiStore = new UIStore();
const meetingStore = new MeetingStore();

export default createContext({ authStore, uiStore, meetingStore });
