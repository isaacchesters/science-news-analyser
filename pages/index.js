import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Science News Analysis Tool</title>
        <meta name="description" content="Analyze the quality of science and health news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Science News Analysis Tool</h1>
        <p>A tool to assess the quality of science and health news.</p>
        
        <div className="form-container">
          <h2>Analyze an Article</h2>
          <p>Enter the URL of a science or health news article to analyze:</p>
          <form>
            <input 
              type="url" 
              placeholder="https://example.com/science-article" 
              required
            />
            <button type="submit">Analyze</button>
          </form>
        </div>
      </main>

      <footer>
        <p>Science News Analysis Tool - Beta Version</p>
      </footer>
    </div>
  );
}
