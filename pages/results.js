import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Results() {
  const router = useRouter();
  const { url } = router.query;
  
  // States for analysis data and UI
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isIrrelevant, setIsIrrelevant] = useState(false);
  
  // States for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    claims: false,
    scientific: false,
    detailedGrades: false,
    methodology: false
  });

  // Toggle function for expandable sections
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  useEffect(() => {
    // Only run this effect when we have a URL from the query parameters
    if (!url) return;
    
    const fetchAnalysis = async () => {
      try {
        const decodedUrl = decodeURIComponent(url);
        
        // Call our API route to analyze the URL
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: decodedUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle specific error types
          if (errorData.type === 'IRRELEVANT_CONTENT') {
            setError(errorData.message);
            setIsIrrelevant(true);
          } else {
            throw new Error(errorData.message || 'Failed to analyze article');
          }
          return;
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [url]);

  // Redirect if no URL is provided
  if (!url && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  // Helper function to render rating dots
  const renderRatingDots = (grade) => {
    const gradeToNumber = {
      'A+': 5, 'A': 4.7, 'A-': 4.3,
      'B+': 4, 'B': 3.7, 'B-': 3.3,
      'C+': 3, 'C': 2.7, 'C-': 2.3,
      'D+': 2, 'D': 1.7, 'D-': 1.3,
      'F': 1
    };
    
    const score = gradeToNumber[grade] || 0;
    const fullDots = Math.floor(score / 1);
    const halfDot = score % 1 >= 0.3 && score % 1 < 0.7;
    const emptyDots = 5 - fullDots - (halfDot ? 1 : 0);
    
    return (
      <span className="rating-dots">
        {[...Array(fullDots)].map((_, i) => <span key={`full-${i}`} className="dot full">●</span>)}
        {halfDot && <span className="dot half">◐</span>}
        {[...Array(emptyDots)].map((_, i) => <span key={`empty-${i}`} className="dot empty">○</span>)}
      </span>
    );
  };

  return (
    <div className="container">
      <Head>
        <title>Analysis Results | Science News Analysis Tool</title>
        <meta name="description" content="Analysis results of science and health news" />
      </Head>

      <main>
        <h1>Analysis Results</h1>
        
        {loading && (
          <div className="loading-container">
            <p>Analyzing article...</p>
            <p>This may take a minute as we retrieve and analyze the content.</p>
            <div className="loading-animation">
              <div className="spinner"></div>
            </div>
          </div>
        )}
        
        {error && isIrrelevant && (
          <div className="error-container irrelevant-content">
            <h2>Not Analyzable Content</h2>
            <p>{error}</p>
            <p>This tool is designed to analyze science and health news articles. Examples of content that can be analyzed include:</p>
            <ul>
              <li>Health news from major media outlets</li>
              <li>Science reporting on recent studies</li>
              <li>Medical advice articles from health websites</li>
              <li>Nutrition and wellness articles</li>
            </ul>
            <Link href="/" className="button">
              Try Another Article
            </Link>
          </div>
        )}
        
        {error && !isIrrelevant && (
          <div className="error-container">
            <h2>Analysis Error</h2>
            <p>{error}</p>
            <Link href="/" className="button">
              Try Another Article
            </Link>
          </div>
        )}
        
        {analysis && (
          <div className="results-wrapper">
            {/* 1. Assessment Header */}
            <div className="assessment-header card">
              <h2>SCIENCE NEWS ASSESSMENT</h2>
              
              <div className="content-type">
                <span className="label">Content Type:</span>
                <span className="value">{analysis.contentType}</span>
              </div>
              
              <div className="grades">
                <div className="grade-row">
                  <span className="grade-label">Reporting Quality:</span>
                  <span className={`grade-value grade-${analysis.grades.reporting.toLowerCase()}`}>
                    {analysis.grades.reporting}
                  </span>
                  {renderRatingDots(analysis.grades.reporting)}
                </div>
                
                <div className="grade-row">
                  <span className="grade-label">Scientific Validity:</span>
                  <span className={`grade-value grade-${analysis.grades.scientific.toLowerCase()}`}>
                    {analysis.grades.scientific}
                  </span>
                  {renderRatingDots(analysis.grades.scientific)}
                </div>
                
                <div className="grade-row">
                  <span className="grade-label">Context & Completeness:</span>
                  <span className={`grade-value grade-${analysis.grades.context.toLowerCase()}`}>
                    {analysis.grades.context}
                  </span>
                  {renderRatingDots(analysis.grades.context)}
                </div>
              </div>
              
              <div className="summary">
                <p>{analysis.summary}</p>
              </div>
            </div>
            
            {/* 2. Source Information */}
            <div className="source-info card">
              <h2>SOURCE INFORMATION</h2>
              
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Publication:</span>
                  <span className="info-value">{analysis.source.publication}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Published:</span>
                  <span className="info-value">{analysis.source.date}</span>
                </div>
                
                {analysis.source.author && (
                  <div className="info-row">
                    <span className="info-label">Author:</span>
                    <span className="info-value">{analysis.source.author}</span>
                  </div>
                )}
                
                {analysis.source.researchPaper && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Research Source:</span>
                      <span className="info-value">{analysis.source.researchPaper}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">Paper Accessibility:</span>
                      <span className="info-value">{analysis.source.accessibility}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* 3. Key Takeaways */}
            <div className="key-takeaways card">
              <h2>KEY TAKEAWAYS</h2>
              
              <div className="takeaway">
                <h3>Bottom Line:</h3>
                <p>{analysis.takeaways.bottomLine}</p>
              </div>
              
              <div className="takeaway">
                <h3>Reality Check:</h3>
                <p>{analysis.takeaways.realityCheck}</p>
              </div>
              
              <div className="takeaway">
                <h3>Practical Relevance:</h3>
                <p>{analysis.takeaways.practicalRelevance}</p>
              </div>
            </div>
            
            {/* 4. Claims Assessment (Expandable) */}
            <div className="claims-assessment card">
              <h2 onClick={() => toggleSection('claims')} className="expandable">
                CLAIMS ASSESSMENT
                <span className="toggle-icon">
                  {expandedSections.claims ? '▼' : '▶'}
                </span>
              </h2>
              
              {expandedSections.claims && analysis.claims && (
                <div className="claims-content">
                  {analysis.claims.map((claim, index) => (
                    <div key={index} className={`claim claim-${claim.rating.toLowerCase().replace(' ', '-')}`}>
                      <p className="claim-text">"{claim.text}"</p>
                      <div className="claim-assessment">
                        <div className="assessment-row">
                          <span className="assessment-label">Rating:</span>
                          <span className="assessment-value">{claim.rating}</span>
                        </div>
                        <div className="assessment-row">
                          <span className="assessment-label">Evidence Quality:</span>
                          <span className="assessment-value">{claim.evidenceQuality}</span>
                        </div>
                      </div>
                      <p className="claim-explanation">{claim.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 5. Scientific Context (Expandable) */}
            <div className="scientific-context card">
              <h2 onClick={() => toggleSection('scientific')} className="expandable">
                SCIENTIFIC CONTEXT
                <span className="toggle-icon">
                  {expandedSections.scientific ? '▼' : '▶'}
                </span>
              </h2>
              
              {expandedSections.scientific && (
                <div className="context-content">
                  {analysis.scientific.researchSummary && (
                    <div className="context-section">
                      <h3>Research Summary:</h3>
                      <p>{analysis.scientific.researchSummary}</p>
                    </div>
                  )}
                  
                  <div className="context-section">
                    <h3>Scientific Consensus:</h3>
                    <p>{analysis.scientific.consensus}</p>
                  </div>
                  
                  {analysis.scientific.researchQuality && (
                    <div className="context-section">
                      <h3>Research Quality:</h3>
                      <ul className="research-quality-list">
                        <li>
                          <span className="quality-label">Study Design:</span>
                          <span className="quality-value">{analysis.scientific.researchQuality.design}</span>
                        </li>
                        <li>
                          <span className="quality-label">Sample Size:</span>
                          <span className="quality-value">{analysis.scientific.researchQuality.sampleSize}</span>
                        </li>
                        <li>
                          <span className="quality-label">Key Limitations:</span>
                          <span className="quality-value">{analysis.scientific.researchQuality.limitations}</span>
                        </li>
                        {analysis.scientific.researchQuality.conflicts && (
                          <li>
                            <span className="quality-label">Conflicts of Interest:</span>
                            <span className="quality-value">{analysis.scientific.researchQuality.conflicts}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="context-section">
                    <h3>Missing Context:</h3>
                    <p>{analysis.scientific.missingContext}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* 6. Detailed Grade Explanation (Expandable) */}
            <div className="detailed-grades card">
              <h2 onClick={() => toggleSection('detailedGrades')} className="expandable">
                DETAILED ASSESSMENT
                <span className="toggle-icon">
                  {expandedSections.detailedGrades ? '▼' : '▶'}
                </span>
              </h2>
              
              {expandedSections.detailedGrades && (
                <div className="detailed-grades-content">
                  <div className="grade-detail">
                    <h3>Reporting Quality: {analysis.grades.reporting}</h3>
                    <p>{analysis.detailedGrades.reporting}</p>
                  </div>
                  
                  <div className="grade-detail">
                    <h3>Scientific Validity: {analysis.grades.scientific}</h3>
                    <p>{analysis.detailedGrades.scientific}</p>
                  </div>
                  
                  <div className="grade-detail">
                    <h3>Context & Completeness: {analysis.grades.context}</h3>
                    <p>{analysis.detailedGrades.context}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* 7. Additional Resources */}
            <div className="additional-resources card">
              <h2>ADDITIONAL RESOURCES</h2>
              
              <ul className="resources-list">
                {analysis.resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                    {resource.description && <p className="resource-description">{resource.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 8. Analysis Methodology & Feedback */}
            <div className="analysis-methodology card">
              <h2 onClick={() => toggleSection('methodology')} className="expandable">
                ABOUT THIS ANALYSIS
                <span className="toggle-icon">
                  {expandedSections.methodology ? '▼' : '▶'}
                </span>
              </h2>
              
              {expandedSections.methodology && (
                <div className="methodology-content">
                  <p>
                    This analysis was conducted using a combination of AI-assisted evaluation 
                    and scientific knowledge accessed on {analysis.analysisDate}. The assessment 
                    evaluates the article based on reporting accuracy, scientific validity, 
                    and contextual completeness.
                  </p>
                  
                  <p>
                    <strong>Limitations:</strong> This analysis cannot substitute for professional 
                    medical advice. Scientific understanding evolves over time.
                  </p>
                  
                  <div className="feedback-section">
                    <p>Was this analysis helpful?</p>
                    <div className="feedback-buttons">
                      <button className="feedback-button">Yes, it was helpful</button>
                      <button className="feedback-button">No, it needs improvement</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="button-container">
              <Link href="/" className="button">
                Try Another Article
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>Science News Analysis Tool - Beta Version</p>
      </footer>
    </div>
  );
}