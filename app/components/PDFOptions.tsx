// app/components/PDFOptions.tsx
'use client';

import { useState, useEffect } from 'react';

interface PDFOptionsProps {
  onPrint: () => void;
  onDownloadPDF: () => void;
  onShare?: () => void;
  isDownloading: boolean;
}

export default function PDFOptions({ onPrint, onDownloadPDF, onShare, isDownloading }: PDFOptionsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if running on client
    if (typeof window !== 'undefined') {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      setCanShare(!!navigator.share);
    }
  }, []);

  return (
    <div className="pdf-options-bar">
      <div className="options-header">
        <i className="fas fa-download"></i> Export Options
      </div>
      <div className="options-buttons">
        <button className="option-btn print-btn" onClick={onPrint}>
          <i className="fas fa-print"></i> Print / Save as PDF
        </button>
        <button className="option-btn pdf-btn" onClick={onDownloadPDF} disabled={isDownloading}>
          <i className="fas fa-file-pdf"></i> Download PDF
        </button>
        {canShare && onShare && (
          <button className="option-btn share-btn" onClick={onShare} disabled={isDownloading}>
            <i className="fas fa-share-alt"></i> Share PDF
          </button>
        )}
      </div>
      {isMobile && (
        <div className="mobile-tip">
          <i className="fas fa-info-circle"></i> 
          PDF generation may take 5-10 seconds on mobile
        </div>
      )}
    </div>
  );
}