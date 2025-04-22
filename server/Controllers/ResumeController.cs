using Microsoft.AspNetCore.Mvc;
using resume_gpt.Models;

namespace resume_gpt.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        [HttpPost]
        public IActionResult Analyze([FromBody] ResumeSubmission submission)
        {
            string mockResult = submission.Text;

            return Ok(new { suggestion = mockResult });
        }
    }
}