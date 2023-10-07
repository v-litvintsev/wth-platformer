import { FC, useEffect } from "react";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import { GameScreen } from "./views/GameScreen";
import {PlayerControlScreen} from "./views/PlayerControlScreen";
import {NewPlayerScreen} from "./views/NewPlayerScreen";
import {observer} from "mobx-react-lite";
import appState from "./store/appState";
import {WS_SERVER_ADDRESS} from "./http-client/constants";

const AppRouter: FC = observer(() => {
  useEffect(() => {
    appState.wsConnection = new WebSocket(WS_SERVER_ADDRESS);
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/player/:playerId" element={<PlayerControlScreen />} />
        <Route path="/new-player" element={<NewPlayerScreen />} />
      </Routes>
    </Layout>
  );
});

export default AppRouter;
