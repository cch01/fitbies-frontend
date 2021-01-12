import { createContext } from 'react';
import AuthStore from './authStore';

const authStore = new AuthStore();

export default createContext({ authStore });
