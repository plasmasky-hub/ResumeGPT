import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

const ResumeForm: React.FC = () => {
    const [value, setValue] = useState("");
    const [response, setResponse] = useState("");

    function handleFormChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5041/api/Resume/analyze",
                {
                    resumeText: value,
                }
            );

            console.log("success, ", res.data);

            setResponse(res.data.message);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    return (
        <div>
            <p>Input Area</p>
            <form onSubmit={handleSubmit}>
                <textarea value={value} onChange={handleFormChange} />
                <button type="submit">Submit</button>
            </form>
            <p>{response}</p>
        </div>
    );
};

export default ResumeForm;
