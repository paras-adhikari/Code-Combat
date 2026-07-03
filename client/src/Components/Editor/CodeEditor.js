import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from '../../Contexts/UserContext';
import HelpPopup from "../Help/HelpPopup";
import AIChatBot from "../Chat/AIChatBot";
const CodeEditor = () => {
  const navigate = useNavigate();
  const { contestId, teamId } = useParams(); 
  const { user } = useUser(); 
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [teamScore, setTeamScore] = useState(0); 
  const socket = useRef(null); 
  const [taskScores, setTaskScores] = useState({});
  

  const [currentPage, setCurrentPage] = useState(0);


  useEffect(() => {
    const savedCode = localStorage.getItem("savedCode");
    const savedScore = localStorage.getItem("teamScore");
    const fetchTeamScore = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/contest/team/${teamId}`
        );
        setTeamScore(response.data.score)
        console.log(response.data.score)
        // setTeamScore(response.data.score);
              } catch (error) {
        console.error("Error fetching team score:", error);
      }
    };
    if (savedCode) setCode(savedCode);
    if (savedScore) setTeamScore(Number(savedScore));

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/codestatment/problems`
        );
        setTasks(response.data); 
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    socket.current = io(`${process.env.REACT_APP_BACKEND_URL}`);

    socket.current.emit("joinRoom", teamId);

    socket.current.on("message", (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });
  fetchTeamScore()
  fetchTasks()
  return () => {
    socket.current.disconnect();
  };
  }, [teamId,teamScore,taskScores]);

 
  const handleEditorChange = (value) => {
    setCode(value);
    localStorage.setItem("savedCode", value);
  };

  const getLanguageId = (language) => {
    const languages = { javascript: 63, python: 71, java: 62 };
    return languages[language] || 63; // Default to JavaScript
  };

 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const sendMessage = () => {
      const message = { teamId, content: currentMessage, sender: user.username };
      socket.current.emit("message", message); // Emit to the server
      setMessages((prevMessages) => [...prevMessages, message]); // Update local message list
      setCurrentMessage(""); 
      console.log(messages)// Clear the input
    
  };
  
  const submitCode = async () => {
    setLoading(true);
    setTestResults([]);
    try {
      const selectedTask = tasks[currentPage];
      const taskId = currentPage;
      const testcases = selectedTask.testcases;
  
      const submissions = testcases.map((testcase) => ({
        source_code: code,
        language_id: getLanguageId(language),
        stdin: testcase.input.trim(),
        expected_output: testcase.output.trim(),
      }));
  
      // Submit batch
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions/batch",
        { submissions },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "4de953dca3msh9e69eb61e89af05p1b21a7jsn7ebf34d234a5",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
  
      const tokens = response.data.map((submission) => submission.token);
  
      // Fetch results
      const results = await Promise.all(
        tokens.map(async (token) => {
          let status, result;
          while (true) {
            const resultResponse = await axios.get(
              `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
              {
                headers: {
                  "X-RapidAPI-Key": "4de953dca3msh9e69eb61e89af05p1b21a7jsn7ebf34d234a5",
                  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
              }
            );
            result = resultResponse.data;
            status = result.status.id;
            if (status === 3 || status > 3) break; // Success or error
            await sleep(500); // Wait 500ms before retrying
          }
          return result;
        })
      );
  
      // Calculate and update task score
      const questionMaxScore = 100; // Maximum score per question
      const testcaseScore = questionMaxScore / testcases.length; // Score per test case
  
      const updatedScores = { ...taskScores };
  
      if (!updatedScores[taskId]) {
        updatedScores[taskId] = { score: 0, passedInputs: new Set() };
      }
  
      let taskScore = updatedScores[taskId].score;
      const passedInputs = updatedScores[taskId].passedInputs;
  
      results.forEach((result, index) => {
        const input = testcases[index].input;
        const passed = result.status.id === 3;
  
        if (passed && !passedInputs.has(input)) {
          taskScore += testcaseScore;
          passedInputs.add(input);
        }
      });
  
      updatedScores[taskId] = { score: taskScore, passedInputs };
      setTaskScores(updatedScores);

      // Calculate and update total team score
      const totalTeamScore = Object.values(updatedScores).reduce((total, task) => total + task.score, 0);
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/contest/team/${teamId}/score`, { score:totalTeamScore });

      // Display results
      const formattedResults = results.map((result, index) => ({
        input: testcases[index].input,
        expected: testcases[index].output.trim(),
        actual: result.stdout?.trim() || "Error/No Output",
        status: result.status.id === 3 ? "Passed" : "Failed",
      }));
  
      setTestResults(formattedResults);
      const totalPassed = formattedResults.filter((result) => result.status === "Passed").length;
      setOutput(
        `${totalPassed}/${testcases.length} test cases passed. Task Score: ${taskScore}`
      );
    } catch (error) {
      setOutput(`Error evaluating test cases: ${error.message}`);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < tasks.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const finish = async () => {
    try {
      const score = teamScore; 
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/contest/team/${teamId}/score`, { score });

      if (response.status === 200) {
        console.log("Team score updated successfully");
        navigate(`/contest/${contestId}/result/${teamId}`);
      } else {
        console.error("Failed to update score");
      }
    } catch (error) {
      console.error("Error updating team score:", error);
    }
  };

 

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center px-4  bg-gray-900 border-b border-black">
        <h1 className="text-3xl font-bold text-white">Code Battle</h1>  
        <div><HelpPopup/></div>
        <AIChatBot/>

        {/* Pagination */}
        <div className="p-4  flex justify-center gap-10 items-center">
          <div className="text-lg text-white font-semibold">Score: {teamScore}</div>
          <button
            onClick={() => handlePagination("prev")}
            className="px-4 py-2 mx-2 bg-green-600 hover:scale-110 cursor-pointer text-white rounded-md hover:bg-green-500"
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white font-semibold">{`Task ${currentPage + 1} of ${tasks.length}`}</span>
          <button
            onClick={() => handlePagination("next")}
            className="px-4 py-2 mx-2 bg-green-600 hover:scale-110 cursor-pointer text-white rounded-md hover:bg-green-500"
            disabled={currentPage === tasks.length - 1}
          >
            Next
          </button>
        </div>

        {/* Finish Button */}
        <div className="p-4 flex justify-center gap-10">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border-black rounded bg-gray-700 text-white"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={finish}
            className="px-6 py-3 bg-blue-600 hover:scale-110 hover:bg-blue-500 text-white rounded-md"
          >
            Finish
          </button>
        </div>
      </div>
  {/**Qusetion Display */}
  <div className="flex-1 flex justify-center bg-gray-900 text-white w-full">
  {/* Test Cases */}
  <div className="flex flex-col gap-4 justify-between p-2 w-2/5 border-r-2 border-black">
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{tasks[currentPage]?.title}</h2>
      <p>{tasks[currentPage]?.statement}</p>
      <p>{tasks[currentPage]?.explanation}</p>
      <p>{tasks[currentPage]?.description}</p>
    </div>
    {/* Display Test Cases */}
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Test Cases</h3>
      {tasks[currentPage]?.testcases?.length > 0 ? (
        tasks[currentPage].testcases.map((testcase, index) => (
          <div
            key={index}
            className="bg-gray-700 p-2 border rounded-md shadow-sm"
          >
            <p>
              <strong>Input:</strong> {testcase.input}
            </p>
            <p>
              <strong>Expected Output:</strong> {testcase.output}
            </p>
          </div>
        ))
      ) : (
        <p>No test cases available.</p>
      )}
    </div>
    <div className="flex  justify-between">
      <button
        onClick={submitCode}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 hover:scale-110"
      >
        Submit Code
      </button>
    </div>
  </div>

  {/* Code Editor */}
    <div className="w-full max-w-3/5 py-2 px-1">
    <Editor
    theme="vs-dark"
      height="500px"
     language={language}
      value={code}
      onChange={handleEditorChange}
    />
     </div>
  </div>


      {/* Output */}
      <div className="bg-gray-100 px-4 py-2 flex justify-between bg-gray-900 text-white border-black">
        <div className="flex flex-col gap-4 w-full">
    <h2 className="text-xl font-semibold">Test Output</h2>

    {/* Table for test case results */}
    <table className="table-auto w-full border-collapse border border-black bg-gray-900">
      <thead>
        <tr className="bg-gray-700">
          <th className="border border-gray-300 px-4 py-2 text-left">Input</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Expected Output</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Actual Output</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {testResults.length > 0 ? (
          testResults.map((result, index) => (
            <tr key={index} className={result.status === "Passed" ? "bg-green-600" : "bg-red-600"}>
              <td className="border border-gray-300 px-4 py-2">{result.input}</td>
              <td className="border border-gray-300 px-4 py-2">{result.expected}</td>
              <td className="border border-gray-300 px-4 py-2">{result.actual}</td>
              <td className="border border-gray-300 px-4 py-2 font-semibold">{result.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="border border-black px-4 py-2 text-center">
              No results available
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Raw Output */}
    <pre className="mt-4 p-4 bg-gray-200 rounded-md overflow-auto bg-gray-700">
      {output || "No output available"}
    </pre>
         </div>
      {/* Chat Section */}
        <div className="flex flex-col gap-1 p-2 w-2/5 bg-gray-900 rounded-xl border-l-2 border-black">
    <h2 className="text-xl font-semibold text-white">Team Chat</h2>
    <div className="flex flex-col text-white bg-gray-700 p-4 h-52 overflow-auto">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <p>{msg.sender}:</p> <p>{msg.content}</p>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        className="px-4 py-2 w-[73%] border rounded-md bg-gray-500"
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-600 hover:scale-110 text-white rounded-md hover:bg-blue-500"
      >
        Send
      </button>
    </div>
        </div>
      </div>


    </div>
  );
};

export default CodeEditor;
