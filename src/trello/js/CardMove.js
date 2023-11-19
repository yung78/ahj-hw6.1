export default class CardMove {
  constructor() {
    this.cardContainers = document.querySelectorAll('.cards_container');
    this.columnsLocations = {};
    this.draggedElement = null;
    this.plug = null;
    this.cardsLocations = [];
    this.mouseEnter = false;

    this._columnLocation();
  }

  onMouseDown = (e) => {
    e.preventDefault();
    if (e.button !== 0) {
      return;
    }

    if (e.target.classList.contains('card')) {
      const { clientX, clientY } = e;
      const { left, top, height } = e.target.getBoundingClientRect();

      this.difTop = clientY - top;
      this.difLef = clientX - left;
      this.height = height + (height * 0.012);
      this.draggedElement = e.target;
      this.draggedElement.classList.add('drugged');

      this._cardLocation();
    }
  };

  // Сохранение координат и элементов колонок
  _columnLocation() {
    this.cardContainers.forEach((el) => {
      const selector = el.className.replace('cards_container ', '');
      const { left, right, top, bottom } = el.getBoundingClientRect();

      this.columnsLocations[selector] = { left, right, top, bottom, el };
    });
  }

  // Сохранение координат и элементов карточек
  _cardLocation() {
    document.querySelectorAll('.card').forEach((el) => {
      if (!el.classList.contains('drugged')) {
        const { left, right, top, bottom } = el.getBoundingClientRect();

        this.cardsLocations.push({ left, right, top, bottom, el });
      }
    });
  }

  // Удаление и создание проекции(допустима только одна проекция)
  _createElement() {
    if (document.querySelector('.plug')) {
      document.querySelector('.plug').remove();
    }

    const div = document.createElement('div');
    div.classList.add('plug');
    div.style.height = `${this.height}px`;
    div.style.width = '100%';

    return div;
  }

  // Создание проекций
  _createPlug(e) {
    // Проекция при наличии карточек
    this.cardsLocations.forEach((card) => {
      // Проверка: курсор в границах одной из карточек
      if ((e.clientX >= card.left)
      && (e.clientX <= card.right)
      && (e.clientY >= card.top)
      && (e.clientY <= card.bottom)) {
        this.plug = this._createElement();
        if (e.clientY > (card.top + (card.bottom - card.top) / 2)) {
          card.el.after(this.plug);
        } else {
          card.el.before(this.plug);
        }
      }
    });

    // Проекция в колонку при отсутствии карточек, или с одной карточкой, которую перетаскиваем
    Object.keys(this.columnsLocations).forEach((column) => {
      // Проверка: курсор в границах одной из колонок
      if ((e.clientX >= this.columnsLocations[column].left)
      && (e.clientX <= this.columnsLocations[column].right)
      && (e.clientY >= this.columnsLocations[column].top)
      && (e.clientY <= this.columnsLocations[column].bottom)) {
        const dropColumn = this.columnsLocations[column].el;
        // Проверка: в колонке нет карточек
        if ((!dropColumn.querySelector('.card'))) {
          this.plug = this._createElement();
          dropColumn.append(this.plug);
          // Проверка: в колонке только перетаскиваемая карточка
        } else if ((dropColumn.querySelectorAll('.card').length === 1)
        && (dropColumn.querySelector('.card').classList.contains('drugged'))) {
          this.plug = this._createElement();
          this.columnsLocations[column].el.append(this.plug);
        }
      }
    });
  }

  // Дефолтное состояние
  _clearAll() {
    this.cardsLocations = [];
    this.draggedElement.className = 'card';
    this.draggedElement = null;
    this.plug = null;
  }

  // Перемещение элемента
  onMouseMove = (e) => {
    if (this.draggedElement) {
      this.draggedElement.style.top = `${e.clientY - this.difTop}px`;
      this.draggedElement.style.left = `${e.clientX - this.difLef}px`;

      this._createPlug(e);
    }
  };

  // Размещение элемента
  onMouseUp = (e) => {
    if (e.button !== 0) {
      return;
    }

    if (this.plug && this.draggedElement) {
      document.querySelector('.plug').replaceWith(e.target);

      this._clearAll();
    } else if (this.draggedElement) {
      this.draggedElement.style.top = 'initial';
      this.draggedElement.style.left = 'initial';

      this._clearAll();
    }
  };
}
