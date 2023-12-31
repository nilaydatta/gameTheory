// Define Strategies
class TitForTat {
  static calcMove(info, oppPlayer) {
    if(info.total.length === 0) {
      return true;
    } else {
      if(!info.total[info.current-1][oppPlayer]) {
        return false;
      } else {
        return true;
      }
    }
  }
  static getName() {
    return "Tit for tat";
  }
};

class EndUpKilling {
  static calcMove(info, oppPlayer) {
    if(info.current === info.rounds - 1) {
      return false;
    } else {
      return TitForTat.calcMove(info, oppPlayer);
    }
  }
  static getName() {
    return "End up killing";
  }
};

const Attack = class {
  static calcMove() {
    return false;
  }
  static getName() {
    return "Attack";
  }
};

class Generous {
  static calcMove() {
    return true;
  }
  static getName() {
    return "Generous";
  }
};

class UnForgiving {
  static calcMove(info, oppPlayer) {
    let decision = true;
    if(info.total.length === 0) {
      return decision;
    } else {
      if(!info.total[info.current-1][oppPlayer]) {
        decision = false;
        return decision;
      }
    }
    return decision;
  }
  static getName() {
    return "Unforgiving";
  }
};

class Jump {
  static calcMove(info) {
    if(info.total.length % 2 === 0) {
      return true;
    } else {
        return false;
    }
  }
  static getName() {
    return "Jump";
  }
};

class Sneaky {
  static calcMove(info, oppPlayer) {
    if(info.total.length === 0) {
      return true;
    } else {
      if(info.current > 1) {
        if(!info.total[info.current-2][oppPlayer] && !info.total[info.current-1][oppPlayer]) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  static getName() {
    return "Sneaky";
  }
};

class Random {
  static calcMove() {
    const move = Math.round(Math.random());
    return move ? true : false;
  }
  static getName() {
    return "Random";
  }
};

// Define all strategies in a variable in key-value pair for easy reference and list them
export const strategies = {
  titfortat: TitForTat,
  attack: Attack,
  generous: Generous,
  unforgiving: UnForgiving,
  sneaky: Sneaky,
  random: Random,
  jump: Jump,
  endupkilling: EndUpKilling,
};

export default strategies;