/*
 * Create a list that holds all of your cards
 */

 var cardList = ['fa-diamond', 'fa-paper-plane-o', 
    'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor',
    'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb',
    'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

var numOfMoves;
var numOfStars;
var chessSize;
var timer;
var totalSeconds;

/* restart the game, reset and shuffle the cards */
$('.restart, .play-again').click(function(e) {
    e.preventDefault();
    initialize();
});

initialize();

// Initialize the game, shuffle the cards and initialize settings.
function initialize()
{
    $('.card').attr('class', 'card');
    $('.card .fa').attr('class', 'fa');

    shuffle(cardList);

    $('.card .fa').each(function(index, ele) {
        $(this).addClass(cardList[index]);
    });
    
    numOfMoves = 0;
    numOfStars = 5;
    chessSize = 16;
    totalSeconds = 0;

    updateStars();
    setTimer();

    // Hide the winning message field
    $('.container').show();
    $('.winning-message-field').hide();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Initialize the timer
function setTimer() {
    $('.timer').text("0h 0m 0s");

    // clear previous timer and set new timer.
    if(timer) {
        clearInterval(timer);
    }

    timer = setInterval(function() {
        totalSeconds++;
    
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;
      
        $('.timer').text(hours + "h " + minutes + "m " + seconds + "s");
    }, 1000);
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var openCards = [];

$('.card').click(function(e) {
    e.preventDefault();

    // Card has been opened, return directly
    if($(this).hasClass('open'))
    {
        return;
    }

    showCardSymbol(this);
    addOpenCard(this);
    
    // has opened a pair of cards, need to compare them
    if(openCards.length % 2 === 0) {
        numOfMoves++;
        updateStars();
        checkOpenCards();
    }

    // All cards match, show success message
    if(openCards.length === chessSize) {
        setTimeout(function(){ 
            showFinalScore();
        }, 400);
    }
});

// display the card's symbol
function showCardSymbol(card) {
    $(card).addClass('open show');
}

// add the card to a *list* of "open" cards
function addOpenCard(card) {
    openCards.push(card);
}

// Check whether the newly opened cards match
function checkOpenCards() {
    var len = openCards.length;

    // Doesn't match
    if($(openCards[len-1]).children('i').attr('class') !== $(openCards[len-2]).children('i').attr('class'))
    {
        // Change css to show dismatch
        $(openCards[len-1]).addClass('no-match');
        $(openCards[len-2]).addClass('no-match');

        // Remove the dismatch class, hide and remove the cards from openCards
        setTimeout(function(){ 
            $(openCards[len-1]).removeClass('open show no-match');
            $(openCards[len-2]).removeClass('open show no-match');
            openCards.pop();
            openCards.pop();
        }, 400);
    }
    else {
        // Match, add the match class
        $(openCards[len-1]).addClass('match');
        $(openCards[len-2]).addClass('match');
    }
}

// Calculate the number of stars
function updateStars() {
    // Show number of moves
    $('.moves').text(numOfMoves);

    // Every 10 moves will reduce one star
    if(numOfMoves % 10 === 0) {
        $('.stars').empty();
        numOfStars = 5 - numOfMoves / 10;

        for(var i=0; i<5-numOfMoves / 10; i++)
        {
            $('.stars').append('<li><i class="fa fa-star"></i></li>');
        }
    }
}

// Show the pop up of success message
function showFinalScore() {
    $('.container').hide();
    $('.winning-message-field').show();

    // Show the timer, number of moves and number of stars
    $('.timer-and-stars').text('With ' + totalSeconds + ' Seconds, ' + numOfMoves + ' Moves and ' + numOfStars + ' Stars!');
}