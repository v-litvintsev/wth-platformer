import {FC, useEffect, useRef, useState} from "react";
import appState from "../store/appState";
import {observer} from "mobx-react-lite";

export const GameScreen: FC = observer(() => {
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const [pixelRatio, setPixelRatio] = useState<number | null>(null);


    function vmin(percent: number) {
        return Math.min(
            (percent * Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) / 100,
            (percent * Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100
        );
    }


    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current!.width = vmin(100);
            canvasRef.current!.height = vmin(100);

            setPixelRatio(canvasRef.current!.width / 1000);
        }

        // fpsMeter()
    }, [canvasRef.current])

    useEffect(() => {
        if (appState.wsConnection) {
            applyEventListener()
        }
    }, [appState.wsConnection])

    const applyEventListener = () => {
        appState.wsConnection?.addEventListener('message', (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'update') {
                requestAnimationFrame(() => {
                    drawFrame(data)
                })
            }
        })
    }

    const drawFrame = (data: any) => {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        for (let player of data.playersState) {
            drawPlayer(player)
        }
    }

    const fpsMeter = () => {
        let prevTime = Date.now(),
            frames = 0;

        requestAnimationFrame(function loop() {
            const time = Date.now();
            frames++;
            if (time > prevTime + 1000) {
                let fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                prevTime = time;
                frames = 0;

                console.info('FPS: ', fps);
            }

            requestAnimationFrame(loop);
        });
    }

    const drawPlayer = (player: any) => {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.beginPath();
        ctx.rect(player.x * pixelRatio!, player.y * pixelRatio!, 11 * pixelRatio!, 11 * pixelRatio!);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.lineWidth = 5;
    }

    return (
        <div style={{height: "100%", display: "flex", justifyContent: "center"}}>
            <div style={{height: "100vmin", width: "100vmin"}}>
                <canvas style={{height: "100%", width: "100%"}} ref={canvasRef}/>
            </div>
        </div>
    );
});
