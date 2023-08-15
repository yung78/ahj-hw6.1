import Trello from './Trello';
import CardMove from './CardMove';

const cardMove = new CardMove();
cardMove.action();

const trello = new Trello();
trello.activeAll();
