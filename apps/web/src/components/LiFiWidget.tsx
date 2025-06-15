import { LiFiWidget } from "@lifi/widget";
import { useMemo } from "react";
import "./App.css";

function App() {
  const widgetConfig = useMemo(() => {
    return {
      fee: 0.01,
      feeCollector: "0xb889655DCcBeaF8e8267EF2982762Ecab1c2b0af",

      theme: {
        palette: {
          primary: { main: "#212121" },
          secondary: { main: "#525252" },
        },
        shape: {
          borderRadius: 12,
        },
      },
    };
  }, []);

  return (
    <div className="flex justify-center items-center p-2">
      <LiFiWidget integrator="SentiaAI" config={widgetConfig} />
    </div>
  );
}

export default App;