import { createContext } from 'react';
import AuthStore from './authStore';
import UIStore from './uiStore';

const authStore = new AuthStore();
const uiStore = new UIStore();

export default createContext({ authStore, uiStore });
