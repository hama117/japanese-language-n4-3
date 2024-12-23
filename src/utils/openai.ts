import { OpenAI } from 'openai';
import { Question } from '../types/Question';
import { LANGUAGE_PROMPTS } from './languagePrompts';

export const generateExplanation = async (
  question: Question,
  userAnswer: number,
  isCorrect: boolean,
  apiKey: string,
  selectedLanguage: string
): Promise<string> => {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const languageConfig = LANGUAGE_PROMPTS[selectedLanguage as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: languageConfig.systemPrompt
        },
        {
          role: "user",
          content: languageConfig.userPrompt(question, userAnswer, isCorrect)
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || 'No explanation generated.';
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw new Error('Failed to generate explanation');
  }
};