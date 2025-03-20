import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'screenshot'
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (activeTab === 'url') {
        // Validate URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          throw new Error('Please enter a valid URL starting with http:// or https://');
        }

        // Redirect to results page with URL as query parameter
        router.push({
          pathname: '/results',
          query: { url: encodeURIComponent(url), type: 'url' },
        });
      } else if (activeTab === 'screenshot' && imageFile) {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('screenshot', imageFile);
        
        // Here we would normally send the file to the server
        // But for now, we'll just redirect to the results page with a flag
        router.push({
          pathname: '/results',
          query: { imageId: 'temp-image-id', type: 'screenshot' },
        });
      } else {
        throw new Error('Please upload a screenshot image');
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setError(''); // Clear any previous errors
    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setExampleUrl = (exampleUrl) => {
    setUrl(exampleUrl);
    setActiveTab('url');
  };

  return (
    <div className="container">
      <Head>
        <title>Science News Analysis Tool</title>
        <meta name="description" content="Evaluate the scientific accuracy and reliability of science and health news" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <h1 className="main-title">Science News Analysis Tool</h1>
        <p className="intro-text">
          Evaluate the scientific accuracy and reliability of health and science content
        </p>
        
        <div className="form-container">
          <h2>Analyze Content</h2>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTab('url')}
            >
              URL Analysis
            </button>
            <button 
              className={`tab ${activeTab === 'screenshot' ? 'active' : ''}`}
              onClick={() => setActiveTab('screenshot')}
            >
              Screenshot Analysis
            </button>
          </div>
          
          {error && <p className="error">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'url' ? (
              <div className="url-input-container">
                <p>Enter the URL of a science or health article to evaluate its scientific validity:</p>
                <input 
                  type="url" 
                  placeholder="https://example.com/science-article" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required={activeTab === 'url'}
                />
              </div>
            ) : (
              <div className="screenshot-container">
                <p>Upload a screenshot of science or health content to analyze:</p>
                
                <input 
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                
                {!imagePreview ? (
                  <div className="upload-area" onClick={triggerFileInput}>
                    <div className="upload-prompt">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <p>Click to upload image or drag and drop</p>
                      <p className="upload-hint">Supports: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button type="button" className="clear-image" onClick={clearImage}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
            
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
        
        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 4px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        
        .upload-area:hover {
          border-color: #0070f3;
        }
        
        .upload-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #555;
        }
        
        .upload-hint {
          font-size: 0.8rem;
          color: #888;
        }
        
        .image-preview-container {
          position: relative;
          margin-bottom: 1rem;
        }
        
        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 4px;
          display: block;
          margin: 0 auto;
        }
        
        .clear-image {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          padding: 0;
        }
        
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