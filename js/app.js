$(document).ready(function() {
	populateCache();
	newGame();

	// Start button handler
	$('#start').on('click', function() {startGame();})
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
	
	// Randomizes the order of the available options.
	this.shuffleAnswers = function() {
		var answer = this.options[this.correctAnswer];
		shuffle(this.options);
		this.correctAnswer = this.options.indexOf(answer);
	}
}

/* Collection of all the questions a game could choose. */
var questionCache = new Array();

/* Construct questions here and add them to the cache. */
function populateCache() {
	questionCache.push(new Question("Which of these items was not cause for the Moon God Tsukiyomi to murder Uke Mochi, the Goddess of Food?",
		"Azuki Beans",
		"Game",
		"Rice",
		"Fish",
		"uke_mochi.jpg"));
	questionCache.push(new Question("Which Shinto text came first?",
		"Kojiki",
		"Nihongi",
		"Yengishiki",
		"Kogoshui",
		"text.jpg"));
	questionCache.push(new Question("Japanese students hoping to pass their exams often pray to...",
		"Tenjin",
		"Omoikane",
		"Hachiman",
		"Amaterasu",
		"wishes.jpg"));
	questionCache.push(new Question("Hikikomori (shut-ins) in Japan could identify with the deity...",
		"Amaterasu",
		"Ryūjin",
		"Susano-o",
		"Uzume",
		"hikikomori.jpg"));
	questionCache.push(new Question("Which of these is not among the three Imperial Regalia of Japan?",
		"Tonbogiri, the Dragonfly",
		"Kusanagi, the Sword",
		"Yata no Kagami, the Mirror",
		"Yasakani no Magatama, the Jewel",
		"kyoko.jpg"));
	questionCache.push(new Question("Which yōkai (supernatural creature) is known for its prodigious testicles and fondness for shapeshifting?",
		"Tanuki",
		"Kitsune",
		"Kawauso",
		"Mujina"));
}

/* The current question the quiz is on. */
var qNumber;

/* Array of the questions to be presented in this game. */
var gameQuestions;

function chooseGameQuestions() {
	gameQuestions = new Array();
	shuffle(questionCache);
	for (var i = 0; i < 5; i++) {
		console.log(questionCache[i]);
		gameQuestions[i] = questionCache[i];
		gameQuestions[i].shuffleAnswers();
	}
}

function newGame() {
	chooseGameQuestions();
	qNumber = 0;

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
	$('#q-number').text(++qNumber);
	
	// set question text
	$('#question-text').text(q.questionText);
	
	// set question image
	$('#question-pic').attr('src', q.picURL);
	
	// set question options
	for (var i = 0; i < 4; i++) {
		$('#opt-' + i).text(q.options[i]);
	}
}

/* petal: which petal to set (0 - 4)
 * shade: 1 for bright, 0 for dark, -1 for blank */
function setPetal(petal, shade) {
	var url = "images/no-p.png";
	if (shade == 1) {
		url = "images/bright-p.png";
	}
	else if (shade == 0) {
		url = "images/dark-p.png";
	}
	$('#p-' + petal).attr('src', url);
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
