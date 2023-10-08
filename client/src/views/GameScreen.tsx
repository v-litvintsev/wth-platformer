import { FC, useEffect, useRef, useState } from "react";
import appState from "../store/appState";
import { observer } from "mobx-react-lite";

export const GameScreen: FC = observer(() => {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const [pixelRatio, setPixelRatio] = useState<number | null>(null);

  function vmin(percent: number) {
    return Math.min(
      (percent *
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        )) /
        100,
      (percent *
        Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        )) /
        100
    );
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current!.width = vmin(100);
      canvasRef.current!.height = vmin(100);

      setPixelRatio(canvasRef.current!.width / 1000);
    }

    // fpsMeter()
  }, [canvasRef.current]);

  useEffect(() => {
    if (appState.wsConnection && canvasRef.current) {
      applyEventListener();
    }
  }, [appState.wsConnection]);

  const applyEventListener = () => {
    appState.wsConnection?.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "update") {
        requestAnimationFrame(() => {
          drawFrame(data);
        });
      }
    });
  };

  const drawFrame = (data: any) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    drawPlayers(data.playersState);
    drawScene(data.sceneBlocks);
  };

  const drawPlayer = (player: any) => {
    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x * pixelRatio! - 5, player.y * pixelRatio! - 17);
    ctx.lineTo(player.x * pixelRatio! + 5, player.y * pixelRatio! - 17);
    ctx.lineTo(player.x * pixelRatio!, player.y * pixelRatio! - 13);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(
      player.x * pixelRatio!,
      player.y * pixelRatio!,
      11 * pixelRatio!,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
    // ctx.fillRect(player.x * pixelRatio!, player.y * pixelRatio!, 11 * pixelRatio!, 11 * pixelRatio!);
  };

  const drawPlayers = (playersState: any) => {
    for (let player of playersState) {
      drawPlayer(player);
    }
  };

  const drawBlock = (block: any) => {
    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.fillStyle = "black";
    ctx.fillRect(
      block.x * pixelRatio!,
      block.y * pixelRatio!,
      block.width * pixelRatio!,
      block.height * pixelRatio!
    );
  };

  const drawScene = (blocks: any) => {
    for (let block of blocks) {
      drawBlock(block);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ height: "100vmin", width: "100vmin" }}>
        <canvas style={{ height: "100%", width: "100%" }} ref={canvasRef} />
      </div>
    </div>
  );
});
