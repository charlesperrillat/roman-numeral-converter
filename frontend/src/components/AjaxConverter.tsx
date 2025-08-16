import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface ConversionResult {
  number: number;
  roman: string;
}

const AjaxConverter = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const number = parseInt(input);

      if (isNaN(number) || number < 0 || number > 100) {
        setError("Please enter an integer between 0 and 100");
        return;
      }

      const response = await axiosInstance.post(`/convert`, {
        number: number,
      });

      setResult(response.data);
    } catch (error: any) {
      if (error.response) {
        // Server response error (4xx, 5xx)
        setError(error.response.data?.error || "Error while converting");
      } else if (error.request) {
        // Network error
        setError("Server connection error");
      } else {
        // Another error
        setError(error.message || "An error occured");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5"
      >
        <label htmlFor="number" className="text-xl">
          Enter an integer between 0 and 100:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            id="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. 42"
            required
            className="border p-2 rounded-[4px] w-24"
          />
          <button
            type="submit"
            disabled={loading}
            className="border rounded-[4px] w-30 p-2 cursor-pointer font-bold bg-blue-500 text-white"
          >
            Convert
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <p className="text-2xl text-green-500">Result: {result.roman}</p>
      )}
    </div>
  );
};

export default AjaxConverter;
