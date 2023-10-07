import { makeAutoObservable } from "mobx";

class AppState {
  constructor() {
    makeAutoObservable(this);
  }

  setPlayerId(id: string) {
    this.playerId = id;
  }

  setPlayerColor(color: string) {
    this.playerColor = color;
  }

  playerId?: string;
  playerColor?: string;
  wsConnection?: WebSocket;
}

export default new AppState();
