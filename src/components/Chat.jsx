import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const api_key = process.env.REACT_APP_GOOGLE_GEMINI_API_KEY;
// console.log(api_key)
const Chat = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("Hi there, How can I help you?");
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };
    console.log(api_key)
    async function generateAi() {
        if (!question.trim()) {
            setAnswer("Hi there, How can I help you?");
            return;
        }
        try {
            setAnswer("⏳ Loading answer...");
            setError("");
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${api_key}`,
                {
                    contents: [{ parts: [{ text: question }] }],
                }
            );
            setAnswer(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setError("An error occurred while fetching the response. Please try again.");
            setAnswer("");
        }
    }

    return (
        <div>
            <div className="fixed bottom-4 right-4">
                {!isOpen ? (
                    <motion.button
                        onClick={togglePanel}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                    >
                        <img src='https://img.icons8.com/?size=100&id=uZrQP6cYos2I&format=png&color=000000' alt="Chat icon" />
                    </motion.button>
                ) : (
                    <motion.div
                        className="fixed bottom-0 right-0 w-full md:w-1/3 lg:w-1/4 h-full bg-white shadow-lg"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col items-center justify-center py-10">
                            <motion.div
                                className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex justify-between items-center">
                                    <motion.h1
                                        className="text-3xl font-extrabold mb-4 text-center text-black-800"
                                        initial={{ y: 0 }}
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    >
                                        Chitty AI
                                        <motion.span
                                            initial={{ x: 0 }}
                                            animate={{ x: [0, 20, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            style={{ display: 'inline-block' }}
                                        >
                                            🤖
                                        </motion.span>
                                    </motion.h1>
                                    <button onClick={togglePanel} className="text-gray-600 hover:text-gray-800">
                                        close &times;
                                    </button>
                                </div>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-600"
                                    placeholder="Message Chitty ..."
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            generateAi();
                                        }
                                    }}
                                    rows="4"
                                />
                                <motion.button
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={generateAi}
                                >
                                    Generate
                                </motion.button>
                            </motion.div>
                            <motion.div
                                className="bg-gray-100 shadow-lg rounded-lg p-6 w-full max-w-md mt-6"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                style={{ maxHeight: '60vh', overflowY: 'auto' }} // Added scroll properties
                            >
                                {answer && (
                                    <motion.div
                                        className="mt-4 p-4 bg-white text-black-800 font-semibold border-l-4 border-blue-600 rounded shadow-inner overflow-x-auto whitespace-pre-wrap"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {answer}
                                    </motion.div>
                                )}
                                {error && (
                                    <p className="mt-4 p-2 bg-red-100 border border-red-300 rounded text-red-800">
                                        {error}
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Chat;
