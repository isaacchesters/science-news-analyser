import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      // Redirect to results page with URL as query parameter
      router.push({
        pathname: '/results',
        query: { url: encodeURIComponent(url) },
      });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const setExampleUrl = (exampleUrl) => {
    setUrl(exampleUrl);
  };

  return (
    <div className="container">
      <Head>
        <title>Science News Analysis Tool</title>
        <meta name="description" content="Evaluate the scientific accuracy and reliability of science and health news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Science News Analysis Tool</h1>
        <p className="intro-text">
          Evaluate the scientific accuracy and reliability of health and science content
        </p>
        
        <div className="form-container">
          <h2>Analyze an Article</h2>
          <p>Enter the URL of a science or health article to evaluate its scientific validity:</p>
          
          {error && <p className="error">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <input 
              type="url" 
              placeholder="https://example.com/science-article" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </div>
        
        <div className="features-section">
          <h2>What This Tool Evaluates</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Scientific Validity</h3>
              <p>We assess how well the article represents scientific evidence and findings</p>
            </div>
            <div className="feature">
              <h3>Research Evidence</h3>
              <p>We examine the quality and relevance of research cited in the article</p>
            </div>
            <div className="feature">
              <h3>Article Accuracy</h3>
              <p>We evaluate how accurately the article presents scientific information</p>
            </div>
            <div className="feature">
              <h3>Context & Completeness</h3>
              <p>We check if important scientific context is provided or omitted</p>
            </div>
          </div>
        </div>
        
        <div className="example-urls">
          <h3>Example Articles You Can Analyze:</h3>
          <ul>
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setExampleUrl('https://www.healthline.com/nutrition/intermittent-fasting-guide');
              }}>
                Healthline: Intermittent Fasting Guide and Review
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setExampleUrl('https://www.sciencedaily.com/releases/2023/01/230120104437.htm');
              }}>
                ScienceDaily: New Research on Gut Bacteria and Mental Health
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setExampleUrl('https://www.scientificamerican.com/article/are-we-living-in-a-computer-simulation/');
              }}>
                Scientific American: Are We Living in a Computer Simulation?
              </a>
            </li>
          </ul>
        </div>
      </main>

      <footer>
        <p>Science News Analysis Tool - Beta Version</p>
      </footer>

      <style jsx>{`
        .intro-text {
          text-align: center;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 2rem auto;
          color: #444;
        }
        
        .features-section {
          width: 100%;
          max-width: 800px;
          margin: 3rem 0;
          text-align: center;
        }
        
        .features-section h2 {
          margin-bottom: 1.5rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: 1.5rem;
        }
        
        .feature {
          background-color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }
        
        .feature h3 {
          margin-top: 0;
          color: #0070f3;
        }
        
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}