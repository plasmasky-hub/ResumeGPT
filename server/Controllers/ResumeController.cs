using Microsoft.AspNetCore.Mvc;
using resume_gpt.Models;
using resume_gpt.Services;

namespace resume_gpt.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly GptService _gptService;

        public ResumeController(GptService gptService)
        {
            _gptService = gptService;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromBody] ResumeRequest request)
        {
            if(string.IsNullOrWhiteSpace(request.ResumeText))
            {
                return BadRequest("Resume text is required.");
            }

            var result = await _gptService.AnalyzeResumeAsync(request.ResumeText);

            if(result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }
    }
}