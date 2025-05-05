import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
/* import { Injectable } from '@nestjs/common';

@Injectable() */
export class ValidateAPISecurityProvider {
  constructor() {}

  private addLineNumbers(json: string): string {
    return json
      .split('\n')
      .map((line, index) => `${String(index + 1).padStart(4, ' ')} | ${line}`)
      .join('\n');
  }

  async analyzeOpenAPISpec(openapiSpecJson: string): Promise<string> {
    try {
      const genAIinit = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY || 'AIzaSyDEkKvPUHRRcWVKmpu18_OTcnyfcLUI3Uc'
      );

      const schema: any = {
        type: SchemaType.OBJECT,
        properties: {
          analysis: {
            type: SchemaType.OBJECT,
            properties: {
              score: {
                type: SchemaType.INTEGER,
                description:
                  'Overall security score of (minimum 0 and maximum 10)',
              },
              formattingIssues: {
                type: SchemaType.ARRAY,
                description: 'List of formatting issues found',
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    line: { type: SchemaType.INTEGER },
                    suggestion: { type: SchemaType.STRING },
                  },
                },
              },
              owaspViolations: {
                type: SchemaType.ARRAY,
                description: 'OWASP API Top 10 violations',
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    category: { type: SchemaType.STRING },
                    occurrences: {
                      type: SchemaType.ARRAY,
                      items: {
                        type: SchemaType.OBJECT,
                        properties: {
                          line: { type: SchemaType.INTEGER },
                          suggestion: { type: SchemaType.STRING },
                        },
                      },
                    },
                  },
                },
              },
            },
            required: ['score', 'formattingIssues', 'owaspViolations'],
          },
        },
        required: ['analysis'],
      };

      const model = genAIinit.getGenerativeModel({
        model: 'gemini-2.0-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
        systemInstruction: `Always respond in English. Evaluate OpenAPI specifications with a lenient and practical approach based on real-world API security standards. Maintain JSON formatting as requested.

IMPORTANT GUIDELINES FOR EVALUATION:
1. SCOPE AWARENESS: An OpenAPI specification is primarily a documentation format that describes API endpoints, parameters, and responses - not the actual server implementation. Many security controls are implemented at the server level and cannot be fully verified through the OpenAPI spec alone.

2. LINE NUMBER PRECISION: You MUST identify the EXACT line number where each issue occurs. Be very precise - point to the specific property, parameter, or section where the issue exists, not just the general endpoint area.

3. LENIENT EVALUATION: Be generous in your assessment. Only report issues that would have a meaningful security impact. The goal is NOT to find as many issues as possible but to identify only those that matter.

4. MAXIMUM LIMIT: While you can report up to 25 issues maximum, you should aim to report significantly fewer in most cases. Only report the most impactful concerns.

5. CONSISTENT SCORING: The overall score MUST be directly proportional to the number of issues found:
   - 0-5 issues: Score should be 9-10
   - 6-10 issues: Score should be 8-9
   - 11-15 issues: Score should be 7-8
   - 16-20 issues: Score should be 6-7
   - 21-25 issues: Score should be 5-6

6. ASSUME GOOD IMPLEMENTATION: When specific security controls aren't explicitly mentioned in the OpenAPI spec, assume they are properly implemented at the server level unless there's strong evidence to the contrary.

7. HIGH THRESHOLD FOR ISSUES: Set a high bar for what constitutes a reportable security concern. Minor issues should be ignored entirely.

8. LINE NUMBERS: Always reference the precise line number where the issue appears or should be addressed. Be specific about which property, parameter, or definition contains the issue.

Remember, a good evaluation is not measured by how many issues you find, but by identifying the few truly significant security concerns that matter. Most APIs should receive relatively high scores with relatively few issues reported.`,
      });

      const parsedData = JSON.parse(openapiSpecJson);
      const formattedJson = JSON.stringify(parsedData, null, 2);
      const numberedJson = this.addLineNumbers(formattedJson);

      const prompt = `Evaluate the following OpenAPI Specification for security based on the OWASP API Security Top 10 (2023). 

      Your analysis should be:
      - Lenient and practical in approach
      - Realistic about the limitations of OpenAPI as documentation
      - Focused only on significant security issues (maximum 25 total, but aim for fewer)
      - Always referencing the correct **line number** for each issue identified
      - Consistently scored (higher scores with fewer issues)
      
      Here is the OpenAPI Specification with line numbers:
      \`\`\`
      ${numberedJson}
      \`\`\``;
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      return response;
    } catch (error) {
      throw new Error('Error processing OpenAPI Spec');
    }
  }
}
