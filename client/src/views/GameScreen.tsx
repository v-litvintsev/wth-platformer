import { FC, useEffect, useRef, useState } from "react";
import appState from "../store/appState";
import { observer } from "mobx-react-lite";
import { getTargetColor, targetAngleLoop } from "../utils/getTargetColor";
import {vmin} from "../utils/vmin";
import {Modal} from "antd";

export const GameScreen: FC = observer(() => {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const [pixelRatio, setPixelRatio] = useState<number | null>(null);
  const [winnerColor, setWinnerColor] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current!.width = vmin(100);
      canvasRef.current!.height = vmin(100);

      setPixelRatio(canvasRef.current!.width / 1000);
    }

    const targetAngleLoopInstance = targetAngleLoop();

    return () => {
      clearInterval(targetAngleLoopInstance);
    };
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
      } if (data.type === 'win' && !winnerColor) {
        setWinnerColor(data.color as string)
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

  const drawTarget = () => {
    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.beginPath();
    ctx.arc(
      (168 + 17) * pixelRatio!,
      (52 + 17) * pixelRatio!,
      17 * pixelRatio!,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = getTargetColor(ctx);

    ctx.fill();
    ctx.closePath();
  };

  const drawScene = (blocks: any) => {
    for (let block of blocks) {
      drawBlock(block);
    }

    drawTarget();
  };

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ height: "100vmin", width: "100vmin" }}>
        <Modal width="80vh" open={!!winnerColor} title="Игра окончена" centered footer={<></>} closable={false}>
          <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <h2 style={{margin: '0'}}>Выиграл</h2> <div style={{backgroundColor: winnerColor!, width: 30, height: 30, borderRadius: '100px'}}></div>
            </div>
          </div>
        </Modal>

        <canvas style={{ height: "100%", width: "100%" }} ref={canvasRef} />
      </div>
    </div>
  );
});
