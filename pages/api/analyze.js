// This is a mock API endpoint for development
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: 'URL is required' });
      }
  
      // Simple validation to check if this is a valid URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).json({ 
          message: 'Please enter a valid URL starting with http:// or https://' 
        });
      }
  
      // Check for non-relevant content based on URL patterns (simplified example)
      const nonRelevantPatterns = ['amazon.com', 'ebay.com', 'facebook.com', 'instagram.com'];
      if (nonRelevantPatterns.some(pattern => url.includes(pattern))) {
        return res.status(400).json({
          message: 'The provided URL does not appear to contain science or health content that can be analyzed.',
          type: 'IRRELEVANT_CONTENT'
        });
      }
  
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
  
      // Return mock analysis data
      const mockAnalysis = {
        contentType: 'Research Report',
        
        grades: {
          reporting: 'A-',
          scientific: 'C',
          context: 'B+'
        },
        
        summary: 'Accurate reporting of a study with significant methodological limitations and good contextual information.',
        
        source: {
          publication: 'Health News Daily',
          date: 'March 5, 2025',
          author: 'Jane Smith, Health Correspondent',
          researchPaper: 'Johnson et al. (2024). Effects of intermittent fasting on metabolic health markers. Journal of Nutrition, 45(3), 112-128.',
          accessibility: 'Paywalled'
        },
        
        takeaways: {
          bottomLine: 'The study found modest benefits of intermittent fasting for some metabolic markers in a small group of participants, but these results should be considered preliminary and may not apply to the general population.',
          realityCheck: 'While the article accurately reports the findings, the research is limited by its small sample size, short duration, and lack of diversity among participants. The benefits, while statistically significant, were relatively modest in magnitude.',
          practicalRelevance: 'For individuals considering intermittent fasting, this research does not provide strong evidence either for or against the practice. The reported benefits were specific to certain metabolic markers and may not translate to meaningful health outcomes.'
        },
        
        claims: [
          {
            text: 'Intermittent fasting reduced insulin resistance by 22% in study participants',
            rating: 'Accurately Reported',
            evidenceQuality: 'Moderate',
            explanation: 'The study did indeed find a 22% average reduction in HOMA-IR scores (a measure of insulin resistance) among participants. However, the study was small and short-term.'
          },
          {
            text: 'Scientists say intermittent fasting is effective for weight loss',
            rating: 'Partially Accurate',
            evidenceQuality: 'Moderate',
            explanation: 'The study found modest weight loss (average 2.1 kg) over 8 weeks, but the article overgeneralizes by implying scientific consensus when this is just one small study.'
          },
          {
            text: 'The benefits occurred regardless of what participants ate during feeding windows',
            rating: 'Misleading',
            evidenceQuality: 'Weak',
            explanation: 'The study controlled for diet quality and caloric intake, so this claim contradicts the study methodology. Participants were instructed to maintain a specific diet quality during feeding windows.'
          }
        ],
        
        scientific: {
          researchSummary: 'This was an 8-week randomized controlled trial with 36 participants (21 women, 15 men) comparing 16:8 intermittent fasting to a regular meal schedule. Both groups consumed similar total calories. The fasting group showed statistically significant but modest improvements in insulin sensitivity, blood pressure, and some inflammatory markers.',
          consensus: 'The broader scientific literature on intermittent fasting shows mixed results. Some studies support modest benefits for metabolic health, while others show little difference compared to regular caloric restriction. There is not yet scientific consensus on whether intermittent fasting offers unique benefits beyond other approaches to healthy eating.',
          researchQuality: {
            design: 'Randomized controlled trial (moderate quality)',
            sampleSize: '36 participants (small)',
            limitations: 'Small sample size, short duration (8 weeks), homogeneous population (mostly young, healthy adults), reliance on self-reported adherence',
            conflicts: 'Study funded by a nutrition supplement company with commercial interest in fasting products'
          },
          missingContext: 'The article doesn\'t mention that several larger studies have failed to find significant differences between intermittent fasting and regular caloric restriction for weight loss or metabolic health when calorie intake is controlled. It also doesn\'t mention potential risks for certain populations.'
        },
        
        detailedGrades: {
          reporting: 'The article accurately reports most of the study findings, including the primary outcomes and basic methodology. The statistics are correctly cited, and the article does mention the small sample size. However, it slightly overstates the certainty of the findings and uses somewhat sensationalist language in the headline.',
          scientific: 'The underlying research has significant limitations that affect its reliability. The small sample size (n=36), short duration (8 weeks), and potential conflicts of interest in funding sources reduce confidence in the findings. The study design is reasonable (randomized controlled trial), but several methodological issues limit the strength of conclusions that can be drawn.',
          context: 'The article provides good background on intermittent fasting and mentions some previous research. It includes quotes from two independent experts who provide some additional context. However, it doesn\'t adequately address the mixed evidence in the broader literature or discuss potential risks for certain populations.'
        },
        
        resources: [
          {
            title: 'Original Research Paper (Paywalled)',
            url: 'https://example.com/journal-nutrition/article-12345',
            description: 'The original research study discussed in the article'
          },
          {
            title: 'NIH Overview of Intermittent Fasting Research',
            url: 'https://example.com/nih-intermittent-fasting',
            description: 'Comprehensive review of the current evidence on intermittent fasting'
          },
          {
            title: 'American Heart Association: Healthy Eating Patterns',
            url: 'https://example.com/aha-eating-patterns',
            description: 'Evidence-based guidelines on various eating patterns for cardiovascular health'
          }
        ],
        
        analysisDate: 'March 8, 2025'
      };
  
      res.status(200).json(mockAnalysis);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ message: 'Error analyzing the article', error: error.message });
    }
  }