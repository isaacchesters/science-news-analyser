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
        <meta name="description" content="Analyze the quality of science and health news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Science News Analysis Tool</h1>
        <p>Evaluate the accuracy and reliability of science and health news articles.</p>
        
        <div className="form-container">
          <h2>Analyze an Article</h2>
          <p>Enter the URL of a science or health news article to analyze:</p>
          
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
    </div>
  );
}