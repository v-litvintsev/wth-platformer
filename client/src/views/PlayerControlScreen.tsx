import React, {FC, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import appState from "../store/appState";
import {observer} from "mobx-react-lite";
import {Button, Modal} from "antd";
import {LeftOutlined, RightOutlined, UpOutlined} from "@ant-design/icons";


export const PlayerControlScreen: FC = observer(() => {
    const navigate = useNavigate();
    const [buttonsState, setButtonsState] = useState({isUp: false, isLeft: false, isRight: false});
    const [winnerColor, setWinnerColor] = useState<string | null>(null);

    useEffect(() => {
        if (!appState.playerId) {
            navigate('/new-player');
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                onButtonDown('up')
            } else if (e.key === 'ArrowLeft') {
                onButtonDown('left')
            } else if (e.key === 'ArrowRight') {
                onButtonDown('right')
            }
        })

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp') {
                onButtonUp('up')
            } else if (e.key === 'ArrowLeft') {
                onButtonUp('left')
            } else if (e.key === 'ArrowRight') {
                onButtonUp('right')
            }
        })
    }, [])

    useEffect(() => {
        if (appState.wsConnection) {
            appState.wsConnection?.addEventListener("message", (e) => {
                const data = JSON.parse(e.data);

                if (data.type === 'win' && !winnerColor) {
                    setWinnerColor(data.color as string)
                }
            });
        }
    }, [appState.wsConnection]);


    useEffect(() => {
        if (appState.wsConnection) {
            appState.wsConnection?.send(JSON.stringify({type: 'control', id: appState.playerId, controls: buttonsState}));
        }
    }, [buttonsState])


    const onButtonDown = (btn: string) => {
        navigator?.vibrate(100);
        switch (btn) {
            case 'up':
                setButtonsState(prevState => ({...prevState, isUp: true}));
                break;
            case 'left':
                setButtonsState(prevState => ({...prevState, isLeft: true}));
                break;
            case 'right':
                setButtonsState(prevState => ({...prevState, isRight: true}));
                break;
        }
    }

    const onButtonUp = (btn: string) => {
        switch (btn) {
            case 'up':
                setButtonsState(prevState => ({...prevState, isUp: false}));
                break;
            case 'left':
                setButtonsState(prevState => ({...prevState, isLeft: false}));
                break;
            case 'right':
                setButtonsState(prevState => ({...prevState, isRight: false}));
                break;
        }
    }

    return (
        <div style={{
            marginTop: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div>
                <h2>Ваш цвет</h2>
                <div style={{
                    borderRadius: '10px',
                    height: '35px',
                    width: '200px',
                    backgroundColor: appState.playerColor
                }}/>
            </div>

            <div style={{
                marginTop: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
            }}>
                <Button className="control-button" onPointerDown={() => onButtonDown('up')} onPointerUp={() => onButtonUp('up')}>
                    <UpOutlined/>
                </Button>
                <div style={{display: 'flex', gap: '50px'}}>
                    <Button className="control-button" onPointerDown={() => onButtonDown('left')} onPointerUp={() => onButtonUp('left')}>
                        <LeftOutlined/>
                    </Button>
                    <Button className="control-button" onPointerDown={() => onButtonDown('right')} onPointerUp={() => onButtonUp('right')}>
                        <RightOutlined/>
                    </Button>
                </div>
            </div>

            <Modal width="80vh" open={!!winnerColor} title="Игра окончена" centered footer={<></>} closable={false}>
                <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <h2 style={{margin: '0'}}>Выиграл</h2> <div style={{backgroundColor: winnerColor!, width: 30, height: 30, borderRadius: '100px'}}></div>
                    </div>
                </div>
            </Modal>
        </div>
    )
})