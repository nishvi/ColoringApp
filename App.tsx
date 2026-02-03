
import React, { useState, useEffect } from 'react';
import { ColoringPage, GenerationState } from './types';
import { generateLineArt } from './services/geminiService';
import { Button } from './components/Button';
import { ColoringModal } from './components/ColoringModal';

const App: React.FC = () => {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [genState, setGenState] = useState<GenerationState>(GenerationState.IDLE);
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);

  // Initial starter pages (placeholders or locally stored)
  useEffect(() => {
    const saved = localStorage.getItem('magic-coloring-pages');
    if (saved) {
      setPages(JSON.parse(saved));
    } else {
      // Some fun defaults for the first visit
      const defaults: ColoringPage[] = [
        {
          id: '1',
          prompt: 'A cute baby dragon with wings',
          lineArtUrl: 'https://picsum.photos/seed/dragon/800/800',
          createdAt: Date.now()
        },
        {
          id: '2',
          prompt: 'A magical unicorn in space',
          lineArtUrl: 'https://picsum.photos/seed/unicorn/800/800',
          createdAt: Date.now()
        },
        {
          id: '3',
          prompt: 'A happy cat eating pizza',
          lineArtUrl: 'https://picsum.photos/seed/cat/800/800',
          createdAt: Date.now()
        }
      ];
      setPages(defaults);
    }
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem('magic-coloring-pages', JSON.stringify(pages));
    }
  }, [pages]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setGenState(GenerationState.GENERATING_LINE_ART);
      const url = await generateLineArt(prompt);
      const newPage: ColoringPage = {
        id: Math.random().toString(36).substr(2, 9),
        prompt: prompt.trim(),
        lineArtUrl: url,
        createdAt: Date.now()
      };
      setPages(prev => [newPage, ...prev]);
      setPrompt('');
      setSelectedPage(newPage);
    } catch (error) {
      alert("Something went wrong with our magic wand! Try a different animal or creature.");
    } finally {
      setGenState(GenerationState.IDLE);
    }
  };

  const handleUpdatePage = (updated: ColoringPage) => {
    setPages(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedPage(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Header Section */}
      <header className="text-center flex flex-col items-center gap-6">
        <div className="bg-white p-6 rounded-[3rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          <span className="absolute -top-6 -left-6 text-5xl animate-bounce">🖍️</span>
          <span className="absolute -bottom-6 -right-6 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎨</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Magic Color Adventures
          </h1>
        </div>
        <p className="text-2xl font-semibold text-blue-600 italic">
          What would you like to color today?
        </p>
      </header>

      {/* Generator Section */}
      <section className="bg-white p-8 rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto w-full">
        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          <div className="relative group">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A happy robot... A space cat... A giant cake..."
              className="w-full px-8 py-5 text-xl rounded-full border-4 border-black bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all placeholder:text-gray-400 placeholder:italic"
              disabled={genState !== GenerationState.IDLE}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl group-focus-within:scale-125 transition-transform cursor-default">🪄</span>
          </div>
          <Button 
            variant="magic" 
            className="text-2xl py-6"
            isLoading={genState !== GenerationState.IDLE}
            type="submit"
          >
            Create My Coloring Page!
          </Button>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-pink-100 px-3 py-1 rounded-full border border-black cursor-pointer hover:bg-pink-200" onClick={() => setPrompt('A cute dinosaur')}>A cute dinosaur</span>
            <span className="bg-blue-100 px-3 py-1 rounded-full border border-black cursor-pointer hover:bg-blue-200" onClick={() => setPrompt('A castle in the clouds')}>A castle in the clouds</span>
            <span className="bg-green-100 px-3 py-1 rounded-full border border-black cursor-pointer hover:bg-green-200" onClick={() => setPrompt('A space rocket landing')}>A space rocket landing</span>
          </div>
        </form>
      </section>

      {/* Gallery Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold bg-white px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            My Gallery
          </h2>
          <div className="h-1 flex-1 bg-black rounded-full opacity-20"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {pages.map((page) => (
            <div 
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className="bg-white rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
            >
              <div className="aspect-square bg-white relative overflow-hidden">
                <img 
                  src={page.lineArtUrl} 
                  alt={page.prompt}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <span className="bg-white px-6 py-2 rounded-full border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Color Me!
                  </span>
                </div>
              </div>
              <div className="p-5 border-t-4 border-black bg-yellow-50">
                <h3 className="text-xl font-bold line-clamp-1">"{page.prompt}"</h3>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Created {new Date(page.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-400 border border-black"></span>
                    <span className="w-3 h-3 rounded-full bg-blue-400 border border-black"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400 border border-black"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {pages.length === 0 && (
          <div className="text-center py-24 bg-white/50 rounded-[3rem] border-4 border-dashed border-black">
            <span className="text-7xl">📭</span>
            <p className="mt-4 text-2xl font-bold text-gray-400 italic">Your gallery is empty. Start creating!</p>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedPage && (
        <ColoringModal 
          page={selectedPage} 
          onClose={() => setSelectedPage(null)}
          onUpdate={handleUpdatePage}
        />
      )}

      {/* Footer Decoration */}
      <footer className="mt-12 text-center text-gray-400 font-bold py-12">
        <p className="mb-4">Crafted with magic for tiny artists everywhere 🦄</p>
        <div className="flex justify-center gap-4 text-3xl opacity-50">
          <span>🎨</span><span>🖍️</span><span>🖌️</span><span>✨</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
