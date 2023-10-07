import React, {FC, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import appState from "../store/appState";
import {observer} from "mobx-react-lite";
import {Button} from "antd";
import {LeftOutlined, RightOutlined, UpOutlined} from "@ant-design/icons";


export const PlayerControlScreen: FC = observer(() => {
    const {playerId} = useParams()
    const wsConnection = useRef<WebSocket | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!appState.playerId) {
            navigate('/new-player');
        }
    }, [])


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
                <Button className="control-button">
                    <UpOutlined/>
                </Button>
                <div style={{display: 'flex', gap: '50px'}}>
                    <Button className="control-button">
                        <LeftOutlined/>
                    </Button>
                    <Button className="control-button">
                        <RightOutlined/>
                    </Button>
                </div>
            </div>
        </div>
    )
})