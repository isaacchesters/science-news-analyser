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

    // Return mock analysis data with our new structure
    const mockAnalysis = {
      contentType: 'Research Report',
      
      scientificValidity: {
        grade: 'B',
        label: 'Generally Reliable',
        explanation: 'This article accurately reports many findings from a legitimate study, but lacks important context and doesn\'t address key limitations of the research.'
      },
      
      gradeComponents: {
        researchEvidence: {
          grade: 'C+',
          explanation: 'Based on legitimate peer-reviewed research, but the study has methodological limitations including small sample size and short duration.'
        },
        articleAccuracy: {
          grade: 'B+',
          explanation: 'The article mostly represents the research findings correctly, with minor overstatements about the certainty of conclusions.'
        },
        broaderContext: {
          grade: 'C',
          explanation: 'Fails to mention contradictory findings from larger studies and doesn\'t place the findings within the broader scientific consensus.'
        }
      },
      
      source: {
        publication: 'Health News Daily',
        date: 'March 5, 2025',
        author: 'Jane Smith, Health Correspondent',
        researchType: 'singleStudy',
        researchPaper: {
          citation: 'Johnson et al. (2024). Effects of intermittent fasting on metabolic health markers. Journal of Nutrition, 45(3), 112-128.',
          doi: '10.1234/nutr.2024.12345',
          accessibility: 'Paywalled'
        }
      },
      
      // Alternate source example for multiple studies
      // source: {
      //   publication: 'Health News Daily',
      //   date: 'March 5, 2025',
      //   author: 'Jane Smith, Health Correspondent',
      //   researchType: 'multipleStudies',
      //   researchCount: 3,
      //   researchPapers: [
      //     {
      //       citation: 'Johnson et al. (2024). Effects of intermittent fasting on metabolic health markers. Journal of Nutrition, 45(3), 112-128.',
      //       doi: '10.1234/nutr.2024.12345',
      //       accessibility: 'Paywalled'
      //     },
      //     {
      //       citation: 'Williams et al. (2023). Comparison of fasting protocols on weight loss outcomes. Obesity Research, 31(2), 45-52.',
      //       doi: '10.5678/obesity.2023.67890',
      //       accessibility: 'Open Access'
      //     },
      //     {
      //       citation: 'Garcia et al. (2022). Long-term metabolic effects of intermittent fasting: a longitudinal study. Metabolism, 88, 102-114.',
      //       doi: '10.9101/metab.2022.11213',
      //       accessibility: 'Paywalled'
      //     }
      //   ]
      // },
      
      // Alternate source example for no specific research
      // source: {
      //   publication: 'Health News Daily',
      //   date: 'March 5, 2025',
      //   author: 'Jane Smith, Health Correspondent',
      //   researchType: 'noSpecificResearch',
      //   contentBasis: 'General information and expert opinions without citation of specific research studies.'
      // },
      
      keyTakeaways: {
        bottomLine: 'Intermittent fasting may offer modest benefits for metabolic health in some individuals, but these effects are relatively small and may not be superior to other approaches to healthy eating.',
        contextForReaders: 'The broader scientific literature on intermittent fasting shows mixed results, with some studies showing benefits while others find no advantage over simple caloric restriction. Results vary significantly between individuals.',
        practicalSignificance: 'For those interested in intermittent fasting, it appears to be safe for most healthy adults and may help with weight management, but it\'s not clearly superior to other approaches to healthy eating patterns.'
      },
      
      claims: [
        {
          text: 'Intermittent fasting reduced insulin resistance by 22% in study participants',
          rating: 'Accurately Reported',
          explanation: 'The study did indeed find a 22% average reduction in HOMA-IR scores (a measure of insulin resistance) among participants. This specific statistic is correctly cited.'
        },
        {
          text: 'Scientists say intermittent fasting is effective for weight loss',
          rating: 'Partially Accurate',
          explanation: 'The study found modest weight loss (average 2.1 kg) over 8 weeks, but the article overgeneralizes by implying scientific consensus when this is just one small study among many with mixed results.'
        },
        {
          text: 'The benefits occurred regardless of what participants ate during feeding windows',
          rating: 'Misleading',
          explanation: 'The study controlled for diet quality and caloric intake, so this claim contradicts the study methodology. Participants were instructed to maintain a specific diet quality during feeding windows.'
        }
      ],
      
      scientificContext: {
        researchType: 'singleStudy',
        researchSummary: 'This was an 8-week randomized controlled trial with 36 participants (21 women, 15 men) comparing 16:8 intermittent fasting to a regular meal schedule. Both groups consumed similar total calories. The fasting group showed statistically significant but modest improvements in insulin sensitivity, blood pressure, and some inflammatory markers.',
        limitations: 'Small sample size (36 participants), short duration (8 weeks), homogeneous population (mostly young, healthy adults), reliance on self-reported adherence.',
        conflicts: 'Study funded by a nutrition supplement company with commercial interest in fasting products.'
      },
      
      // Alternate scientific context for multiple studies
      // scientificContext: {
      //   researchType: 'multipleStudies',
      //   consensusStatement: 'Research on intermittent fasting shows mixed but generally modest benefits for metabolic health markers. Most studies show similar outcomes to caloric restriction regardless of timing.',
      //   strengthOfEvidence: 'Moderate quality evidence exists from multiple small to medium-sized randomized controlled trials with varying protocols and durations.',
      //   areasOfUncertainty: 'Long-term adherence, effects on different populations (elderly, those with chronic conditions), and optimal fasting protocols remain unclear.'
      // },
      
      // Alternate scientific context for no specific research
      // scientificContext: {
      //   researchType: 'noSpecificResearch',
      //   fieldSummary: 'Intermittent fasting has been studied in dozens of clinical trials over the past decade with varying protocols and outcomes. The general scientific consensus suggests modest benefits comparable to other forms of caloric restriction.',
      //   stateOfKnowledge: 'Current knowledge suggests that timing of food intake may have metabolic effects independent of caloric content, but the magnitude of these effects is generally small in most populations.',
      //   limitations: 'Without specific research citations, this article provides general information that may not reflect the latest research findings or important nuances in the scientific literature.'
      // },
      
      additionalResources: [
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