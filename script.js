const GameBoard = (() => {
  'use strict';
  const GameBoard = [['', '', ''],
                     ['', '', ''],
                     ['', '', '']];

  const GetBoard = () => {
    return GameBoard
  }

  const ResetBoard = () => {
    for(let i = 0; i <= 2; i++){
      GameBoard[i] = ['', '', ''];
    }
    DisplayController.ClearFields();
  }

  const SetField = (marker, column, row) => {
    if(GameBoard[row][column] != ''){
      return false
    }
    GameBoard[row][column] = marker;
    DisplayController.UpdateField(marker, column, row);
    console.log(GameBoard)
    return true
  }

  const CheckDiagonals = (marker) => {
    if(GameBoard[0][0] === marker &&
       GameBoard[1][1] === marker &&
       GameBoard[2][2] === marker){
        return true;
    }
    else if(GameBoard[1][1] === marker &&
            GameBoard[0][2] === marker &&
            GameBoard[2][0] === marker){
              return true;
    }
    return false;
  }

  const CheckRowsAndColumns = (marker) => {
    for(let i = 0; i <= 2; i++){
      if(GameBoard[i][0] === marker &&
         GameBoard[i][1] === marker &&
         GameBoard[i][2] === marker){
          return true;
      }
      else if(GameBoard[0][i] === marker &&
              GameBoard[1][i] === marker &&
              GameBoard[2][i] === marker){
                return true;
      }
    }
    return false;
  }

  const DrawCheck = () => {
    for(let i = 0; i <= 2; i++){
      if(GameBoard[i].includes('')){
        return false;
      }
    }
    return true;
  }

  return {
    SetField,
    GetBoard,
    CheckDiagonals,
    CheckRowsAndColumns,
    DrawCheck,
    ResetBoard
  }

})();


const Player = (marker) => {
  const GetMarker = () => {return marker}

  const Play = (column, row) => {
    GameBoard.SetField(marker,column, row) ? true : false
  }

  return{
    GetMarker,   
    Play
    }
}

const DisplayController = ( () => {
  const Display = document.querySelector('.display');
  Display.textContent = 'Press Start to Play!'
  const UpdateField = (marker, column, row) => {
    const field = document.querySelector(`.row${row}.column${column}`);
    const span = document.createElement('span');
    field.textContent = marker;
  }

  const ClearFields = () => {
    for(let i = 0; i <= 2; i++){
      for(let j = 0; j <= 2; j++){
        const field = document.querySelector(`.row${i}.column${j}`);
        field.textContent = '';
      }
    }
  }

  const ClearDisplay = () => {
    while(Display.firstChild){
      Display.removeChild(Display.firstChild);
    }
  }

  const DisplayWinner = (winner) => {
    ClearDisplay()
    console.log('win')
    let WinnerMessage = document.createElement('span');
    WinnerMessage.style.color = '#A7C957'
    WinnerMessage.textContent = `${winner} has won`;
    Display.appendChild(WinnerMessage);    
  }

  const DisplayDraw =() => {
    ClearDisplay()
    let DrawMessage = document.createElement('span')
    DrawMessage.style.color = '#96C5F7'
    DrawMessage.textContent = `It's a tie!`
    Display.appendChild(DrawMessage)
  }

  const DisplayTurn = (player) => {
    ClearDisplay()
    let TurnMessage = document.createElement('span')
    TurnMessage.style.color = '#96C5F7'
    TurnMessage.textContent = `It's ${player} player turn`
    Display.appendChild(TurnMessage)
  }

  return{
    UpdateField,
    ClearFields,
    DisplayWinner,
    DisplayDraw,
    DisplayTurn,
    ClearDisplay
  }

})();


const GameController = (() => {
  let PlayerX = Player('X');
  let PlayerO = Player('O');
  let GameOver = false;

  const WinCheck = (marker) => {
    const RowColumn = GameBoard.CheckRowsAndColumns(marker);
    const Diagonal = GameBoard.CheckDiagonals(marker);
    const Draw = GameBoard.DrawCheck(marker);

    if(RowColumn || Diagonal){
      DisplayController.DisplayWinner(marker);
      GameOver = true;
      return
    }
    else if(Draw){
      DisplayController.DisplayDraw();
      GameOver = true;
      return
    }
    Turn.ToggleTurn()
  }

  const Reset = (() => {
    const ResetButton = document.querySelector('.ResetButton')
    ResetButton.addEventListener('click', () => {
      GameBoard.ResetBoard()
      Turn.ResetTurn()
      GameOver = false
      Round()
    })

    const DisplayResetButton = () => {
      ResetButton.style.display = 'inline-block';
    }

    const OcultResetButton = () => {
      ResetButton.style.display = 'none'
    }

    return{
      DisplayResetButton,
      OcultResetButton
    }
  })()

  const Turn = (() => {
    let turn = 0

    const ToggleTurn = () => {
      turn == 0 ? turn = 1 : turn = 0;
      GetPlayerTurn()
    }

    const GetPlayerTurn = () => {
        DisplayController.DisplayTurn(CurrentPlayer().GetMarker());
    }

    const CurrentPlayer = () => {
      if(turn == 0){
        return PlayerX;
      }
      else{
        return PlayerO;
      }
    }

    const ResetTurn = () => {
      turn = 0;
      GetPlayerTurn(turn)
    }

    return{
      ToggleTurn,
      GetPlayerTurn,
      ResetTurn,
      CurrentPlayer
    }
  })()

  const Round = () => {
    DisplayController.DisplayTurn(Turn.CurrentPlayer().GetMarker());
    const fields = document.querySelectorAll('.game-field');
    fields.forEach(item => {
      item.addEventListener('click', () => {
        let row = item.classList[1].replace('row', '');
        let column = item.classList[2].replace('column', '');
        if(GameOver){
          return
        }
        if(GameBoard.SetField(Turn.CurrentPlayer().GetMarker(), column, row)){
          WinCheck(Turn.CurrentPlayer().GetMarker())
        }
      })
    })
  }

  const StartGame = (() => {
    const Game = document.querySelector('.game');
    const PlayButton = document.createElement('Button');
    PlayButton.classList.add('PlayButton');
    PlayButton.textContent = 'Start Game';
    PlayButton.addEventListener('click', () => {
      Round();
      PlayButton.style.display = 'none';
      Reset.DisplayResetButton();
    })
    Game.appendChild(PlayButton);
  })()
})()