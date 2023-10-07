import { FC, useEffect, useRef } from "react";
import {Link} from "react-router-dom";

export const GameScreen: FC = () => {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    const webSocket = new WebSocket('ws://127.0.0.1:3002')
    const ctx = canvasRef.current?.getContext("2d");
    // if (ctx) {
    //   ctx.rect
    // }
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ height: "100vmin", width: "100vmin" }}>
        <canvas style={{ height: "100%", width: "100%" }} ref={canvasRef} />
      </div>
    </div>
  );
};
