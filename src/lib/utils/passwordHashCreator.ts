import { sha512 } from 'js-sha512';

const passwordHashCreator = (password: string):string => sha512(password);

export default passwordHashCreator;
