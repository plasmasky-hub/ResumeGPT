export interface ResumeAnalysisResult {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}

export interface ResumeAnalysisResponse {
    sucess: boolean;
    message?: string;
    data?: ResumeAnalysisResult;
}
