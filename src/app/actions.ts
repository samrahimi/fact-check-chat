import { NextApiRequest, NextApiResponse } from 'next'
const data: Data = {
    "stories": [
      {
        "headline": "Trump Allies Hope Debate Will Turn the Page from Harris' 'Honeymoon'",
        "topic": "2024 Election",
        "questions": [
          "What specific aspects of Harris' performance are Trump allies concerned about?",
          "What strategies might Trump employ in the debate to regain a competitive footing?",
          "How much influence does media coverage have on voters' perceptions of candidates, particularly during the early stages of a campaign?"
        ]
      },
      {
        "headline": "Speaker Johnson's Government Funding Strategy on Life Support as Defections Mount",
        "topic": "US Politics & Government",
        "questions": [
          "What specific defections are threatening Speaker Johnson's government funding strategy?",
          "What are the potential consequences of a government shutdown, especially so close to the election?",
          "What alternative strategies might be considered to avoid a shutdown?"
        ]
      },
      {
        "headline": "Trump Repeats False Claims That Children Are Undergoing Transgender Surgeries During School Day",
        "topic": "Transgender Issues & Politics",
        "questions": [
          "What is the source of Trump's claim, and has it been debunked by fact-checkers?",
          "What is the potential impact of repeating false claims about transgender children and their families?",
          "How might this rhetoric further escalate political tensions surrounding transgender issues?"
        ]
      },
      {
        "headline": "Harris and Trump Battle to Be the 'Change' Candidate",
        "topic": "2024 Election",
        "questions": [
          "How are Harris and Trump defining \"change\" in their respective campaigns?",
          "What specific policies are they emphasizing to appeal to voters seeking change?",
          "How credible are their claims of being agents of change, given their past records?"
        ]
      },
      {
        "headline": "Trump Vows to Prosecute Political Foes and Others He Says Are 'Corrupt' if He Wins",
        "topic": "2024 Election & Justice System",
        "questions": [
          "What specific allegations of corruption is Trump making against his political opponents?",
          "What legal mechanisms could Trump potentially use to prosecute his political foes?",
          "What are the potential implications for the rule of law and democratic norms if Trump pursues these prosecutions?"
        ]
      },
      {
        "headline": "Venezuela's Election Crisis Shows Limits of U.S. Administrations Over Roots of Migration",
        "topic": "US Foreign Policy & Migration",
        "questions": [
          "How has the U.S. approach to Venezuela under both Trump and Biden administrations impacted the migration crisis?",
          "What are the root causes of migration from Venezuela, and how effective are sanctions in addressing them?",
          "What alternative strategies could the U.S. consider to address the Venezuelan crisis and its impact on migration?"
        ]
      },
      {
        "headline": "U.S. Expects Thorough and Transparent Israeli Probe into American's Killing",
        "topic": "US Foreign Policy & Middle East",
        "questions": [
          "What are the circumstances surrounding the killing of the American in the occupied West Bank?",
          "What specific steps does the U.S. expect Israel to take to ensure a thorough and transparent investigation?",
          "How might this incident impact the relationship between the U.S. and Israel?"
        ]
      },
      {
        "headline": "Ohio Police Have 'No Credible Reports' of Haitian Immigrants Harming Pets",
        "topic": "Immigration & Misinformation",
        "questions": [
          "What was the specific claim made by JD Vance about Haitian immigrants harming pets?",
          "What evidence did Ohio police cite to refute Vance's claim?",
          "What are the potential consequences of spreading misinformation about immigrant communities?"
        ]
      },
      {
        "headline": "Trump's Remarks on Chevron Doctrine Termination and Healthcare Policies",
        "topic": "Healthcare & Politics",
        "questions": [
          "What is the Chevron doctrine, and how might its termination impact healthcare policies?",
          "What specific healthcare policies could be affected by the Supreme Court's decision?",
          "What are Trump's stated views on the Chevron doctrine and its potential impact on healthcare?"
        ]
      },
      {
        "headline": "Close Electoral Contest Against Donald Trump Revealed in Internal Data",
        "topic": "2024 Election",
        "questions": [
          "What specific internal data suggests a close electoral contest against Trump?",
          "What factors are contributing to the competitiveness of the election?",
          "What are the potential implications of a close election for the political landscape?"
        ]
      }
    ]
  }
 export const getRandomQuestions = async(count: number) => {
    const allQuestions = data.stories.flatMap(story => 
      story.questions.map(question => ({ question, topic: story.topic }))
    )
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }


export const getStreamingAnswer = async (req: NextApiRequest, res: NextApiResponse) => {
    const exampleContent= `
# Fact-Checking Results

## Claim: [User's claim]

### Summary
[Brief summary of the fact-check]

### Key Points
- Point 1
- Point 2
- Point 3

### Evidence
1. [Source 1](https://example.com)
   - Relevant quote or information
2. [Source 2](https://example.com)
   - Relevant quote or information

### Expert Opinion
> "Expert quote" - Expert Name, Credentials

### Conclusion
[Final verdict on the claim]

---

For more information, please visit our [fact-checking methodology](https://example.com).

\`\`\`
This is a code block
It can contain multiple lines
\`\`\`

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |

- [ ] Unchecked task
- [x] Checked task

~~Strikethrough text~~
`

    // return the response 1 line at a time, with a 50ms delay after each line
    const lines = exampleContent.split('\n')
    for (const line of lines) {
      await new Promise(resolve => setTimeout(resolve, 50))
      res.write(line + '\n')
    }
}
export const fetchData = async () => {
  return {
    message: "Hello from the server!"
  }
}
