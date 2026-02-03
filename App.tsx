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

  useEffect(() => {
    const saved = localStorage.getItem('magic-coloring-pages');
    if (saved) {
      try {
        setPages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved pages", e);
      }
    } else {
      const defaults: ColoringPage[] = [
        {
          id: '1',
          prompt: 'A friendly baby dragon sitting on a big egg',
          lineArtUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=800&auto=format&fit=crop', // Placeholder for initial load
          createdAt: Date.now()
        },
        {
          id: '2',
          prompt: 'A magical unicorn jumping over a giant rainbow',
          lineArtUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?q=80&w=800&auto=format&fit=crop',
          createdAt: Date.now()
        },
        {
          id: '3',
          prompt: 'A cute space cat wearing a helmet in a rocket ship',
          lineArtUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
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
        id: Math.random().toString(36).slice(2, 11),
        prompt: prompt.trim(),
        lineArtUrl: url,
        createdAt: Date.now()
      };
      setPages(prev => [newPage, ...prev]);
      setPrompt('');
      setSelectedPage(newPage);
    } catch (error) {
      console.error(error);
      alert("Oh oh! Our magic pencil slipped! Can you try a different idea?");
    } finally {
      setGenState(GenerationState.IDLE);
    }
  };

  const handleUpdatePage = (updated: ColoringPage) => {
    setPages(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedPage(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8 md:gap-12">
      <header className="text-center flex flex-col items-center gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative inline-block">
          <span className="absolute -top-4 -left-4 md:-top-6 md:-left-6 text-3xl md:text-5xl animate-bounce">🖍️</span>
          <span className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 text-3xl md:text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎨</span>
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Magic Coloring!
          </h1>
        </div>
        <p className="text-lg md:text-2xl font-semibold text-blue-600 italic px-4">
          Draw anything you can imagine with magic ink!
        </p>
      </header>

      <section className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto w-full">
        <form onSubmit={handleGenerate} className="flex flex-col gap-4 md:gap-6">
          <div className="relative group">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: A cute elephant with a party hat..."
              className="w-full px-6 md:px-8 py-4 md:py-5 text-lg md:text-xl rounded-full border-4 border-black bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all placeholder:text-gray-400 placeholder:italic"
              disabled={genState !== GenerationState.IDLE}
            />
            <span className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 text-3xl group-focus-within:scale-125 transition-transform cursor-default">🪄</span>
          </div>
          <Button 
            variant="magic" 
            className="text-xl md:text-2xl py-4 md:py-6"
            isLoading={genState !== GenerationState.IDLE}
            type="submit"
          >
            Create My Page!
          </Button>
          <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
            {['A brave lion', 'A castle with wings', 'A happy cupcake'].map(suggestion => (
              <span 
                key={suggestion}
                className="bg-white px-3 py-1 rounded-full border-2 border-black cursor-pointer hover:bg-yellow-100 active:scale-95 transition-all font-bold"
                onClick={() => setPrompt(suggestion)}
              >
                {suggestion}
              </span>
            ))}
          </div>
        </form>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-white px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            My Adventures
          </h2>
          <div className="h-1 flex-1 bg-black rounded-full opacity-10"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {pages.map((page) => (
            <div 
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className="bg-white rounded-2xl md:rounded-3xl border-4 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="aspect-square bg-white relative overflow-hidden">
                <img 
                  src={page.lineArtUrl} 
                  alt={page.prompt}
                  className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <span className="bg-white px-6 py-2 rounded-full border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-0 group-hover:scale-100 transition-transform">
                    Color Now!
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-5 border-t-4 border-black bg-yellow-50">
                <h3 className="text-lg md:text-xl font-bold line-clamp-1 italic text-purple-600">"{page.prompt}"</h3>
                <div className="flex justify-between items-center mt-2 md:mt-3">
                  <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">Adventure #{page.id.slice(0,4)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPage && (
        <ColoringModal 
          page={selectedPage} 
          onClose={() => setSelectedPage(null)}
          onUpdate={handleUpdatePage}
        />
      )}

      <footer className="mt-8 md:mt-12 text-center text-gray-400 font-bold py-8 md:py-12 border-t-2 border-dashed border-gray-200">
        <p className="mb-4 text-sm md:text-base">Created for little artists to explore big dreams! 🚀✨</p>
      </footer>
    </div>
  );
};

export default App;
