$(document).ready(function() {
	populateCache();
	resetGame();

	// Start button handler
	$('#start').on('click', function() {startGame();});

	// Option click handler
	$('.option').on('click', function(event) {registerChoice(event);});

	// Response submit click handler
	$('#submit').on('click', function() {logResponse();});

	// New game button
	$('#again').on('click', function() {resetGame();});
});

function Question(questionText, optRight, opt1, opt2, opt3, picName) {
	this.questionText = questionText;
	this.options = new Array();
	
	this.options[0] = optRight;
	this.options[1] = opt1;
	this.options[2] = opt2;
	this.options[3] = opt3;
	
	// Picture to accompany the question.
	this.picURL = "images/q-images/" + (picName || "default.jpg");
	
	// Index of the correct answer in the options array.
	this.correctAnswer = 0;
	this.chosenAnswer = -1;
	this.isCorrect = false;
	
	this.logAnswer = function(answer) {
		this.chosenAnswer = answer;
		this.isCorrect = (answer == this.correctAnswer);
		return this.isCorrect;
	};

	// Randomizes the order of the available options and sets chosenAnswer to -1.
	this.reset = function() {
		var answer = this.options[this.correctAnswer];
		shuffle(this.options);
		this.correctAnswer = this.options.indexOf(answer);
		this.chosenAnswer = -1;
	}
}

/* Collection of all the questions a game could choose. */
var questionCache = new Array();

/* Range of responses to different quiz results. */

var feedback = [
	"Oof. Study up! Tenjin does not approve.",
	"One is better than none. Keep trying.",
	"Try again! You're allowed to look things up.",
	"More than half! You're alright. Keep trying.",
	"So close. Try again, you might do better this time.",
	"100%! Well done! Play again for different questions."
	];

/* The current question the quiz is on. */
var qNumber;

/* Array of the questions to be presented in this game. */
var gameQuestions;

/* Index of the option that's currently selected. */
var selectedAnswer;

/* Number of questions answered correctly. */
var numCorrect;

/* Construct questions here and add them to the cache. */
function populateCache() {
	questionCache.push(new Question(
		"Which of these items was not cause for the Moon God Tsukiyomi to murder Uke Mochi, the Goddess of Food?",
		"Azuki Beans",
		"Game",
		"Rice",
		"Fish",
		"uke_mochi.jpg"));
	questionCache.push(new Question(
		"Which Shinto text came first?",
		"Kojiki",
		"Nihongi",
		"Yengishiki",
		"Kogoshui",
		"text.jpg"));
	questionCache.push(new Question(
		"Japanese students hoping to pass their exams often pray to...",
		"Tenjin",
		"Omoikane",
		"Hachiman",
		"Amaterasu",
		"wishes.jpg"));
	questionCache.push(new Question(
		"Hikikomori (shut-ins) in Japan could identify with the deity...",
		"Amaterasu",
		"Ryūjin",
		"Susano-o",
		"Uzume",
		"hikikomori.jpg"));
	questionCache.push(new Question(
		"Which of these is not among the three Imperial Regalia of Japan?",
		"Tonbogiri, the Dragonfly",
		"Kusanagi, the Sword",
		"Yata no Kagami, the Mirror",
		"Yasakani no Magatama, the Jewel",
		"kokyo.jpg"));
	questionCache.push(new Question(
		"Which of these yokai (supernatural creature) is known for its prodigious testicles and fondness for shapeshifting?",
		"Tanuki",
		"Kitsune",
		"Kawauso",
		"Mujina"));
	questionCache.push(new Question(
		"The Sessho-seki (Killing Stone) was said to have been haunted by the spirit of a...",
		"Nine-Tailed Fox",
		"Saber-Wielding Badger",
		"Tatsu (Dragon)",
		"Burning Wheel",
		"sessho-seki.jpg"));
}

function chooseGameQuestions() {
	gameQuestions = new Array();
	shuffle(questionCache);
	for (var i = 0; i < 5; i++) {
		console.log(questionCache[i]);
		gameQuestions[i] = questionCache[i];
		gameQuestions[i].reset();
	}
}

function resetGame() {
	chooseGameQuestions();
	qNumber = 0;
	numCorrect = 0;

	resetBlossoms();

	$('#question-box').hide();
	$('#end-box').hide();
	$('.status-box').hide();

	$('#quiz-intro').show();
}

/* Move from intro page to first question. */
function startGame() {
	$('#quiz-intro').hide();

	$('#question-box').show();
	$('.status-box').show();
	propagateQuestion(gameQuestions[0]);
}

/* q must be a Question object */
function propagateQuestion(q) {
	// increment question number
	$('#q-number').text(qNumber + 1);
	
	// set question text
	$('#question-text').text(q.questionText);
	
	// set question image
	$('#question-pic').attr('src', q.picURL);
	
	// set question options
	for (var i = 0; i < 4; i++) {
		$('#opt' + i).text(q.options[i]);
	}
	selectedAnswer = -1;
}

/* Sets selectedAnswer to option index.
 * Sets selected class on clicked element */
function registerChoice(event) {
	// unselect the last selection
	$('#opt' + selectedAnswer).removeClass('selected');
	var choice = $(event.target);
	// parse which option was chosen
	selectedAnswer = parseInt(choice.attr('data-opt'));
	choice.addClass('selected');
	console.log(selectedAnswer);
}

/* Set chosenAnswer on the current question and
 * move on to the next question. */
function logResponse() {
	$('#opt' + selectedAnswer).removeClass('selected');
	var result = gameQuestions[qNumber].logAnswer(selectedAnswer);
	numCorrect += result;
	setPetal(qNumber, result);
	if (qNumber < 4) {
		qNumber++;
		propagateQuestion(gameQuestions[qNumber]);
	}
	else {
		finishGame();
	}
}

function finishGame() {
	$('#question-box').hide();
	$('.status-box').hide();
	$('#end-box').show();
	$('#num-correct').text(numCorrect);
	setFeedback();
}

function setFeedback() {
	$('#feedback').text(feedback[numCorrect]);
}

/* petal: which petal to set (0 - 4)
 * shade: 1 for bright, 0 for dark, -1 for blank */
function setPetal(petal, shade) {
	var url = "images/no-p.png";
	if (shade == 1) {
		url = "images/light-p.png";
	}
	else if (shade == 0) {
		url = "images/dark-p.png";
	}
	$('.p' + petal).attr('src', url);
}

/* Sets blossoms to blank. */
function resetBlossoms() {
	for (var i = 0; i < 5; i++) {
		setPetal(i, -1);
	}
}

/* Randomizes the order of the elements in an array. */
function shuffle(array) {
	for (var r, x, i = array.length; i;
		r = Math.floor(Math.random() * i),
		x = array[--i],
		array[i] = array[r],
		array[r] = x);
	return array;
}
