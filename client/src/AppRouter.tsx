import { FC, useEffect } from "react";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import { GameScreen } from "./views/GameScreen";

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
      </Routes>
    </Layout>
  );
};

export default AppRouter;
