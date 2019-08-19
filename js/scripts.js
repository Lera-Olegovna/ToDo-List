(function(){
	'use strict';

	// блок переменных

	let todoInput = document.getElementById('todoInput'),
		addBtn 	  = document.getElementById('addBtn'),
		form	  = document.querySelector('form');

	// вывод существующих задач из локального хранилища
	let existTodos = getStorage();
	existTodos.forEach(function(todo) {
		createTask('todos', todo);
	});

	// добавление событий

	todoInput.addEventListener('input', function(event) {
		// console.log(event);

		if (todoInput.value.length > 3) {          // определяем длину строки, которую ввели в инпут и сраснивам с 3
			addBtn.removeAttribute('disabled');    // разблокирование кнопки путем удаления атрибута disabled
		} else {
			addBtn.setAttribute('disabled', true); // разблокирование кнопки путем удаления атрибута disabled
		}	
	});

	form.addEventListener('submit', function(event) {
		event.preventDefault();                    // запрещаем отправку формы

		createTask('todos', todoInput.value);	   // вызов функции создания введенной задачи в списке todos 
		createTaskAtStorage(todoInput.value);				   // вызов фукнции созранения задачи в locaStorage

		todoInput.value = '';					   // очистка значиния поля ввода
		addBtn.setAttribute('disabled', true);     // разблокирование кнопки путем удаления атрибута disabled
	});

	


	// блок функций

	function createTask(targetList, text) {

		let newLi = document.createElement('li'),           			// создание элемента списка
			html  = `							 
				<label>
					<input type="checkbox">
					<span>${text}</span>
				</label>
				<input type="text" value="${text}" hidden>
				<button class="editBtn">Edit</button>
				<button class="deleteBtn">Delete</button>
				<button class="saveBtn" hidden>Save</button>
				<button class="cancelBtn" hidden>Cancel</button>`; // готовим html для элемента списка todos

		if (targetList == 'completed') {
			html = `${text} <button class="deleteBtn">Delete</button>`; // готовим html для элемента списка completed
		}

		newLi.innerHTML = html;											// записываем html в элемент списка

		document.getElementById(targetList).appendChild(newLi); 		// выводим элемент списка в указанный список (todos или completed)
																		// todos при создании элемента
																		// completed при перемещении элемента

		addEvents(newLi);												// вызываем функцию добавления событий
	} 

	function addEvents(li) {
		
		let checkbox  = li.querySelector('input[type="checkbox"]'),		// находим checkbox
			label     = li.querySelector('label'),						// находим label
			deleteBtn = li.querySelector('.deleteBtn'),					// находим кнопку удаления задачи
			editBtn	  = li.querySelector('.editBtn'),					// находим кнопку редактирования задачи
			editInput = li.querySelector('input[type="text"]'),         // находим поле редактирования текста задачи
			saveBtn	  = li.querySelector('.saveBtn'), 					// находим кнопку сохранения задачи
			cancelBtn = li.querySelector('.cancelBtn');					// находим кнопку отмены редактирования задачи

		if (checkbox) {
			checkbox.addEventListener('change', function() {			// добавляем обработчик события change для checkbox-a, если он есть 
			    createTask('completed', label.innerText);				// вызов функции создания задачи в списке completed  
			    deleteElem(li);											// вызов функции удаления элемента, передем туда элемент списка
			});
		}

		if (deleteBtn) {
			deleteBtn.addEventListener('click', function() {			// добавляем обработчик события нажатия на кнопку удаления, если она есть
				deleteElem(li);											// вызов функции удаления элемента, передаем туда элемент списка
				if (label) {
					deleteTaskFromStorage(label.innerText);
				}										
			});	
		}

		if (editBtn) {
			editBtn.addEventListener('click', function() {
				toggleVisibility([label, deleteBtn, editBtn], true);
				toggleVisibility([editInput, saveBtn, cancelBtn], false);
			})
		}

		if (cancelBtn) {
			cancelBtn.addEventListener('click', function() {
				toggleVisibility([label, deleteBtn, editBtn], false);
				toggleVisibility([editInput, saveBtn, cancelBtn], true);
			})
		}

		if (saveBtn) {
			saveBtn.addEventListener('click', function() {
				toggleVisibility([label, deleteBtn, editBtn], false);
				toggleVisibility([editInput, saveBtn, cancelBtn], true);

				let span = label.querySelector('span');

				if (editInput.value.length > 0) {
					updateTaskAtStorage(span.innerText, editInput.value);
				} else {
					deleteTaskFromStorage(span.innerText);
					deleteElem(li);
				}

				span.innerText = editInput.value;
			})
		}

		if (editInput) {
			editInput.addEventListener('keypress', function(event) {
				if (event.keyCode == 13) { // 13 код клавиши Enter
					saveBtn.click();	   // программно вызываем нажатие кнопки Save 
				}	
			})
		}

	}

	function toggleVisibility(elems, status) {
		elems.forEach(function(elem){
			elem.hidden = status;
		});
	}

	function deleteElem(elem) {
		elem.remove();													// удаляем элемент, который передали в параметре elem
	}

	function createTaskAtStorage(todo) {

		let todos = getStorage();

		todos.push(todo);

		setStorage(todos);
	}

	function updateTaskAtStorage(oldTodo, newTodo) {
		let todos = getStorage();

		todos.forEach(function(todo, index) {
			if (todo == oldTodo.trim()) {
				todos[index] = newTodo.trim();
			}
		});

		setStorage(todos);
	}

	function deleteTaskFromStorage(todo) {
		
		let todos = getStorage(),
			index = todos.indexOf(todo.trim());

		if (index > -1) {
			todos.splice(index, 1);
		}

		setStorage(todos);
	}

	function getStorage() {

		let todos = localStorage.getItem('todos');	// забираем из локального хранилища строку с задачами
		todos = todos ? todos.split('**') : [];
		return todos;
	}

	function setStorage(todos) {	
		todos = todos.join('**');
		localStorage.setItem('todos', todos);
	}

})()