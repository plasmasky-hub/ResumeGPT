import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { ResumeAnalysisResponse } from "../types/GptResponse";

const ResumeForm: React.FC = () => {
    const [value, setValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [response, setResponse] = useState<ResumeAnalysisResponse | null>(
        null
    );

    function handleFormChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResponse(null);

        try {
            const res = await axios.post(
                "http://localhost:5041/api/Resume/analyze",
                {
                    resumeText: value,
                }
            );

            console.log("success, ", res.data);

            setResponse(res.data);
        } catch (error) {
            console.log("error: ", error);
            setError("Error processing resume. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row w-full h-screen gap-4">
            <section className="flex-1 flex flex-col gap-4 md:w-1/2 w-full md:max-w-[600px] min-w-[300px] max-h-[80vh] overflow-y-auto bg-white shadow rounded-xl p-4">
                <h2 className=" text-2xl font-semibold text-gray-800">
                    Input Your Resume
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className=" flex flex-col flex-grow gap-4"
                >
                    <textarea
                        value={value}
                        onChange={handleFormChange}
                        placeholder="Paste resume text here"
                        className=" w-full  h-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className=" w-full self-start bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Analyzing..." : "Submit"}
                    </button>
                </form>
            </section>
            <section className="flex-1 md:w-1/2 w-full md:max-w-[600px] min-w-[300px] max-h-[80vh] overflow-y-auto bg-gray-50 shadow-inner rounded-xl p-4 ">
                {error && <p style={{ color: "red" }}>{error}</p>}
                {response && response.data && (
                    <div className="space-y-3 text-left">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Analysis Result
                        </h3>

                        <div>
                            <p className="font-semibold">Summary</p>
                            <p className="whitespace-pre-wrap break-words text-gray-800">
                                {response.data.summary}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Strengths</p>
                            <ul className="list-disc list-inside text-gray-800">
                                {response.data.strengths?.map(
                                    (strength, index) => (
                                        <li key={index}>{strength}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold">Weaknesses</p>
                            <ul className="list-disc list-inside text-gray-800">
                                {response.data.weaknesses?.map(
                                    (weakness, index) => (
                                        <li key={index}>{weakness}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold">Suggestions</p>
                            <ul className="list-disc list-inside text-gray-800">
                                {response.data.suggestions?.map(
                                    (suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ResumeForm;
