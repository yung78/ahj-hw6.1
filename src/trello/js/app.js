import Trello from './Trello';
import CardMove from './CardMove';

const cardMove = new CardMove();
document.body.addEventListener('mousedown', cardMove.onMouseDown);
document.body.addEventListener('mousemove', cardMove.onMouseMove);
document.body.addEventListener('mouseup', cardMove.onMouseUp);

const trello = new Trello();
trello.activeAll();
