import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [expressions, setExpressions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setError("");
    setExpressions([]);
  };

  const handleExtractMath = async () => {
    if (!selectedFile) {
      setError("Please choose a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://smart-math-finder.onrender.com/api/pdf/extract-math",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setExpressions(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      if (requestError.response) {
        setError(
          "Could not extract expressions. Please verify your PDF and try again.",
        );
      } else {
        setError(
          "Server unavailable. Please make sure the backend is running on port 8080.",
        );
      }
      setExpressions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Math Expression Finder
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Upload a PDF and extract all detected mathematical expressions
            instantly.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label
                htmlFor="pdf-upload"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Select PDF file
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-slate-600">
                  Selected:{" "}
                  <span className="font-medium">{selectedFile.name}</span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleExtractMath}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loading ? "Analyzing PDF..." : "Extract Math"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Extracted Expressions
          </h2>

          {!loading && expressions.length === 0 && !error && (
            <p className="mt-3 text-sm text-slate-600">
              No expressions yet. Upload a PDF and click Extract Math.
            </p>
          )}

          {expressions.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {expressions.map((expression, index) => (
                <div
                  key={`${expression}-${index}`}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="break-words font-mono text-sm text-slate-800">
                    {expression}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
