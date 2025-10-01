import { useState } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './components/Square.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'
import { saveGameToStorage, resetGameToStorage } from './logic/storage/index.js'

function App() {

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })
  
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  // Estado para el ganador, null es que no hay ganador, false es empate, true hay ganador
  const [winner, setWinner] = useState(() => {
    const winnerFromStorage = window.localStorage.getItem('winner')
    return winnerFromStorage ? JSON.parse(winnerFromStorage) : null
  })

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameToStorage()
  }

  const updateBoard = (index) => {
    //no actualizar si ya tiene algo o hay ganador
    if (board[index] || winner) return

    //actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    
    //revisar si hay ganador
    let newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) //empate
      newWinner = false
    }

    // guardar aqui partida
    saveGameToStorage({
      board: newBoard, 
      turn: newTurn,
      winner: newWinner
    })
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reiniciar juego</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square 
              key={index} 
              index={index}
              updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
