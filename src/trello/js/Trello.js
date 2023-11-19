export default class Trello {
  constructor() {
    this.addBtns = document.querySelectorAll('.add_btn');
    this.closeBtns = document.querySelectorAll('.close_btn');
    this.forms = document.querySelectorAll('.add_form');
    this.addBars = document.querySelectorAll('.add_bar');
    this.containers = document.querySelectorAll('.cards_container');
    this.saveObj = {};
  }

  // Метод создания карточки
  _createCard(text) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card_text">
        ${text}
      </div>
      <div class="card_delete">&times;</div>
    `;

    return card;
  }

  // Метод открытия поля для добавления карточки при нажатии кнопки
  _openAddBar() {
    this.addBtns.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        this.addBars.forEach((elem) => elem.classList.remove('active'));
        this.addBtns.forEach((elem) => elem.classList.add('active'));

        e.target.classList.remove('active');
        e.target.nextElementSibling.classList.add('active');
        e.target.closest('footer').querySelector('textarea').addEventListener('click', (evt) => evt.target.focus());
      });
    });
  }

  // Метод закрытия поля для добавления карточки
  _closeAddBar(el) {
    const textArea = el.closest('.add_bar').querySelector('.input_text');

    el.closest('.add_bar').classList.remove('active');
    el.closest('.add_bar').previousElementSibling.classList.add('active');

    textArea.value = '';
    textArea.placeholder = 'Enter a title for this card...';
  }

  // Метод закрытия поля для добавления карточки при нажатии кнопки
  _closeAddBarBtn() {
    this.closeBtns.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        this._closeAddBar(e.target);
      });
    });
  }

  // Метод сохранения карточки в одной из колонок при событии submit
  _saveCard() {
    this.forms.forEach((el) => {
      el.addEventListener('submit', (e) => {
        e.preventDefault();

        const textArea = el.querySelector('.input_text');

        if (textArea.value) {
          const card = this._createCard(textArea.value);
          textArea.placeholder = 'Enter a title for this card...';

          e.target.closest('.add').previousElementSibling.append(card);

          this._dataSave();
          this._closeAddBar(textArea);
        } else {
          textArea.placeholder = 'TITLE IS EMPTY!!!';
          textArea.style.cssText = 'font-weight: 700;';

          setTimeout(() => {
            textArea.style.cssText = 'font-weight: 400;';
          }, 1000);
        }
      });
    });
  }

  // Метод удаления карточки из колоноки при нажатии кнопки
  _deleteCard() {
    document.querySelectorAll('.cards_container').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        if (e.target.classList.contains('card_delete')) {
          e.target.closest('.card').remove();
          this._dataSave();
        }
      });
    });
  }

  // Метод сохранения данных карточек в localStorage
  _dataSave() {
    this.containers.forEach((el) => {
      const selector = el.className.replace('cards_container ', '');
      this.saveObj[selector] = [...el.querySelectorAll('.card_text')].map((elem) => elem.textContent);
    });

    const saveData = JSON.stringify(this.saveObj);
    localStorage.setItem('saveData', saveData);
  }

  // Метод загрузки данных карточек из localStorage
  _dataLoad() {
    window.addEventListener('load', () => {
      const loadData = JSON.parse(localStorage.getItem('saveData'));
      if (loadData) {
        Object.keys(loadData).forEach((el) => {
          const container = document.querySelector(`.${el}`);
          container.innerHTML = '';

          if (loadData[el]) {
            loadData[el].forEach((string) => {
              const newCard = this._createCard(string);

              document.querySelector(`.${el}`).append(newCard);
            });
          }
        });
      }
    });
  }

  activeAll() {
    this._openAddBar();
    this._closeAddBarBtn();
    this._saveCard();
    this._deleteCard();
    this._dataLoad();
  }
}
