import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Results() {
  const router = useRouter();
  const { url, type, imageId } = router.query;
  
  // States for analysis data and UI
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isIrrelevant, setIsIrrelevant] = useState(false);
  const [analysisSource, setAnalysisSource] = useState('url'); // 'url' or 'screenshot'
  
  // States for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    claims: false,
    scientific: false,
    resources: false,
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
    // Determine if we're analyzing a URL or a screenshot
    if (type === 'screenshot') {
      setAnalysisSource('screenshot');
    } else {
      setAnalysisSource('url');
    }
  }, [type]);

  useEffect(() => {
    // Only run this effect when we have query parameters
    if (!router.isReady) return;
    
    const fetchAnalysis = async () => {
      try {
        // Different handling based on analysis type
        if (analysisSource === 'url' && url) {
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
        } 
        else if (analysisSource === 'screenshot' && imageId) {
          // For now, we'll use the mock API to simulate screenshot analysis
          // In a real implementation, you would upload the image from the home page
          // and get a real image ID
          
          const response = await fetch('/api/analyze-screenshot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to analyze screenshot');
          }

          const data = await response.json();
          setAnalysis(data);
        }
        else {
          throw new Error('Invalid analysis request');
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [router.isReady, url, imageId, analysisSource]);

  // Redirect if no valid parameters are provided
  if (router.isReady && !url && !imageId && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  // Helper function to get grade color class
  const getGradeColorClass = (grade) => {
    if (!grade) return '';
    
    const firstChar = grade.charAt(0).toLowerCase();
    if (firstChar === 'a') return 'grade-a';
    if (firstChar === 'b') return 'grade-b';
    if (firstChar === 'c') return 'grade-c';
    if (firstChar === 'd' || firstChar === 'f') return 'grade-f';
    return '';
  };

  // Helper function to render rating dots
  const renderRatingDots = (grade) => {
    if (!grade) return null;
    
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

  // Helper function to render research sources based on type
  const renderResearchSources = (source) => {
    if (!source) return null;

    if (source.researchType === 'singleStudy' && source.researchPaper) {
      return (
        <>
          <div className="info-row">
            <span className="info-label">Research Source:</span>
            <span className="info-value">{source.researchPaper.citation}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Paper Accessibility:</span>
            <span className="info-value">{source.researchPaper.accessibility}</span>
          </div>
        </>
      );
    }
    
    if (source.researchType === 'multipleStudies' && source.researchPapers) {
      return (
        <div className="info-row">
          <span className="info-label">Research Sources:</span>
          <span className="info-value">
            Multiple Research Sources ({source.researchCount})
            <button 
              className="view-sources-btn"
              onClick={() => toggleSection('sources')}
            >
              {expandedSections.sources ? 'Hide Sources' : 'View Sources'}
            </button>
            
            {expandedSections.sources && (
              <ul className="research-papers-list">
                {source.researchPapers.map((paper, index) => (
                  <li key={index}>
                    <div>{paper.citation}</div>
                    <div className="paper-access">
                      Accessibility: {paper.accessibility}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </span>
        </div>
      );
    }
    
    if (source.researchType === 'noSpecificResearch') {
      return (
        <div className="info-row">
          <span className="info-label">Research Sources:</span>
          <span className="info-value no-research">
            No specific research cited
            <div className="content-basis">{source.contentBasis}</div>
          </span>
        </div>
      );
    }
    
    return null;
  };

  // Helper function to render scientific context based on research type
  const renderScientificContext = (context) => {
    if (!context) return null;

    if (context.researchType === 'singleStudy') {
      return (
        <>
          <div className="context-section">
            <h3>Research Summary:</h3>
            <p>{context.researchSummary}</p>
          </div>
          <div className="context-section">
            <h3>Study Limitations:</h3>
            <p>{context.limitations}</p>
          </div>
          {context.conflicts && (
            <div className="context-section">
              <h3>Conflicts of Interest:</h3>
              <p>{context.conflicts}</p>
            </div>
          )}
        </>
      );
    }
    
    if (context.researchType === 'multipleStudies') {
      return (
        <>
          <div className="context-section">
            <h3>Scientific Consensus:</h3>
            <p>{context.consensusStatement}</p>
          </div>
          <div className="context-section">
            <h3>Strength of Evidence:</h3>
            <p>{context.strengthOfEvidence}</p>
          </div>
          <div className="context-section">
            <h3>Areas of Uncertainty:</h3>
            <p>{context.areasOfUncertainty}</p>
          </div>
        </>
      );
    }
    
    if (context.researchType === 'noSpecificResearch') {
      return (
        <>
          <div className="context-section">
            <h3>Field Summary:</h3>
            <p>{context.fieldSummary}</p>
          </div>
          <div className="context-section">
            <h3>Current State of Knowledge:</h3>
            <p>{context.stateOfKnowledge}</p>
          </div>
          <div className="context-section">
            <h3>Limitations of This Analysis:</h3>
            <p>{context.limitations}</p>
          </div>
        </>
      );
    }
    
    return null;
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
            <p>Analyzing {analysisSource === 'url' ? 'article' : 'screenshot'}...</p>
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
            {/* For screenshot analysis, show the extracted text */}
            {analysisSource === 'screenshot' && analysis.extractedText && (
              <div className="extracted-text card">
                <h2>EXTRACTED TEXT</h2>
                <div className="text-content">
                  <p>{analysis.extractedText}</p>
                </div>
              </div>
            )}
            
            {/* 1. Assessment Header */}
            <div className="assessment-header card">
              <div className="content-type">
                <span className="label">Content Type:</span>
                <span className="value">{analysis.contentType}</span>
              </div>
              
              <div className="scientific-validity">
                <h2>SCIENTIFIC VALIDITY</h2>
                <div className={`validity-grade ${getGradeColorClass(analysis.scientificValidity.grade)}`}>
                  <span className="grade">{analysis.scientificValidity.grade}</span>
                  <span className="label">{analysis.scientificValidity.label}</span>
                </div>
                <div className="validity-explanation">
                  <p>{analysis.scientificValidity.explanation}</p>
                </div>
              </div>
              
              <div className="grade-components">
                <h3>ASSESSMENT COMPONENTS</h3>
                
                <div className="component">
                  <div className="component-header">
                    <span className="component-name">Research Evidence</span>
                    <span className={`component-grade ${getGradeColorClass(analysis.gradeComponents.researchEvidence.grade)}`}>
                      {analysis.gradeComponents.researchEvidence.grade}
                    </span>
                    {renderRatingDots(analysis.gradeComponents.researchEvidence.grade)}
                  </div>
                  <p className="component-explanation">{analysis.gradeComponents.researchEvidence.explanation}</p>
                </div>
                
                <div className="component">
                  <div className="component-header">
                    <span className="component-name">Article Accuracy</span>
                    <span className={`component-grade ${getGradeColorClass(analysis.gradeComponents.articleAccuracy.grade)}`}>
                      {analysis.gradeComponents.articleAccuracy.grade}
                    </span>
                    {renderRatingDots(analysis.gradeComponents.articleAccuracy.grade)}
                  </div>
                  <p className="component-explanation">{analysis.gradeComponents.articleAccuracy.explanation}</p>
                </div>
                
                <div className="component">
                  <div className="component-header">
                    <span className="component-name">Broader Context</span>
                    <span className={`component-grade ${getGradeColorClass(analysis.gradeComponents.broaderContext.grade)}`}>
                      {analysis.gradeComponents.broaderContext.grade}
                    </span>
                    {renderRatingDots(analysis.gradeComponents.broaderContext.grade)}
                  </div>
                  <p className="component-explanation">{analysis.gradeComponents.broaderContext.explanation}</p>
                </div>
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
                
                {renderResearchSources(analysis.source)}
              </div>
            </div>
            
            {/* 3. Key Takeaways */}
            <div className="key-takeaways card">
              <h2>KEY TAKEAWAYS</h2>
              
              <div className="takeaway">
                <h3>Bottom Line:</h3>
                <p>{analysis.keyTakeaways.bottomLine}</p>
              </div>
              
              <div className="takeaway">
                <h3>Context for Readers:</h3>
                <p>{analysis.keyTakeaways.contextForReaders}</p>
              </div>
              
              <div className="takeaway">
                <h3>Practical Significance:</h3>
                <p>{analysis.keyTakeaways.practicalSignificance}</p>
              </div>
            </div>
            
            {/* 4. Claims Assessment (Expandable) */}
            {analysis.claims && analysis.claims.length > 0 && (
              <div className="claims-assessment card">
                <h2 onClick={() => toggleSection('claims')} className="expandable">
                  CLAIMS ASSESSMENT
                  <span className="toggle-icon">
                    {expandedSections.claims ? '▼' : '▶'}
                  </span>
                </h2>
                
                {expandedSections.claims && (
                  <div className="claims-content">
                    {analysis.claims.map((claim, index) => {
                      // Determine claim class based on rating
                      let claimClass = 'claim-default';
                      const rating = claim.rating.toLowerCase().replace(/\s+/g, '-');
                      if (rating.includes('accurate')) claimClass = 'claim-accurate';
                      else if (rating.includes('partially')) claimClass = 'claim-partial';
                      else if (rating.includes('misleading')) claimClass = 'claim-misleading';
                      else if (rating.includes('unsupported') || rating.includes('incorrect')) claimClass = 'claim-unsupported';
                      
                      return (
                        <div key={index} className={`claim ${claimClass}`}>
                          <p className="claim-text">"{claim.text}"</p>
                          <div className="claim-assessment">
                            <div className="assessment-row">
                              <span className="assessment-label">Rating:</span>
                              <span className="assessment-value">{claim.rating}</span>
                            </div>
                          </div>
                          <p className="claim-explanation">{claim.explanation}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* 5. Scientific Context (Expandable) */}
            {analysis.scientificContext && (
              <div className="scientific-context card">
                <h2 onClick={() => toggleSection('scientific')} className="expandable">
                  SCIENTIFIC CONTEXT
                  <span className="toggle-icon">
                    {expandedSections.scientific ? '▼' : '▶'}
                  </span>
                </h2>
                
                {expandedSections.scientific && (
                  <div className="context-content">
                    {renderScientificContext(analysis.scientificContext)}
                  </div>
                )}
              </div>
            )}
            
            {/* 6. Additional Resources */}
            {analysis.additionalResources && analysis.additionalResources.length > 0 && (
              <div className="additional-resources card">
                <h2 onClick={() => toggleSection('resources')} className="expandable">
                  ADDITIONAL RESOURCES
                  <span className="toggle-icon">
                    {expandedSections.resources ? '▼' : '▶'}
                  </span>
                </h2>
                
                {expandedSections.resources && (
                  <ul className="resources-list">
                    {analysis.additionalResources.map((resource, index) => (
                      <li key={index}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.title}
                        </a>
                        {resource.description && <p className="resource-description">{resource.description}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* 7. Analysis Methodology & Feedback */}
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
                    evaluates the {analysisSource === 'url' ? 'article' : 'content'} based on scientific 
                    validity, evidence quality, and contextual completeness.
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

      <style jsx>{`
        .extracted-text {
          margin-bottom: 1rem;
        }
        
        .text-content {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          border-left: 4px solid #0070f3;
          font-style: italic;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #ddd;
        }
        
        .tab {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #555;
          transition: all 0.2s;
        }
        
        .tab.active {
          color: #0070f3;
          border-bottom: 3px solid #0070f3;
        }
        
        .tab:hover:not(.active) {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}