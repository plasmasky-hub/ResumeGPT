import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

const ResumeForm: React.FC = () => {
    const [value, setValue] = useState("");

    function handleFormChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5041/api/Resume/analyze",
                {
                    resumeText: value,
                }
            );

            console.log("sucess, ", response.data);
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
        </div>
    );
};

export default ResumeForm;
