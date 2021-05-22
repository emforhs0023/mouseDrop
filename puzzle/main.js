const container = document.querySelector('.image-container');
const startButton = document.querySelector('.start-button');
const cheatButton = document.querySelector('.cheat-button');
const gameText = document.querySelector('.game-text');
const playTime = document.querySelector('.play-time');
const tileCount = 16;

let tiles = [];
const dragged = {
	el: null,
	class: null,
	index: null
};
let isPlaying = false;
let timeInterval;
let time = 0;

function setGame(){
	isPlaying = true;
	container.innerHTML = ""
	gameText.style.display = 'none';
	tiles = createImageTiles()
	tiles.forEach(tile=>container.appendChild(tile))
	setTimeout(() => {
		container.innerHTML = ""
		shuffle(tiles).forEach(tile=>container.appendChild(tile))
		gameStart();
	}, 2000)
}

function gameStart() {
	isPlaying = true;
	timeInterval = setInterval(() => {
		time++;
		playTime.innerText = time;
	}, 1000);
}

function createImageTiles(){
	const tempArray = []
	Array(tileCount).fill().forEach((_,i) => {
		const li = document.createElement("li")
		li.setAttribute('data-index', i);
		li.setAttribute('draggable', 'true');
		li.classList.add(`list${i}`)
		tempArray.push(li)
	})
	return tempArray
}

function shuffle(array){
	let index = array.length - 1
	while (index > 0) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[ array[index], array[randomIndex] ] = [ array[randomIndex], array[index] ];
		index--;
	}
	return array;
}

function checkStatus() {
	const currentList = [ ...container.children ]; // 현재 확인
	const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute('data-index')) !== index);
	if (unMatchedList.length === 0) {
		gameText.style.display = 'block';
		isPlaying = false;
		clearInterval(timeInterval);
	}
}

container.addEventListener("dragstart", event => {
	if (!isPlaying) return;
	// console.log(e)
	const obj = event.target;
	dragged.el = obj;
	dragged.class = obj.className;
	dragged.index = [ ...obj.parentNode.children ].indexOf(obj);
})

container.addEventListener("dragover", event => {
	event.preventDefault()
})

container.addEventListener("drop", event => {
	if (!isPlaying) return;
	const obj = event.target;

	if (obj.className !== dragged.class) {
		let originPlace; // 위아래 확인
		let isLast = false; // 마지막 변수 이냐
		//nextSibling는 현재 드롭한 다음 element 
		//previousSibling은 현재 드롭한 앞 element
		if (dragged.el.nextSibling) { // 맨 마지막은 nextSibling 없다 
			originPlace = dragged.el.nextSibling;
		} else { // 마지막일 경우
			originPlace = dragged.el.previousSibling;
			isLast = true;
		}
		const droppedIndex = [ ...obj.parentNode.children ].indexOf(obj); // 드랍 된 애 의 index
		dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
		isLast ? originPlace.after(obj) : originPlace.before(obj);
	}
	checkStatus();
})

startButton.addEventListener('click', () => {
	setGame();
});

cheatButton.addEventListener('click', () => {
	const currentList = [ ...container.children ];
	currentList.forEach((li) => {
		console.log({li})
		li.innerText = li.dataset.index;
	});
});