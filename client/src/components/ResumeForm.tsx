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
        <div>
            <section>
                <p>Input Area</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={value}
                        onChange={handleFormChange}
                        placeholder="Paste resume text here"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading" : "Submit"}
                    </button>
                </form>
            </section>
            <section>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {response && response.data && (
                    <div>
                        <h3>Analysis Result</h3>
                        <p>
                            <strong>Summary</strong>
                        </p>
                        <p>{response.data.summary}</p>
                        <p>
                            <strong>Strengths</strong>
                        </p>
                        <p>{response.data.strengths}</p>
                        <p>
                            <strong>Weaknesses</strong>
                        </p>
                        <p>{response.data.weaknesses}</p>
                        <p>
                            <strong>Suggestions</strong>
                        </p>
                        <p>{response.data.suggestions}</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ResumeForm;
