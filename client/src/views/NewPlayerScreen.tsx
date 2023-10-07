import React, {FC, useEffect, useState} from "react";
import httpClient from "../http-client";
import {observer} from "mobx-react-lite";
import appState from "../store/appState";
import {redirect, useNavigate} from "react-router-dom";
import {Alert, Button, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

export const NewPlayerScreen: FC = observer(() => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (appState.wsConnection) {
            getPlayerId();
        }
    }, [appState.wsConnection])

    const getPlayerId = () => {
        appState.wsConnection?.addEventListener('open', (e) => {
            appState.wsConnection?.send(JSON.stringify({type: 'new-player'}))
        })

        appState.wsConnection?.addEventListener('message', (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'new-player') {
                setLoading(false);
                appState.setPlayerId(data.id);
                appState.setPlayerColor(data.color);
                navigate('/player/' + data.id);
            }

            return;
        })
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '8px'}}>
            {
                loading ?
                    <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/> :
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <Alert
                            showIcon
                            message="Не получилось подключиться"
                            description="Что-то пошло не так, не удалось войти в игровую комнату :("
                            type="error"
                        />
                        <Button onClick={getPlayerId}>
                            Попробовать ещё раз
                        </Button>
                    </div>
            }
        </div>
    )
});