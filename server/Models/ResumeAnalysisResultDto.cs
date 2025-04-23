namespace resume_gpt.Models
{
    public class ResumeAnalysisResultDto
    {
        public string Summary { get; set; } = string.Empty;
        public List<string> Stengths { get; set; } = new();
        public List<string> Weaknesses { get; set; } = new();
        public List<string> Suggestions { get; set; } = new();
    }
}