import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance";

interface SSEMessage {
  type: "connected" | "conversion";
  message?: string;
  number?: number;
  roman?: string;
  timestamp?: string;
}

interface ConversionHistory {
  number: number;
  roman: string;
  timestamp: string;
}

const SSEConverter = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize SSE connection
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/convert-stream");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
      setError("");
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data);

        if (
          data.type === "conversion" &&
          data.number !== undefined &&
          data.roman &&
          data.timestamp
        ) {
          setHistory((prev) => [
            {
              number: data.number!,
              roman: data.roman!,
              timestamp: data.timestamp!,
            },
            ...prev.slice(0, 9),
          ]); // Keep last 10 conversions
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      setError("SSE connection lost. Attempting to reconnect...");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const number = parseInt(input);

      if (isNaN(number) || number < 0 || number > 100) {
        setError("Please enter an integer between 0 and 100");
        return;
      }

      await axiosInstance.post("/convert-sse", { number });
      setInput(""); // Clear input after successful submission
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        const errorMessage =
          axiosError.response?.data?.error || "Error while converting";
        setError(errorMessage);
      } else {
        setError("An error occured");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5"
      >
        <label htmlFor="sse-number" className="text-xl">
          Enter an integer between 0 and 100:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            id="sse-number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 rounded-[4px] w-24"
            placeholder="E.g. 42"
            required
          />
          <button
            type="submit"
            disabled={loading || !connected}
            className="border rounded-[4px] w-30 p-2 cursor-pointer font-bold bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {history.length > 0 && (
        <div className="w-full flex flex-col items-center content-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Conversion history
          </h3>
          <div className="w-full space-y-3 max-h-96 overflow-y-auto">
            {history.map((conversion, index) => (
              <div
                key={`${conversion.timestamp}-${index}`}
                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-blue-700">
                    {conversion.roman}
                  </span>
                  <span className="text-gray-600">({conversion.number})</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTime(conversion.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SSEConverter;
