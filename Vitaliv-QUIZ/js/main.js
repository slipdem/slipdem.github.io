
var all_questions = [{
  question_string: "What color is the sky?",
  choices: {
    correct: "Blue",
    wrong: ["Pink", "Orange", "Green"]
  }
}, {
  question_string: "Which season is the hottest?",
  choices: {
    correct: "Summer",
    wrong: ["Winter", "Autumn", "Spring"]
  }
}, {
  question_string: "How many wheels are there on a tricycle?",
  choices: {
    correct: "Three",
    wrong: ["One", "Two", "Four"]
  }
}, {
  question_string: 'Who is the main character of Harry Potter?',
  choices: {
    correct: "Harry Potter",
    wrong: ["Hermione Granger", "Ron Weasley", "Voldemort"]
  }
}, {
  question_string: 'What is the world\'s longest river?',
  choices: {
    correct: "Amazon",
    wrong: ["Nile", "Yangtze", "Mississippi"]
  }
}, {
  question_string: 'What is the capital city of Spain?',
  choices: {
    correct: "Madrid",
    wrong: ["Barcelona", "Valencia", "Seville"]
  }
}, {
  question_string: 'Which chess piece can only move diagonally?',
  choices: {
    correct: "A bishop",
    wrong: ["A rook", "A knight", "A pawn"]
  }
}, {
  question_string: 'What color is Absynthe?',
  choices: {
    correct: "Green",
    wrong: ["Blue", "Yellow", "Red"]
  }
}, {
  question_string: 'What is the the world\'s biggest island?',
  choices: {
    correct: "Greenland",
    wrong: ["Great Britain", "Australia", "Iceland"]
  }
}
];
var Quiz = function(quiz_name) {
  this.quiz_name = quiz_name;

  this.questions = [];
}

Quiz.prototype.add_question = function(question) {
  var index_to_add_question = Math.floor(Math.random() * this.questions.length);
  this.questions.splice(index_to_add_question, 0, question);
}

Quiz.prototype.render = function(container) {
  var self = this;

  $('#quiz-results').hide();

  $('#quiz-name').text(this.quiz_name);

  var question_container = $('<div>').attr('id', 'question').insertAfter('#quiz-name');

  function change_question() {

    self.questions[current_question_index].render(question_container);
    $('#prev-question-button').prop('disabled', current_question_index === 0);
    $('#next-question-button').prop('disabled', current_question_index === self.questions.length - 1);

    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  }

  var current_question_index = 0;
  change_question();

  $('#prev-question-button').click(function() {
    if (current_question_index > 0) {
      current_question_index--;
      change_question();
    }
  });

  $('#next-question-button').click(function() {
    if (current_question_index < self.questions.length - 1) {
      current_question_index++;
      change_question();
    }
  });

  $('#submit-button').click(function() {
    var score = 0;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === self.questions[i].correct_choice_index) {
        score++;
      }
    }

    var percentage = score / self.questions.length;
    console.log(percentage);
    var message;
    if (percentage === 1) {
      message = 'Great job!'
    } else if (percentage >= .75) {
      message = 'You did alright.'
    } else if (percentage >= .5) {
      message = 'Better luck next time.'
    } else {
      message = 'Maybe you should try a little harder.'
    }
    $('#quiz-results-message').text(message);
    $('#quiz-results-score').html('You got <b>' + score + '/' + self.questions.length + '</b> questions correct.');
    $('#quiz-results').slideDown();
    $('#quiz button').slideUp();
    $('#quiz-name').css('display', 'none');
    $('#question').css('display', 'none');
  });

  question_container.bind('user-select-change', function() {
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  });
}

var Question = function(question_string, correct_choice, wrong_choices) {
  this.question_string = question_string;
  this.choices = [];
  this.user_choice_index = null;

  this.correct_choice_index = Math.floor(Math.random() * wrong_choices.length + 1);

  var number_of_choices = wrong_choices.length + 1;
  for (var i = 0; i < number_of_choices; i++) {
    if (i === this.correct_choice_index) {
      this.choices[i] = correct_choice;
    } else {
      var wrong_choice_index = Math.floor(Math.random(0, wrong_choices.length));
      this.choices[i] = wrong_choices[wrong_choice_index];

      wrong_choices.splice(wrong_choice_index, 1);
    }
  }
}

Question.prototype.render = function(container) {
  var self = this;

  var question_string_h2;
  if (container.children('h2').length === 0) {
    question_string_h2 = $('<h2>').appendTo(container);
  } else {
    question_string_h2 = container.children('h2').first();
  }
  question_string_h2.text(this.question_string);

  if (container.children('input[type=radio]').length > 0) {
    container.children('input[type=radio]').each(function() {
      var radio_button_id = $(this).attr('id');
      $(this).remove();
      container.children('label[for=' + radio_button_id + ']').remove();
    });
  }
  for (var i = 0; i < this.choices.length; i++) {
    var choice_radio_button = $('<input>')
      .attr('id', 'choices-' + i)
      .attr('type', 'radio')
      .attr('name', 'choices')
      .attr('value', 'choices-' + i)
      .attr('checked', i === this.user_choice_index)
      .appendTo(container);

    var choice_label = $('<label>')
      .text(this.choices[i])
      .attr('for', 'choices-' + i)
      .appendTo(container);
  }

  $('input[name=choices]').change(function(index) {
    var selected_radio_button_value = $('input[name=choices]:checked').val();

    self.user_choice_index = parseInt(selected_radio_button_value.substr(selected_radio_button_value.length - 1, 1));

    container.trigger('user-select-change');
    $('#next-question-button').click();
  });
}

$(document).ready(function() {
  var quiz = new Quiz('Testosterone Self-Assessment Quiz');

  for (var i = 0; i < all_questions.length; i++) {
    var question = new Question(all_questions[i].question_string, all_questions[i].choices.correct, all_questions[i].choices.wrong);

    quiz.add_question(question);
  }

  var quiz_container = $('#quiz');
  quiz.render(quiz_container);
});


var question = document.getElementById('question'),
    btnWelcome = document.getElementById('button-welcome'),
    quizWelcome = document.getElementById('quiz--welcome'),
    quizSubForm = document.getElementById('quiz-submit-form'),
    submitItems = document.getElementById('submit--items'),
    submitText = document.getElementById('submit--text');
// quiz welcome sreen
btnWelcome.onclick = function() {
  quizWelcome.style.display = 'none';
  document.getElementById('question').style.display = 'block';
  document.getElementById('quiz-name').style.display = 'block';
  document.getElementsByClassName('quiz--row')[0].style.display = 'flex';
}
// onsumbit form hide items, show after sub text
quizSubForm.onsubmit = function() {
  submitItems.style.display = 'none';
  submitText.style.display = 'block';
  return false;
}