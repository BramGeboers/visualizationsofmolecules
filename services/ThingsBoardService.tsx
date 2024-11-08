const API_URL = "https://thingsboard.ucll.cloud:443";
const deviceId = "72641060-11e8-11ef-a3a3-a770882bbf4c";
const getBasicStats = async () => {
  const now = Date.now();
  const hourAgo = now - 2000;

  const response = await fetch(
    `${API_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=temperature,Soil Moisture,Humidity,Light Level,WaterLevel&startTs=${hourAgo}&endTs=${now}&limit=1`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer: " + sessionStorage.getItem("statisticsToken"),
      },
    }
  );
  const data = await response.json();
  return data;
};

const getStatsByTimeframe = async (timeframe: "hour" | "week" | "month") => {
  const now = Date.now();
  const begin = {
    hour: now - 3600000,
    week: now - 604800000,
    month: now - 2628000000,
  }[timeframe];

  const response = await fetch(
    `${API_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=temperature,Soil Moisture,Humidity,Light Level,WaterLevel&startTs=${begin}&endTs=${now}&limit=100`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer: " + sessionStorage.getItem("statisticsToken"),
      },
    }
  );
  const data = await response.json();
  return data;
};

const giveWater = async (
  deviceId: string,
  idealMoistureLevel: number,
  auto: boolean
) => {
  const response = await fetch(
    `${API_URL}/api/plugins/rpc/oneway/${deviceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + sessionStorage.getItem("statisticsToken"),
      },
      body: JSON.stringify({
        method: "setMotorMode",
        params: {
          idealMoisture: idealMoistureLevel,
          autoPilot: auto,
        },
      }),
    }
  );
  return response;
};

export const ThingsBoardService = {
  getBasicStats,
  getStatsByTimeframe,
  giveWater,
};
