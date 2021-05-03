'use strict';

// init some game tracking variables
var curPlayer = 0;          /* keep track of current player */
var marks = ['X', 'O']      /* Available player marks */
let cells, playerCards      /* references to DOM collections */

var playerMarks = [         /* the curent game state */
  [],                       /* a list of cells player 1 has marked */
  []                        /* a list of cells player 2 has marked */
]

var winningSets = [         /* a definition of all winning cell sets */
  [0, 1, 2], [3, 4, 5], [6, 7, 8],    /* rows */
  [0, 3, 6], [1, 4, 7], [2, 5, 8],    /* columns */
  [0, 4, 8], [6, 4, 2]                /* diagonals */
]

/*
/ check if the board is full
/ useful to determine if game is a draw
**/
function isBoardFull () {
  return playerMarks[0].length + playerMarks[1].length === 9
}

/*
/ check if there is a winning set of cells marked
**/
function isWinner (curPlayer) {
  // get current players marks as a sorted string
  const curPlayerMarks= playerMarks[curPlayer]
  // for each winning set
  const winSet = winningSets.filter(set => {
    // if that set is included in the player's marks, it must be a win
    if (set.every(item => curPlayerMarks.includes(item))) {
      return set
    }
  })
  // also check if board is full
  if (isBoardFull() && winSet.length === 0) {
    return null
  }
  // otherwise return false
  return winSet.length ? winSet[0] : false
}

/*
/ handle cell click events, and move the game along
/ this is the event driven gameplay core right here
**/
function handleClick(event) {
  const el = event.target                     /* get the event target DOM el */
  const index = parseInt(el.id)               /* get the index of it */
  let newVal = marks[curPlayer]               /* get the right player mark */
  playerMarks[curPlayer].push(index)          /* update game state */
  updateGridDisplay()                         /* tell the DOM to update the display*/
  const result = isWinner(curPlayer)          /* check if this is a winner */
  if (result) {
    displayWin(result)                        /* if so, display "win mode" */
  } else if (result === null) {
    return displayDraw()                      /* is winner returns null for a draw */
  } else {
    curPlayer = curPlayer === 1 ? 0 : 1;      /* if nothing, advance game along */
  }
  el.removeEventListener('click', handleClick)
  updateCurrentPlayerDisplay()                /* update display showing current player */
}

/*
/ display the game in a "win state"
/ in our case, highlighting the winning cells
**/
function displayWin(result) {
  let winIndex = 0
  // set all non-winning cells to the game-over mode
  cells.forEach((cell, index) => {
    if (!result.includes(index)) {
      cell.classList.add('game-over')                 /* add game-over CSS */
    }
    cell.removeEventListener('click', handleClick)    /* remove event listeners */
  })

  // set all winning cells to the win mode
  result.map(index => {
    setTimeout(() => {
      cells[index].classList.toggle('winner')
    }, 50 * index)
  })
  playerCards[curPlayer].classList.add('winner')
}

/*
/ display the game in a "draw" state (tie)
/ in our case, de-emphasizing all cells
**/
function displayDraw() {
  for (const cell of cells) {
    cell.classList.add('draw')
  }
  for (const card of playerCards) {
    card.style.visibility = 'hidden'
  }
  document.querySelector('button.reset').innerText = 'Draw! - reset'
}

/*
/ update the grid display
/ this loops through all cells and shows the correct player mark in them
**/
function updateGridDisplay() {
  // for each cell in the grid
  for (let cellIndex = 0; cellIndex < 9; cellIndex ++) {
    // check each list of player's moves
    playerMarks.map((playerMarkSet, player) => {
      // to see it includes this cell index
      if (playerMarkSet.includes(cellIndex)) {
        // if so, mark the cell with the player's mark
        cells[cellIndex].innerText = marks[player]
      }
    })
  }
}

/*
/ update the player display
/ this toggles the player card shown, indicating current turn
**/
function updateCurrentPlayerDisplay () {
  playerCards.forEach((playerCard, index) => {
    if (index === curPlayer) {
      playerCard.style.visibility = 'visible'
    } else {
      playerCard.style.visibility = 'hidden'
    }
  })
}

/*
/ tell all the cells to listen for clicks
**/
function bindClickListeners () {
  for (const cell of cells) {
    cell.addEventListener('click', handleClick)
  }
}

/*
/ reset game board display
**/
function resetBoard() {
  playerMarks = [[],[]]
  for (const cell of cells) {
    cell.innerText = ''
  }
  for (const cell of cells) {
    cell.classList.remove('game-over')
    cell.classList.remove('winner')
    cell.classList.remove('draw')
  }
  for (const playerCard of playerCards) {
    playerCard.classList.remove('winner')
    playerCard.style.visibility = 'hidden'
  }
  bindClickListeners()
  playerCards[0].style.visibility = 'visible'
  document.querySelector('button.reset').innerText = 'reset'
}

/*
/ setup the game when the DOM loads
**/
document.addEventListener('DOMContentLoaded', () => {
  cells = document.querySelectorAll('.cell')
  playerCards = document.querySelectorAll('.playerCard')
  playerCards.forEach((card, index) => {
    card.querySelector('div').innerText = marks[index]
  })
  bindClickListeners()
  const reset = document.querySelector('button')
  reset.addEventListener('click', resetBoard)
  updateCurrentPlayerDisplay()
})
