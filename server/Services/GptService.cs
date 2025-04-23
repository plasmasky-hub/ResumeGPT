using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using resume_gpt.Models;

namespace resume_gpt.Services
{
    public class GptService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GptService (HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenAI:ApiKey"];
        }

        public async Task<GptResponse<ResumeAnalysisResultDto>> AnalyzeResumeAsync(string text)
        {
            try
            {
                var requestBody = new 
                {
                    model = "gpt-4.1",
                    messages = new[] 
                    {
                        new { role = "system", content = "You are a professional HR, please analyze this resume and give useful suggestions."},
                        new { role = "user", content = 
                            $"Please analyze the following resume and return the result as JSON like this:\n" +
                            "{\n" +
                            "\"summary\": \"...\",\n" +
                            "\"strengths\": [\"...\", \"...\"],\n" +
                            "\"weaknesses\": [\"...\", \"...\"],\n" +
                            "\"suggestions\": [\"...\", \"...\"]\n" +
                            $"}}\n\nResume content:\n{text}"
                            },
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

                var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
                var responseString = await response.Content.ReadAsStringAsync();

                using var jsonDoc = JsonDocument.Parse(responseString);

                if(!jsonDoc.RootElement.TryGetProperty("choices", out var choicesElement))
                {
                    var error = jsonDoc.RootElement.GetProperty("error").GetProperty("message").GetString();

                    return new GptResponse<ResumeAnalysisResultDto>
                    {
                        Success= true,
                        Message= $"OpenAI error: {error}"

                    };
                }

                var rawContent = jsonDoc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                var result = new GptResponse<ResumeAnalysisResultDto>
                {
                    Success= true,
                    Message= rawContent!
                };

                try 
                {
                    var dto = JsonSerializer.Deserialize<ResumeAnalysisResultDto>(rawContent!, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    result.Data = dto;
                }
                catch (JsonException ex)
                {
                    result.Message += $"\n(Warn: Failed to deserialize JSON into DTO: {ex.Message})";
                }

                return result;
            }
            catch(HttpRequestException httpEx)
            {
                return new GptResponse<ResumeAnalysisResultDto>
                {
                    Success= false,
                    Message= $"HTTP Error: {httpEx.Message}"

                };
            }
            catch(JsonException jsonEx)
            {
                return new GptResponse<ResumeAnalysisResultDto>
                {
                    Success= false,
                    Message= $"JSON Error: {jsonEx.Message}"

                };
            }
            catch(Exception ex)
            {
                return new GptResponse<ResumeAnalysisResultDto>
                {
                    Success= false,
                    Message= $"Unexpected Error: {ex.Message}"

                };
            }
        }
    }
}