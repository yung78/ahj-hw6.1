export default class CardMove {
  constructor() {
    this.cardContainers = document.querySelectorAll('.cards_container ');
    this.elLocations = {};
  }

  static cardsLocations = [];

  static target;

  static difTop;

  static difLef;

  static height;

  static _createElement() {
    if (document.querySelector('.plug')) {
      document.querySelector('.plug').remove();
    }

    const div = document.createElement('div');
    div.classList.add('plug');
    div.style.height = `${CardMove.height}px`;
    div.style.width = '100%';

    return div;
  }

  _mouseDown() {
    this.cardContainers.forEach((el) => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();

        if (e.target.className === 'card') {
          const { clientX, clientY } = e;
          const { left, top, height } = e.target.getBoundingClientRect();

          CardMove.difTop = clientY - top;
          CardMove.difLef = clientX - left;
          CardMove.target = e.target;
          CardMove.height = height;

          CardMove.target.classList.add('drugged');

          document.documentElement.addEventListener('mousemove', this.move);
          this._mouseUp();
          this._columnLocation();
          this._cardLocation();
        }
      });
    });
  }

  _columnLocation() {
    this.cardContainers.forEach((el) => {
      const selector = el.className.replace('cards_container ', '');
      const { left, right, top, bottom } = el.getBoundingClientRect();

      this.elLocations[selector] = { left, right, top, bottom };
    });
  }

  _cardLocation() {
    document.querySelectorAll('.card').forEach((el) => {
      if (!el.classList.contains('drugged')) {
        const { left, right, top, bottom } = el.getBoundingClientRect();

        CardMove.cardsLocations.push({ left, right, top, bottom, el });
      }
    });
  }

  _mouseUp() {
    document.documentElement.addEventListener('mouseup', (e) => {
      if (document.querySelector('.drugged')) {
        CardMove.target.classList.remove('drugged');
      }

      Object.keys(this.elLocations).forEach((el) => {
        if ((e.clientX >= this.elLocations[el].left)
        && (e.clientX <= this.elLocations[el].right)
        && (e.clientY >= this.elLocations[el].top)
        && (e.clientY <= this.elLocations[el].bottom)) {
          CardMove.cardsLocations.forEach((elem) => {
            if ((e.clientX >= elem.left)
            && (e.clientX <= elem.right)
            && (e.clientY >= elem.top)
            && (e.clientY <= elem.bottom)) {
              if (e.clientY > (elem.top + (elem.bottom - elem.top) / 2)) {
                elem.el.after(CardMove.target);
              } else {
                elem.el.before(CardMove.target);
              }
            } else {
              document.querySelector(`.${el}`).append(CardMove.target);
            }
          });
        }

        CardMove.target.style.top = 'initial';
        CardMove.target.style.left = 'initial';
      });

      CardMove._createElement();

      document.documentElement.removeEventListener('mousemove', this.move);
    });
  }

  move(e) {
    CardMove.cardsLocations.forEach((el) => {
      if ((e.clientX >= el.left)
      && (e.clientX <= el.right)
      && (e.clientY >= el.top)
      && (e.clientY <= el.bottom)) {
        const plug = CardMove._createElement();
        if (e.clientY > (el.top + (el.bottom - el.top) / 2)) {
          el.el.after(plug);
        } else {
          el.el.before(plug);
        }
      }
    });

    CardMove.target.style.top = `${e.clientY - CardMove.difTop}px`;
    CardMove.target.style.left = `${e.clientX - CardMove.difLef}px`;
  }

  action() {
    this._mouseDown();
  }
}
