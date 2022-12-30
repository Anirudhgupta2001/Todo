(function(){
	let tasks = [];
	const taskList = document.getElementById('list');
	const addTaskInput = document.getElementById('add');
	const taskscounter = document.getElementById('tasks-counter');

	async function fetchTodos(){
		// basically async is used when we want our code to be done the way it is written
		// or we can say that code should be executed line by line
		
		try{
			const response = await fetch('https://jsonplaceholder.typicode.com/todos');
			const data = await response.json();
			tasks = data.slice(0,10);
			renderList();
		}catch(error){
				console.log(error);
		}
				
		//this api will help only in getting data, it won't post the data to the server
	}

	function addTaskToDOM(task)
	{
		const li=document.createElement('li');
		li.innerHTML=`<input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
		<label for="${task.id}">${task.title }</label>
		<img src="bin.png" class="delete" data-id="${task.id}"/>
		`;
		taskList.append(li);
	}

	function renderList() {
		taskList.innerHTML = '';
		for(let i=0;i<tasks.length;i++)
		{
			addTaskToDOM(tasks[i]);
		}
		taskscounter.innerHTML=tasks.length;
	}
	function toggleTask(taskId) {
		const task=tasks.filter(function(task){
			return task.id==Number(taskId)
		});
		if(task.length>0)
		{
			const currentTask=task[0];
			currentTask.completed =! currentTask.completed;
			renderList();
			showNotification('Task toggled successfully');
		}
		showNotification('Could not toggled successfully');
	}

	function deleteTask(taskId) {
		const newTasks = tasks.filter(function(task){
			return task.id != Number(taskId)
		})
		tasks = newTasks;
		renderList();
		showNotification('Task deleted successfully');
	}

	function addTask(task) {
		if(task){
		//If we want to post the data on server
			fetch('https://jsonplaceholder.typicode.com/todos',{
				method: 'POST',
				headers:{
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(task),
			}).then(function(response){
		//		console.log(response);
				return response.json();
			}).then(function(data){
				console.log(data);
				tasks.push(task);
				renderList();
				showNotification('Task added successfully');
			})
			.catch(function(error){
				console.log('error',error);
			})	


			tasks.push(task);
			renderList();
			showNotification('Task added successfully');
			return;
		}
		showNotification('Task can not be added');
	}

	function showNotification(text) {
		alert(text);
	}

	function handleInputKeypress(e){
		if(e.key=='Enter'){
			const text=e.target.value;
			if(!text){
				showNotification('Task text can not be empty');
				return;
			}
			const task = {
				title: text,
				id: Date.now(),
				completed: false
			}
			e.target.value = '';
			addTask(task);
		}
	}

	function handleClickListener(e)
	{
		const target=e.target;
		console.log(target);
		if(target.className=='delete'){
			const taskId=target.dataset.id;
			deleteTask(taskId);
			return;
		}
		else if(target.className=='custom-checkbox')
		{
			const taskId=target.id;
			toggleTask(taskId);
			return;
		}
	}

	function intializeApp() {
		fetchTodos();
		addTaskInput.addEventListener('keyup',handleInputKeypress);
	document.addEventListener('click',handleClickListener);	
	}

	intializeApp();
})()
