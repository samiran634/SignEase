import React, { useState } from 'react';

const HighlightPDF = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing...');

    const pdfFile = e.target.pdfFile.files[0];
    const sentencesText = e.target.sentences.value;

    // Split sentences, removing empty lines
    const sentences = sentencesText.split('\n').filter((s) => s.trim() !== '');

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('sentences', JSON.stringify(sentences));

    try {
      const response = await fetch('https://test-production-3826.up.railway.app/highlight-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'highlighted.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setStatus('PDF downloaded successfully!');
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Highlight PDF</h1>
      <form id="highlightForm" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pdfFile" className="block text-sm font-medium mb-1">PDF File:</label>
          <input
            type="file"
            id="pdfFile"
            name="pdfFile"
            accept="application/pdf"
            className="block w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="sentences" className="block text-sm font-medium mb-1">Sentences (one per line):</label>
          <textarea
            id="sentences"
            name="sentences"
            rows="5"
            className="block w-full border rounded p-2"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Highlight PDF
        </button>
      </form>
      {status && <div id="status" className="mt-4 text-sm font-medium text-gray-700">{status}</div>}
    </div>
  );
};

export default HighlightPDF;
