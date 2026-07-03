import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import HelpPopup from "../Components/Help/HelpPopup";
import AIChatBot from "../Components/Chat/AIChatBot";
import Navbar from "../Components/Navbar/Navbar";

const PracticePage = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\n");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [notes, setNotes] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const getLanguageId = (language) => {
    switch (language) {
      case "javascript": return 63;
      case "python": return 71;
      case "java": return 62;
      case "cpp": return 54;
      case "c": return 50;
      default: return 63;
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running... please wait ⏳");

    try {
      const languageId = getLanguageId(language);

      // Using public Judge0 instance (free, no API key needed)
      const submitRes = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
        {
          source_code: code,
          language_id: languageId,
          stdin: stdin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.REACT_APP_JUDGE0_API_KEY || "4de953dca3msh9e69eb61e89af05p1b21a7jsn7ebf34d234a5",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = submitRes.data.token;
      if (!token) throw new Error("No token received from Judge0");

      // Poll for result
      let result;
      for (let i = 0; i < 20; i++) {
        await sleep(1000);
        const pollRes = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key": process.env.REACT_APP_JUDGE0_API_KEY || "4de953dca3msh9e69eb61e89af05p1b21a7jsn7ebf34d234a5",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = pollRes.data;
        if (result.status && result.status.id >= 3) break;
      }

      if (!result) {
        setOutput("Error: Timeout - code took too long to execute");
        return;
      }

      if (result.status.id === 3) {
        setOutput(result.stdout || "✅ Code ran successfully (no output)");
      } else if (result.status.id === 6) {
        setOutput(`Compilation Error:\n${result.compile_output || ""}`);
      } else if (result.status.id > 3) {
        setOutput(
          `Error (${result.status.description}):\n${result.stderr || result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setOutput(
          "❌ API Key Error: Judge0 API key is invalid or expired.\n\nPlease get a free key from:\nhttps://rapidapi.com/judge0-official/api/judge0-ce\n\nThen add it to client/.env as:\nREACT_APP_JUDGE0_API_KEY=your_key_here"
        );
      } else {
        setOutput(`Error: ${error.message}`);
      }
      console.error("Run error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <Navbar />
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
        <h1 className="text-xl font-semibold tracking-wider">Practice Ground</h1>
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-4 py-2 text-white rounded-lg shadow-md transform transition-transform ${
              isRunning
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 hover:scale-105"
            }`}
          >
            {isRunning ? "Running..." : "▶ Run"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/4 bg-gray-800 p-4 shadow-inner">
          <MonacoEditor
            language={language}
            theme="vs-dark"
            value={code}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
            }}
            onChange={(newCode) => setCode(newCode)}
          />
        </div>
        <div className="w-1/4 bg-gray-900 p-4 text-white border-l border-gray-700 flex flex-col gap-4">
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Input (stdin)</h3>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input for your program here, e.g.&#10;5 10"
              className="w-full h-32 p-3 bg-gray-800 rounded-lg text-gray-300 focus:outline-none resize-none"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              className="w-full h-full p-3 bg-gray-800 rounded-lg text-gray-300 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-900 text-white border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Output:</h3>
        <pre className="bg-gray-800 p-4 rounded-lg shadow-inner text-gray-300 overflow-auto whitespace-pre-wrap h-40">
          {output || "Output will appear here after running code..."}
        </pre>
      </div>
      <HelpPopup />
      <AIChatBot />
    </div>
  );
};

export default PracticePage;
