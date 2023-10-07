import {FC} from "react";
import {useParams} from "react-router-dom";

export const PlayerControlScreen: FC = () => {
    const {playerId} = useParams()

    return (
        <div>
            controls {playerId}
        </div>
    )
}