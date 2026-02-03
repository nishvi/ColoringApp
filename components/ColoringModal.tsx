
import React, { useState } from 'react';
import { ColoringPage } from '../types';
import { Button } from './Button';
import { colorLineArt } from '../services/geminiService';

interface ColoringModalProps {
  page: ColoringPage;
  onClose: () => void;
  onUpdate: (updated: ColoringPage) => void;
}

export const ColoringModal: React.FC<ColoringModalProps> = ({ page, onClose, onUpdate }) => {
  const [isColoring, setIsColoring] = useState(false);
  const [viewMode, setViewMode] = useState<'line' | 'color'>('line');

  const handleMagicColor = async () => {
    if (page.coloredUrl) {
      setViewMode('color');
      return;
    }

    try {
      setIsColoring(true);
      const colored = await colorLineArt(page.lineArtUrl, page.prompt);
      onUpdate({ ...page, coloredUrl: colored });
      setViewMode('color');
    } catch (error) {
      alert("Oh no! The magic crayon broke. Please try again.");
    } finally {
      setIsColoring(false);
    }
  };

  const handleDownload = (url: string, suffix: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `coloring-${page.prompt.replace(/\s+/g, '-')}-${suffix}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-4 border-b-4 border-black flex justify-between items-center bg-yellow-50">
          <h2 className="text-2xl font-bold italic">"{page.prompt}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full transition-colors border-2 border-transparent hover:border-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <div className="relative group scribble-border p-2 bg-white overflow-hidden w-full aspect-square">
              <img 
                src={viewMode === 'line' ? page.lineArtUrl : page.coloredUrl} 
                alt={page.prompt}
                className="w-full h-full object-contain rounded-2xl"
              />
              {isColoring && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center animate-pulse">
                  <span className="text-4xl">🎨</span>
                  <p className="mt-4 font-bold text-xl">Adding Magic Colors...</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-6 w-full">
              <Button 
                variant={viewMode === 'line' ? 'secondary' : 'primary'} 
                className="flex-1"
                onClick={() => setViewMode('line')}
              >
                Line Art
              </Button>
              {page.coloredUrl ? (
                <Button 
                  variant={viewMode === 'color' ? 'secondary' : 'primary'} 
                  className="flex-1"
                  onClick={() => setViewMode('color')}
                >
                  Colored Preview
                </Button>
              ) : (
                <Button 
                  variant="magic" 
                  className="flex-1"
                  isLoading={isColoring}
                  onClick={handleMagicColor}
                >
                  ✨ Magic Color
                </Button>
              )}
            </div>
          </div>

          <div className="md:w-64 flex flex-col gap-4">
            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-black">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🖨️</span> Print Me!
              </h3>
              <p className="text-sm mb-6 text-gray-700">
                Download the coloring page to print it out and color with your real crayons!
              </p>
              <Button 
                variant="success" 
                className="w-full mb-3"
                onClick={() => handleDownload(page.lineArtUrl, 'print')}
              >
                Download Paper
              </Button>
              {page.coloredUrl && (
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleDownload(page.coloredUrl!, 'colored')}
                >
                  Download Preview
                </Button>
              )}
            </div>

            <div className="bg-pink-50 p-6 rounded-2xl border-2 border-black flex-1">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>💡</span> Tip
              </h3>
              <p className="text-sm text-gray-700 italic">
                "Try coloring the {page.prompt.split(' ').pop()} with your favorite rainbow colors!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
