const IP_FOR_FAILOVER_2 = "192.168.0.40";
const LOCALHOST = "localhost";
const PRODUCTION_HOST = '85.193.89.172'

export const WS_SERVER_ADDRESS =
  process.env.NODE_ENV === "development"
    ? `ws://${IP_FOR_FAILOVER_2}:3001/ws`
    : `ws://${PRODUCTION_HOST}:3005/ws`;
export const SERVER_ADDRESS =
  process.env.NODE_ENV === "development"
    ? `http://${IP_FOR_FAILOVER_2}:3001`
    : `http://${PRODUCTION_HOST}:3005`;
