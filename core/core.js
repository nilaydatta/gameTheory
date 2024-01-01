import { strategies } from "./strategies.js";

// Variable declarations
export const tournament = [];
export let Player1, Player2, game;

// HTML DOM selectors
export const tournamantSection = document.getElementById("tournamantSection");
export const winStrategySection = document.getElementById("winStrategySection");
export const winPlayerNameSection = document.getElementById(
  "winPlayerNameSection"
);
export const currentRoundSection = document.getElementById(
  "currentRoundSection"
);
export const strategiesList = document.getElementById("strategiesList");

// Button DOM selectors
export const btnStartGame = document.getElementById("btnStartGame");
export const btnNextRound = document.getElementById("btnNextRound");
export const btnPlay = document.getElementById("btnPlay");
export const btnClearConsole = document.getElementById("btnClearConsole");
export const btnAddTournament = document.getElementById("btnAddTournament");
export const btnfindWinStr = document.getElementById("btnfindWinStr");
export const btnfindWinName = document.getElementById("btnfindWinName");
export const roundFullDataDisplaySectionTbody = document.getElementById("roundFullDataDisplaySectionTbody");
export const roundFullDataDisplaySectionTfoot = document.getElementById("roundFullDataDisplaySectionTfoot");
export const playerInfoRoundSection = document.getElementById("playerInfoRoundSection");

// Define classes
export class Player {
  // Legend: co-operative = true, defect = false
  constructor(name, strategy) {
    this.name = name;
    this.strategy = strategy;
    this.strategyName = strategy.getName();
  }
}

export class Game {
  constructor(rounds) {
    this.noOfRounds = rounds;
    this.count = 0;
    this.totalRound = [];
  }
  info() {
    return {
      total: this.totalRound,
      current: this.count,
      rounds: this.noOfRounds,
    };
  }
  saveRound(player1Move, player2Move) {
    this.count++;
    const round = {
      player1Move: player1Move,
      player1Score: 0,
      player2Move: player2Move,
      player2Score: 0,
      count: this.count,
    };
    if (player1Move && player2Move) {
      round.player1Score = 3;
      round.player2Score = 3;
    } else if (player1Move && !player2Move) {
      round.player1Score = 0;
      round.player2Score = 5;
    } else if (!player1Move && player2Move) {
      round.player1Score = 5;
      round.player2Score = 0;
    } else {
      round.player1Score = 1;
      round.player2Score = 1;
    }
    this.totalRound.push(round);
  }
  findWinner() {
    let player1Score = 0;
    let player2Score = 0;
    let result = {
      winnerName: "N/A",
      winnerStrategy: "N/A",
      loserName: "N/A",
      loserStrategy: "N/A",
      comment: "Draw!",
      total: this.totalRound,
      type: "draw",
    };
    for (const round of this.totalRound) {
      player1Score = player1Score + round.player1Score;
      player2Score = player2Score + round.player2Score;
    }
    if (player1Score > player2Score) {
      result.winnerName = Player1.name;
      result.winnerStrategy = Player1.strategyName;
      result.loserName = Player2.name;
      result.loserStrategy = Player2.strategyName;
      result.comment = `<strong>${Player1.name} (${Player1.strategyName})</strong> wins with <strong>${player1Score}</strong>! <strong>${Player2.name} (${Player2.strategyName})</strong> scored <strong>${player2Score}</strong> | :)`;
      result.type="win";
    } else if (player2Score > player1Score) {
      result.winnerName = Player2.name;
      result.winnerStrategy = Player2.strategyName;
      result.loserName = Player1.name;
      result.loserStrategy = Player1.strategyName;
      result.comment = `<strong>${Player2.name} (${Player2.strategyName})</strong> wins with <strong>${player2Score}</strong>! <strong>${Player1.name} (${Player1.strategyName})</strong> scored <strong>${player1Score}</strong> | :)`;
      result.type="normal";
    } else {
      result.comment = `Draw! Players: <strong>${Player1.name}-${Player1.strategyName}</strong> and <strong>${Player2.name}-${Player2.strategyName}</strong> | :|`;
      result.type="draw";
    }
    console.log(result.comment);
    return result;
  }
  display() {
    console.log(
      `Score board: ${Player1.name} (${Player1.strategyName}) and ${Player2.name} (${Player2.strategyName})`
    );
    console.table(this.totalRound);
    console.log(`Current round: ${this.count}`);
    const getRoundTableData = getRoundFullTableData.getData(this.info());
    roundFullDataDisplaySectionTbody.innerHTML = getRoundTableData.row;
    roundFullDataDisplaySectionTfoot.innerHTML = getRoundTableData.footer;
  }
  nextRound() {
    let findWinner = {
      winnerName: "",
      winnerStrategy: "",
    };
    if (this.count > this.noOfRounds) {
      findWinner = this.findWinner();
      console.log("Game over!!");
    } else {
      const player1Move = Player1.strategy.calcMove(this.info(), "player2Move");
      const player2Move = Player2.strategy.calcMove(this.info(), "player1Move");
      this.saveRound(player1Move, player2Move);
      this.display();
      findWinner.winnerName = Player1.name;
      findWinner.loserName = Player2.name;
      findWinner.winnerStrategy =
        this.totalRound[this.totalRound.length - 1].player1Score;
      findWinner.loserStrategy =
        this.totalRound[this.totalRound.length - 1].player2Score;
      if (this.count === this.noOfRounds) {
        findWinner = this.findWinner();
        this.count++;
      }
    }
    this.displayRoundResult(findWinner);
  }
  play() {
    let findWinner = { type: "normal" };
    if (this.count > this.noOfRounds) {
      console.log("Game over!!");
      return;
    } else {
      while (this.count < this.noOfRounds) {
        const player1Move = Player1.strategy.calcMove(
          this.info(),
          "player2Move"
        );
        const player2Move = Player2.strategy.calcMove(
          this.info(),
          "player1Move"
        );
        this.saveRound(player1Move, player2Move);
      }
      this.display();
      this.count++;
    }
    findWinner = this.findWinner();
    this.displayRoundResult(findWinner);
  }
  displayRoundResult(findWinner) {
    if (findWinner.type === "win") {
      currentRoundSection.innerHTML = `<div class="alert alert-success" role="alert"><strong>Result: </strong><br/>${findWinner.comment}. <br/>Winner name: <strong>${findWinner.winnerName}</strong>. Winner strategy: <strong>${findWinner.winnerStrategy}</strong>. Loser name: <strong>${findWinner.loserName}</strong>. Loser strategy: <strong>${findWinner.loserStrategy}</strong></div>`;
    } else if (findWinner.type === "draw") {
      currentRoundSection.innerHTML = `<div class="alert alert-warning" role="alert"><strong>Result: </strong>${findWinner.comment}.</div>`;
    } else {
      currentRoundSection.innerHTML = `<div class="alert alert-info" role="alert"><strong>Round: ${this.count}</strong><br/>Players: <strong>${findWinner.winnerName}-${findWinner.winnerStrategy}</strong> and <strong>${findWinner.loserName}-${findWinner.loserStrategy}</strong>.</div>`;
    }
  }
}

export class Initialize {
  static start() {
    console.clear();
    const strategyKeys = Object.keys(strategies);
    currentRoundSection.innerHTML = "No rounds played!";
    const player1name = prompt("Enter first player name?");
    let player1strategy = prompt(
      `Enter first player strategy? Choose from ${strategyKeys.join(", ")}`
    ).toLowerCase();
    while (strategyKeys.indexOf(player1strategy) === -1) {
      player1strategy = prompt(
        `Invalid Strategy! Please choose from list: ${strategyKeys.join(", ")}`
      ).toLowerCase();
    }
    const player2name = prompt("Enter second player name?");
    let player2strategy = prompt(
      `Enter second player strategy? Choose from ${strategyKeys.join(", ")}`
    ).toLowerCase();
    while (strategyKeys.indexOf(player2strategy) === -1) {
      player2strategy = prompt(
        `Invalid Strategy! Please choose from list: ${strategyKeys.join(", ")}`
      ).toLowerCase();
    }
    const noofrounds = prompt("Enter no of rounds?");
    Player1 = new Player(player1name, strategies[player1strategy]);
    Player2 = new Player(player2name, strategies[player2strategy]);
    game = new Game(parseInt(noofrounds));
    console.log(game);
    btnNextRound.disabled = false;
    btnPlay.disabled = false;
    playerInfoRoundSection.innerHTML = `<tr><th scope="col">Round</th><th scope="col">${player1name} Move</th><th scope="col">${player1name} Score</th><th scope="col">${player2name} Move</th><th scope="col">${player2name} Score</th></tr>`;
    roundFullDataDisplaySectionTbody.innerHTML = "No rounds played!";
    roundFullDataDisplaySectionTfoot.innerHTML = "";
  }
}

export class NextRound {
  static start() {
    if (game) {
      game.nextRound();
    }
  }
}

export class PlayFull {
  static start() {
    if (game) {
      game.play();
    }
  }
}

export class ClearConsole {
  static start() {
    console.clear();
  }
}

export class AddTournament {
  static addTournament() {
    const result = game.findWinner();
    // if(tournament.length > 0) {
    //   for(const item of tournament) {
    //     if(item.id === result.id) {
    //       return;
    //     }
    //   }
    // }
    tournament.push(result);
    let text = '<ul class="list-group">';
    for (const match of tournament) {
      text =
        text +
        `<li class="list-group-item">${match.comment}. <br/>Winner name: <strong>${match.winnerName}</strong>. Winner strategy: <strong>${match.winnerStrategy}</strong>. Loser name: <strong>${match.loserName}</strong>. Loser strategy: <strong>${match.loserStrategy}</strong></li>`;
    }
    text = text + "</ul>";
    tournamantSection.innerHTML = text;
  }
}

// Find max value in an object
export const getMax = (object) => {
  return Object.keys(object).filter((x) => {
    return object[x] == Math.max.apply(null, Object.values(object));
  });
};

export class FindWinStr {
  static findStr() {
    let uniqueStrategies = new Object();
    for (const match of tournament) {
      if (match.winnerStrategy !== "N/A") {
        if (uniqueStrategies.hasOwnProperty(match.winnerStrategy)) {
          uniqueStrategies[match.winnerStrategy] = uniqueStrategies[match.winnerStrategy] + 1;
        } else {
          uniqueStrategies[match.winnerStrategy] = 1;
        }
      }
    }
    const winner = getMax(uniqueStrategies);
    if (winner.length > 1) {
      winStrategySection.innerHTML = `Champion strategies: <strong>${winner.join(", ")}</strong>!`;
    } else if (winner.length === 1) {
      winStrategySection.innerHTML = `Champion strategy: <strong>${winner[0]}</strong>!`;
    } else {
      winStrategySection.innerHTML = `Champion strategy: No winner!`;
    }
  }
}

export class FindWinName {
  static findName() {
    let uniqueNames = new Object();
    for (const match of tournament) {
      if (match.winnerName !== "N/A") {
        if (uniqueNames.hasOwnProperty(match.winnerName)) {
          uniqueNames[match.winnerName] = uniqueNames[match.winnerName] + 1;
        } else {
          uniqueNames[match.winnerName] = 1;
        }
      }
    }
    const winner = getMax(uniqueNames);
    if (winner.length > 1) {
      winPlayerNameSection.innerHTML = `Champion players: <strong>${winner.join(", ")}</strong>!`;
    } else if (winner.length === 1) {
      winPlayerNameSection.innerHTML = `Champion player: <strong>${winner[0]}</strong>!`;
    } else {
      winPlayerNameSection.innerHTML = `Champion player: No winner!`;
    }
  }
}

export class getStrategiesList {
  static getData() {
    let list = [];
    for (const str in strategies) {
      list.push(strategies[str].getName());
    }
    return list;
  }
}

export class getRoundFullTableData {
  static getData(gameData) {
    let row = "";
    let _player1Score = 0;
    let _player2Score = 0;
    for (const round of gameData.total) {
      row = row + `<tr><td>${round.count}</td><td>${round.player1Move ? "Cooperate" : "Defect"}</td><td>${round.player1Score}</td><td>${round.player2Move ? "Cooperate" : "Defect"}</td><td>${round.player2Score}</td></tr>`;
      _player1Score = _player1Score + round.player1Score;
      _player2Score = _player2Score + round.player2Score;
    }
    const footer = `<tr><td>Total:</td><td> </td><td>${_player1Score}</td> <td></td><td>${_player2Score}</td></tr>`;
    return {
      row: row,
      footer: footer
    };
  }
}

// Add event listeners to buttons
btnStartGame.addEventListener("click", Initialize.start);
btnNextRound.addEventListener("click", NextRound.start);
btnPlay.addEventListener("click", PlayFull.start);
btnClearConsole.addEventListener("click", ClearConsole.start);
btnAddTournament.addEventListener("click", AddTournament.addTournament);
btnfindWinStr.addEventListener("click", FindWinStr.findStr);
btnfindWinName.addEventListener("click", FindWinName.findName);
roundFullDataDisplaySectionTbody.innerHTML = "No rounds played!";

// Render strategies list in UI
strategiesList.innerHTML = getStrategiesList.getData().join(", ");
