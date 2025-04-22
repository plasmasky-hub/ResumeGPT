import ResumeForm from "../components/ResumeForm";

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home</h1>
            <div>
                <p>Please input your resume below</p>
                <ResumeForm />
            </div>
        </div>
    );
};

export default Home;
