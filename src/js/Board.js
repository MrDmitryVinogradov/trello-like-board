/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
export default class Board {
  constructor() {
    this.columns = [];
    this.columnsText = ['TODO', 'IN PROGRESS', 'DONE'];
    this.dragging = null;
  }

  init() {
    this.renderField();
    this.loadFromLocalStorage();
    this.removeCard();
    this.moveCards();
  }

  renderField() {
    this.field = document.createElement('div');
    this.field.classList.add('field');
    for (let i = 0; i < 3; i += 1) {
      const column = document.createElement('div');
      column.classList.add('column');
      const header = document.createElement('div');
      header.classList.add('column-header');
      header.innerText = this.columnsText[i];
      column.appendChild(header);
      const tasksList = document.createElement('ul');
      tasksList.classList.add('tasks-list');
      column.appendChild(tasksList);
      const addTask = document.createElement('div');
      addTask.innerHTML = '<div class = \'add-task\'> Add a card </div>';
      column.appendChild(addTask);
      this.field.appendChild(column);
      column.querySelector('.add-task').addEventListener('click', () => {
        this.edit(column);
      });
      this.columns.push(column);
    }
    document.querySelector('body').appendChild(this.field);
  }

  // eslint-disable-next-line class-methods-use-this
  renderEditor() {
    const editor = document.createElement('div');
    editor.classList.add('editor-wrapper');
    editor.innerHTML = '<form class = \'editor\'> <textarea class = \'task-editor\' placeholder = \'What is the task? \'></textarea > <div class= \'add-task-group\'> <button class = \'add-task-btn\'> Add task </button> <div class = \'close-editor\'></div> </div> </form>';
    return editor;
  }

  edit(column) {
    column.querySelector('.add-task').style.display = 'none';
    const editor = this.renderEditor();
    column.appendChild(editor);
    column.querySelector('.editor').addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.createCard(column);
      editor.remove();
      column.querySelector('.add-task').style.display = 'block';
    });
    column.querySelector('.close-editor').addEventListener('click', () => {
      editor.remove();
      column.querySelector('.add-task').style.display = 'block';
    });
    this.saveToLocalStorage();
  }

  createCard(column) {
    if (column.querySelector('.task-editor').value) {
      const editor = this.renderEditor();
      const card = document.createElement('li');
      card.classList.add('task');
      card.innerHTML = '<div class = \'task-card\'></div>';
      const taskText = column.querySelector('.task-editor').value;
      card.querySelector('.task-card').innerText = taskText;
      const removeCard = document.createElement('div');
      removeCard.classList.add('remove-card');
      card.querySelector('.task-card').appendChild(removeCard);
      column.querySelector('.tasks-list').appendChild(card);
      editor.remove();
      column.querySelector('.add-task').style.display = 'block';
    }
    this.saveToLocalStorage();
  }

  removeCard() {
    this.field.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('remove-card')) {
        evt.target.closest('li').remove();
      }
    });
    this.saveToLocalStorage();
  }

  moveCards() {
    this.field.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('task-card')) {
        this.dragging = evt.target.closest('li');
        this.dragging.classList.add('moved');
      }
    });

    this.field.addEventListener('mousemove', (evt) => {
      evt.preventDefault();
      if (this.dragging) {
        this.dragging.classList.add('moved');
        this.dragging.style.left = `${evt.pageX - this.dragging.offsetWidth / 2}px`;
        this.dragging.style.top = `${evt.pageY - this.dragging.offsetHeight / 2}px`;
      }
    });

    document.addEventListener('mouseup', (evt) => {
      evt.preventDefault();
      if (this.dragging) {
        const copy = document.querySelector('.moved').cloneNode(true);
        copy.classList.remove('moved');
        this.dragging.hidden = true;
        copy.style = null;
        copy.classList.add('task');
        if (!document.elementFromPoint(evt.clientX, evt.clientY).closest('.column')) {
          this.dragging.hidden = null;
          this.dragging.classList.remove('moved');
          this.dragging.style = null;
          this.dragging = null;
          copy.remove();
          return false;
        }
        const closestItem = document.elementFromPoint(evt.clientX, evt.clientY);
        if (!closestItem.closest('li')) {
          copy.hidden = false;
          copy.hidden = false;
          closestItem.closest('.column').querySelector('ul').appendChild(copy);
          this.dragging.remove();
          this.dragging = null;
          return false;
        }
        if (closestItem.closest('li')) {
          copy.hidden = false;
          closestItem.closest('li').insertAdjacentElement('beforebegin', copy);
          this.dragging.remove();
          this.dragging = null;
        }
        return null;
      }
      return null;
    });
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    const columns = Array.from(document.querySelectorAll('.column'));
    for (let i = 0; i < 3; i += 1) {
      localStorage.setItem(i, columns[i].querySelector('ul').innerHTML.toString());
    }
  }

  loadFromLocalStorage() {
    const columns = Array.from(document.querySelectorAll('.column'));
    for (let i = 0; i < 3; i += 1) {
      columns[i].querySelector('ul').innerHTML = localStorage.getItem(i);
    }
  }
}
