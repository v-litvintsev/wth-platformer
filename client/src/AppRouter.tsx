import { FC, useEffect } from "react";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import { GameScreen } from "./views/GameScreen";
import {PlayerControlScreen} from "./views/PlayerControlScreen";
import {NewPlayerScreen} from "./views/NewPlayerScreen";

const AppRouter: FC = () => {
  useEffect(() => {}, []);

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
};

export default AppRouter;
