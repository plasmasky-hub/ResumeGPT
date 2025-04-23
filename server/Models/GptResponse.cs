namespace resume_gpt.Models
{
    public class GptResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
}