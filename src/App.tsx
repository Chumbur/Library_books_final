/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Download, Search, Library, Sun, Info } from 'lucide-react';
import Papa from 'papaparse';

const CSV_URL = "https://raw.githubusercontent.com/Chumbur/Library-books/be446fca4204d8d35dc3fc1b1a470edf5d41ca2b/Copy%20of%20MAIAD%20-%20READING%20LIST%20-%202025-2026.csv";

interface Book {
  title: string;
  author: string;
  class: string;
  pdf: string;
  spine: {
    bg: string;
    text: string;
    w: number;
    h: number;
    font: string;
    weight: number;
    rotation?: number;
    variant?: 'default' | 'bordered' | 'icon' | 'number' | 'large-number';
    number?: string;
  };
}

const INITIAL_BOOKS: Book[] = [
  {
    "title": "In AI we trust",
    "author": "Helga Nowotny",
    "class": "History of Ai",
    "pdf": "https://your-pdf-link.com/in-ai-we-trust.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 45, "h": 400, "font": "'Unbounded', sans-serif", "weight": 700 }
  },
  {
    "title": "Algospeak",
    "author": "Adam Aleksic",
    "class": "Text as outcome",
    "pdf": "https://your-pdf-link.com/algospeak.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 38, "h": 360, "font": "'Space Mono', monospace", "weight": 700, "variant": "bordered", "number": "01" }
  },
  {
    "title": "The Work of Art",
    "author": "Walter Benjamin",
    "class": "Text as outcome",
    "pdf": "https://web.mit.edu/allanmc/www/benjamin.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 55, "h": 440, "font": "'DM Serif Display', serif", "weight": 400, "rotation": -3 }
  },
  {
    "title": "Reproduction",
    "author": "Marshall McLuhan",
    "class": "Text as outcome",
    "pdf": "https://your-pdf-link.com/reproduction.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 48, "h": 380, "font": "'Unbounded', sans-serif", "weight": 900 }
  },
  {
    "title": "Patently Untrue",
    "author": "Bruce Sterling",
    "class": "Text as outcome",
    "pdf": "https://your-pdf-link.com/patently-untrue.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 65, "h": 480, "font": "'Space Mono', monospace", "weight": 700, "variant": "icon" }
  },
  {
    "title": "In the Flow",
    "author": "Boris Groys",
    "class": "History of Ai",
    "pdf": "https://your-pdf-link.com/in-the-flow.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 42, "h": 370, "font": "'Unbounded', sans-serif", "weight": 700, "rotation": 5 }
  },
  {
    "title": "L'Intelligence artificielle",
    "author": "Éric Sadin",
    "class": "Text as outcome",
    "pdf": "https://your-pdf-link.com/intelligence-artificielle.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 50, "h": 420, "font": "'Unbounded', sans-serif", "weight": 900, "variant": "bordered", "number": "24" }
  },
  {
    "title": "In Defense of the Poor Image",
    "author": "Hito Steyerl",
    "class": "Text as outcome",
    "pdf": "http://worker01.e-flux.com/pdf/article_94.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 35, "h": 340, "font": "'Space Mono', monospace", "weight": 700 }
  },
  {
    "title": "Says Who?",
    "author": "Anne Curzan",
    "class": "Text as outcome",
    "pdf": "https://your-pdf-link.com/says-who.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 58, "h": 410, "font": "'Unbounded', sans-serif", "weight": 700, "variant": "icon" }
  },
  {
    "title": "Technodiversity",
    "author": "Yuk Hui",
    "class": "History of Ai",
    "pdf": "https://www.technodiversity.org/white-paper",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 38, "h": 460, "font": "'Space Mono', monospace", "weight": 700, "rotation": -8 }
  },
  {
    "title": "Context Rot",
    "author": "Chroma Report",
    "class": "Text as outcome",
    "pdf": "https://research.trychroma.com/context-rot",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 42, "h": 390, "font": "'Unbounded', sans-serif", "weight": 900, "variant": "bordered", "number": "LLM" }
  },
  {
    "title": "Your Brain on ChatGPT",
    "author": "MIT Research Team",
    "class": "Text as outcome",
    "pdf": "https://arxiv.org/pdf/2506.08872v1",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 60, "h": 450, "font": "'Space Mono', monospace", "weight": 700, "rotation": 12 }
  },
  {
    "title": "DOT — LINE — SHAPE",
    "author": "Elena Rossi",
    "class": "Typography",
    "pdf": "https://your-pdf-link.com/dot-line-shape.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 45, "h": 380, "font": "'Space Mono', monospace", "weight": 700, "rotation": -5 }
  },
  {
    "title": "GRAPHIC FEST",
    "author": "Dr. Aris Thorne",
    "class": "AI Ethics",
    "pdf": "https://your-pdf-link.com/graphic-fest.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 50, "h": 420, "font": "'Unbounded', sans-serif", "weight": 900 }
  },
  {
    "title": "YOU ARE HERE",
    "author": "Sarah Jenkins",
    "class": "UX Research",
    "pdf": "https://your-pdf-link.com/you-are-here.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 55, "h": 440, "font": "'Unbounded', sans-serif", "weight": 700, "variant": "bordered", "number": "2" }
  },
  {
    "title": "GRAPHITE",
    "author": "Marcus Vane",
    "class": "Motion Design",
    "pdf": "https://your-pdf-link.com/graphite.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 58, "h": 410, "font": "'Unbounded', sans-serif", "weight": 900 }
  },
  {
    "title": "NEW FOLK ART",
    "author": "Kaito Nakamura",
    "class": "Brand Identity",
    "pdf": "https://your-pdf-link.com/new-folk-art.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 60, "h": 430, "font": "'Unbounded', sans-serif", "weight": 700, "variant": "icon" }
  },
  {
    "title": "PALETTE mini PASTEL",
    "author": "Amara Okoro",
    "class": "Service Design",
    "pdf": "https://your-pdf-link.com/palette-mini-pastel.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 120, "h": 340, "font": "'Space Mono', monospace", "weight": 700, "variant": "large-number", "number": "5" }
  },
  {
    "title": "GOOD BY DESIGN",
    "author": "Leo Sterling",
    "class": "Generative Art",
    "pdf": "https://your-pdf-link.com/good-by-design.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 48, "h": 450, "font": "'Unbounded', sans-serif", "weight": 900, "rotation": 15 }
  },
  {
    "title": "NEURAL NETWORKS",
    "author": "Victor Chen",
    "class": "AI Architecture",
    "pdf": "https://your-pdf-link.com/neural-networks.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 42, "h": 390, "font": "'Space Mono', monospace", "weight": 700, "rotation": -2 }
  },
  {
    "title": "TYPE AS IMAGE",
    "author": "Lara Croft",
    "class": "Typography II",
    "pdf": "https://your-pdf-link.com/type-as-image.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 45, "h": 410, "font": "'Unbounded', sans-serif", "weight": 700, "variant": "bordered", "number": "12" }
  },
  {
    "title": "VOID SPACE",
    "author": "Zaha Hadid",
    "class": "Spatial Design",
    "pdf": "https://your-pdf-link.com/void-space.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 65, "h": 460, "font": "'DM Serif Display', serif", "weight": 400 }
  },
  {
    "title": "ALGORITHMIC ART",
    "author": "Casey Reas",
    "class": "Creative Coding",
    "pdf": "https://your-pdf-link.com/algorithmic-art.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 45, "h": 370, "font": "'Space Mono', monospace", "weight": 700, "variant": "icon" }
  },
  {
    "title": "FUTURE CITIES",
    "author": "Bjarke Ingels",
    "class": "Urbanism",
    "pdf": "https://your-pdf-link.com/future-cities.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 60, "h": 430, "font": "'Unbounded', sans-serif", "weight": 900, "rotation": 8 }
  },
  {
    "title": "BIO DESIGN",
    "author": "Neri Oxman",
    "class": "Material Science",
    "pdf": "https://your-pdf-link.com/bio-design.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 50, "h": 400, "font": "'Unbounded', sans-serif", "weight": 700, "variant": "bordered", "number": "01" }
  },
  {
    "title": "DATA POETICS",
    "author": "Giorgia Lupi",
    "class": "Data Viz",
    "pdf": "https://your-pdf-link.com/data-poetics.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 38, "h": 350, "font": "'Space Mono', monospace", "weight": 700 }
  },
  {
    "title": "THE NEW NORMAL",
    "author": "Benjamin Bratton",
    "class": "Design Theory",
    "pdf": "https://your-pdf-link.com/the-new-normal.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 55, "h": 440, "font": "'Unbounded', sans-serif", "weight": 900, "rotation": -10 }
  },
  {
    "title": "NEURAL DREAMS",
    "author": "Refik Anadol",
    "class": "Data Art",
    "pdf": "https://your-pdf-link.com/neural-dreams.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 48, "h": 410, "font": "'Unbounded', sans-serif", "weight": 900, "rotation": 5 }
  },
  {
    "title": "POST-HUMAN DESIGN",
    "author": "Rosie Braidotti",
    "class": "Philosophy",
    "pdf": "https://your-pdf-link.com/post-human.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 42, "h": 380, "font": "'Space Mono', monospace", "weight": 700, "variant": "bordered", "number": "08" }
  },
  {
    "title": "GLITCH AESTHETICS",
    "author": "Rosa Menkman",
    "class": "Media Theory",
    "pdf": "https://your-pdf-link.com/glitch.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 35, "h": 360, "font": "'Unbounded', sans-serif", "weight": 700, "variant": "icon" }
  },
  {
    "title": "SPECULATIVE EVERYTHING",
    "author": "Dunne & Raby",
    "class": "Critical Design",
    "pdf": "https://your-pdf-link.com/speculative.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 50, "h": 430, "font": "'DM Serif Display', serif", "weight": 400, "rotation": -12 }
  },
  {
    "title": "DESIGN OF EVERYDAY THINGS",
    "author": "Don Norman",
    "class": "Cognitive Science",
    "pdf": "https://your-pdf-link.com/don-norman.pdf",
    "spine": { "bg": "#FFFFFF", "text": "#0000FF", "w": 58, "h": 400, "font": "'Unbounded', sans-serif", "weight": 900 }
  }
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null);
  const [expandedBookTitle, setExpandedBookTitle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingTags, setIsDraggingTags] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startXTags, setStartXTags] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollLeftStateTags, setScrollLeftStateTags] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const categories = Array.from(new Set(books.map(b => b.class))).sort();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || book.class === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getSpineFontSize = (title: string, height: number, width: number, variant?: string) => {
    const length = title.length;
    let baseSize = variant === 'bordered' ? 13 : 20;
    
    // Ensure it fits the width
    const maxWidth = width - 10;
    if (baseSize > maxWidth) baseSize = maxWidth;

    // Ensure it fits the height (roughly)
    const availableHeight = height - (variant === 'bordered' ? 120 : 80);
    const charHeight = availableHeight / length;
    
    return `${Math.min(baseSize, charHeight * 1.4)}px`;
  };

  const getCoverFontSize = (title: string) => {
    const length = title.length;
    if (length > 35) return 'text-xl';
    if (length > 25) return 'text-2xl';
    if (length > 15) return 'text-3xl';
    return 'text-4xl';
  };

  // Fetch CSV data from GitHub
  useEffect(() => {
    const fetchBooks = async () => {
      Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const csvBooks: Book[] = results.data.map((row: any, idx: number) => {
              // Get the original spine style if available, otherwise use a default
              const originalSpine = INITIAL_BOOKS[idx]?.spine || {
                bg: "#FFFFFF",
                text: "#0000FF",
                w: 45,
                h: 400,
                font: "'Unbounded', sans-serif",
                weight: 700
              };

              const pdfLink = row["PDF LINK"] || row.pdf || "";
              const hasPdf = pdfLink && pdfLink !== "#" && !pdfLink.includes("your-pdf-link.com");

              return {
                title: row.TITLE || row.title || "Untitled",
                author: row.AUTHOR || row.author || "Unknown",
                class: row.CLASS || row.class || "General",
                pdf: hasPdf ? pdfLink : "",
                spine: originalSpine
              };
            });

            // Replace the first N books with CSV data, keep the rest
            const updatedBooks = [...csvBooks, ...INITIAL_BOOKS.slice(csvBooks.length)];
            setBooks(updatedBooks);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        }
      });
    };

    fetchBooks();
  }, []);

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const el = scrollContainerRef.current;
    const tagsEl = tagsContainerRef.current;

    const setupWheel = (element: HTMLDivElement | null) => {
      if (!element) return () => {};
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          element.scrollLeft += e.deltaY * 1.5;
        }
      };
      element.addEventListener('wheel', onWheel, { passive: false });
      return () => element.removeEventListener('wheel', onWheel);
    };

    const cleanupWheel = setupWheel(el);
    const cleanupTagsWheel = setupWheel(tagsEl);

    const handleScroll = () => {
      if (el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          setScrollProgress(el.scrollLeft / maxScroll);
        }
      }
    };

    if (el) el.addEventListener('scroll', handleScroll);

    return () => {
      cleanupWheel();
      cleanupTagsWheel();
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingTags(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scrollContainerRef.current) {
      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    }
    
    if (isDraggingTags && tagsContainerRef.current) {
      e.preventDefault();
      const x = e.pageX - tagsContainerRef.current.offsetLeft;
      const walk = (x - startXTags) * 2;
      tagsContainerRef.current.scrollLeft = scrollLeftStateTags - walk;
    }
  };

  const handleMouseDownTags = (e: React.MouseEvent) => {
    if (!tagsContainerRef.current) return;
    setIsDraggingTags(true);
    setStartXTags(e.pageX - tagsContainerRef.current.offsetLeft);
    setScrollLeftStateTags(tagsContainerRef.current.scrollLeft);
  };

  return (
    <div className="min-h-screen bg-[#0000FF] text-white font-sans selection:bg-white selection:text-[#0000FF] flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 shrink-0">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-7xl font-unbounded font-black tracking-tighter uppercase leading-none">
            MAIAD<br />Library
          </h1>
          <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.3em] opacity-80">Digital Archive for Design & AI</p>
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex items-center gap-4 w-full md:w-auto"
        >
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
            <input 
              type="text"
              placeholder="SEARCH ARCHIVE..."
              className="w-full bg-white/10 border border-white/20 rounded-none py-3 pl-10 pr-6 text-[10px] font-mono focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white hover:text-[#0000FF] transition-all font-mono text-[10px] uppercase tracking-widest shrink-0"
          >
            <Info className="w-3 h-3" />
            About
          </button>
        </motion.div>
      </header>

      {/* Main Content - Horizontal Slider */}
      <main className="flex-1 flex flex-col items-center w-full relative pb-10">
        {/* Category Filters / Keywords */}
        <div className="w-full px-6 md:px-12 py-8 z-20 flex flex-col items-center gap-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-2">Filter by Category</div>
          <div 
            ref={tagsContainerRef}
            onMouseDown={handleMouseDownTags}
            onMouseLeave={() => setIsDraggingTags(false)}
            onMouseUp={() => setIsDraggingTags(false)}
            onMouseMove={handleMouseMove}
            className={`flex flex-nowrap gap-2 overflow-x-auto no-scrollbar w-full max-w-5xl pb-2 select-none ${isDraggingTags ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all border rounded-full flex-shrink-0 ${!selectedCategory ? 'bg-white text-[#0000FF] border-white shadow-lg' : 'bg-transparent text-white border-white/20 hover:border-white/60'}`}
            >
              All Archive
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all border rounded-full flex-shrink-0 ${selectedCategory === cat ? 'bg-white text-[#0000FF] border-white shadow-lg' : 'bg-transparent text-white border-white/20 hover:border-white/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex items-end gap-1.5 w-full px-12 md:px-24 overflow-x-auto no-scrollbar select-none min-h-[550px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-end gap-1.5 pb-4 pointer-events-none min-w-max">
              {filteredBooks.map((book, idx) => {
                const isExpanded = expandedBookTitle === book.title;
                return (
                  <motion.div
                    key={book.title}
                    initial={{ x: 1000, opacity: 0 }}
                    animate={{ 
                      x: 0, 
                      opacity: 1,
                      width: isExpanded ? 380 : book.spine.w,
                      rotate: book.spine.rotation || 0,
                      zIndex: isExpanded ? 50 : 1
                    }}
                    transition={{ 
                      x: { delay: idx * 0.05, type: "spring", stiffness: 70, damping: 15 },
                      width: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
                      zIndex: { duration: 0 }
                    }}
                    onMouseEnter={() => setHoveredBook(book)}
                    onMouseLeave={() => setHoveredBook(null)}
                    onClick={(e) => {
                      if (isDragging) return;
                      setExpandedBookTitle(isExpanded ? null : book.title);
                    }}
                    className="pointer-events-auto relative shadow-2xl origin-bottom flex-shrink-0 cursor-pointer overflow-hidden group"
                    style={{
                      height: book.spine.h,
                      backgroundColor: book.spine.bg,
                      color: book.spine.text,
                    }}
                  >
                    {/* Cover Content (Visible when Expanded) */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-700 flex flex-col p-8 justify-between ${
                        isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">{book.class}</span>
                        <h3 className={`${getCoverFontSize(book.title)} font-unbounded font-black uppercase tracking-tighter leading-none`}>{book.title}</h3>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {(() => {
                          const hasPdf = book.pdf && book.pdf !== "" && book.pdf !== "#";
                          return (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasPdf) {
                                  setViewingPdf(book.pdf);
                                  setIsPdfLoading(true);
                                }
                              }}
                              disabled={!hasPdf}
                              className={`w-full py-4 border-2 border-current rounded-full font-unbounded font-black uppercase text-xs tracking-widest transition-all relative z-[100] pointer-events-auto flex items-center justify-center gap-2 ${
                                hasPdf 
                                  ? 'hover:bg-current hover:text-white active:scale-95 cursor-pointer' 
                                  : 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                              {hasPdf ? 'Read PDF' : 'No PDF Available'}
                            </button>
                          );
                        })()}

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(book);
                          }}
                          className="w-full py-2 text-[10px] font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                        >
                          View Details
                        </button>

                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">Author</span>
                            <span className="text-sm font-unbounded font-bold uppercase tracking-tight">{book.author}</span>
                          </div>
                          <div className="text-[10px] font-mono font-bold border border-current px-2 py-1 rounded-full">
                            2026
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spine Content (Fades when Expanded) */}
                    <div 
                      className={`absolute inset-0 flex flex-col items-center py-6 px-1 transition-opacity duration-700 ${
                        isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                      }`}
                    >
                  <div className="flex-1 flex items-center justify-center w-full">
                    {book.spine.variant === 'bordered' ? (
                      <div className="flex flex-col items-center gap-4 h-full w-full py-4">
                        <div className="border-2 border-current rounded-full px-2 py-8 flex items-center justify-center">
                          <span 
                            className="writing-vertical-rl uppercase font-black tracking-tighter whitespace-nowrap"
                            style={{ fontSize: getSpineFontSize(book.title, book.spine.h, book.spine.w, 'bordered') }}
                          >
                            {book.title}
                          </span>
                        </div>
                        <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center font-black text-xs">
                          {book.spine.number}
                        </div>
                        <div className="border-2 border-current rounded-full px-2 py-4 flex items-center justify-center">
                          <span 
                            className="writing-vertical-rl uppercase font-bold tracking-tighter whitespace-nowrap"
                            style={{ fontSize: `${Math.min(8, 60 / book.class.length)}px` }}
                          >
                            {book.class}
                          </span>
                        </div>
                      </div>
                    ) : book.spine.variant === 'icon' ? (
                      <div className="flex flex-col items-center justify-between h-full py-4">
                        <Sun className="w-6 h-6 fill-current" />
                        <span 
                          className="writing-vertical-rl uppercase font-black tracking-tighter whitespace-nowrap"
                          style={{ fontSize: getSpineFontSize(book.title, book.spine.h, book.spine.w) }}
                        >
                          {book.title}
                        </span>
                        <Sun className="w-6 h-6 fill-current" />
                      </div>
                    ) : book.spine.variant === 'large-number' ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="flex flex-col items-center text-[8px] font-mono uppercase tracking-widest leading-tight">
                          <span>Palette</span>
                          <span>Mini</span>
                          <span>Pastel</span>
                        </div>
                        <span 
                          className="font-black leading-none"
                          style={{ fontSize: `${Math.min(120, book.spine.w * 0.85)}px` }}
                        >
                          {book.spine.number}
                        </span>
                      </div>
                    ) : (
                      <span 
                        className="writing-vertical-rl uppercase font-black tracking-tighter whitespace-nowrap px-2"
                        style={{ 
                          fontFamily: book.spine.font,
                          fontWeight: book.spine.weight,
                          fontSize: getSpineFontSize(book.title, book.spine.h, book.spine.w)
                        }}
                      >
                        {book.title}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-4 border-t border-current/10 w-full flex justify-center px-1 overflow-hidden">
                    <span className="text-[8px] font-mono font-bold tracking-tighter opacity-80 uppercase truncate">
                      {book.author}
                    </span>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute inset-0 shadow-[inset_-1px_0_5px_rgba(0,0,0,0.05)] pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
          
          {filteredBooks.length === 0 && (
            <div className="w-full text-center py-20 opacity-60 font-mono text-sm uppercase tracking-[0.5em]">
              Archive Empty
            </div>
          )}
        </div>

        {/* Hover Info Section */}
        <div className="w-full px-6 md:px-12 mt-12 h-32 flex items-center justify-center border-t border-white/10">
          <AnimatePresence>
            {(hoveredBook || (expandedBookTitle && books.find(b => b.title === expandedBookTitle))) ? (
              <motion.div 
                key={(hoveredBook || books.find(b => b.title === expandedBookTitle))?.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl"
              >
                {(() => {
                  const displayBook = hoveredBook || books.find(b => b.title === expandedBookTitle);
                  if (!displayBook) return null;
                  return (
                    <>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Title</span>
                        <span className="text-2xl md:text-3xl font-unbounded font-black uppercase tracking-tighter leading-none truncate">{displayBook.title}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Author</span>
                        <span className="text-2xl md:text-3xl font-unbounded font-black uppercase tracking-tighter leading-none truncate">{displayBook.author}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Class</span>
                        <span className="text-2xl md:text-3xl font-unbounded font-black uppercase tracking-tighter leading-none truncate">{displayBook.class}</span>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                className="text-[10px] font-mono uppercase tracking-[0.4em]"
              >
                Hover over a book to view archive details
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* About Side Panel */}
      <AnimatePresence>
        {isAboutOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm cursor-crosshair"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-1/2 bg-white text-[#0000FF] z-[160] shadow-2xl p-8 md:p-16 flex flex-col overflow-y-auto"
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-8 right-8 p-3 bg-[#0000FF] text-white hover:bg-black transition-colors rounded-none flex items-center justify-center group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mt-12 md:mt-24 max-w-xl">
                <h2 className="text-4xl md:text-6xl font-unbounded font-black tracking-tighter uppercase leading-none mb-12">
                  About<br />Archive
                </h2>
                
                <div className="space-y-12">
                  <p className="text-lg md:text-xl font-medium leading-relaxed">
                    MAIAD Library is an interactive experiment for the Master in AI and Design program. 
                    A curated digital shelf exploring the space between web, artificial intelligence, and design culture.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-[#0000FF]/10">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Authors</span>
                      <p className="font-unbounded font-bold text-sm uppercase tracking-tight">
                        Valeria Castillo Moreno<br />Irakli Chumburidze
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Program</span>
                      <p className="font-unbounded font-bold text-sm uppercase tracking-tight">
                        Master in AI and Design — MAIAD
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Focus</span>
                      <p className="font-unbounded font-bold text-sm uppercase tracking-tight">
                        Interactive experiments for Web and AI
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Year</span>
                      <p className="font-unbounded font-bold text-sm uppercase tracking-tight">
                        2025 — ongoing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-crosshair"
            />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative w-full max-w-5xl bg-white text-[#0000FF] rounded-none overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
            >
              {/* Close Button - Fixed Position in Modal */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBook(null);
                }}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] p-3 bg-[#0000FF] text-white hover:bg-black transition-colors rounded-none flex items-center justify-center group"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Left: Visual */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-[#0000FF]">
                <motion.div 
                  initial={{ rotateY: -30, x: -50 }}
                  animate={{ rotateY: 0, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-64 h-[400px] md:w-72 md:h-[450px] bg-white shadow-2xl relative flex flex-col items-center py-12 px-4 perspective-1000"
                >
                   <span className="writing-vertical-rl uppercase font-black text-3xl md:text-4xl tracking-tighter whitespace-nowrap">
                    {selectedBook.title}
                  </span>
                  <div className="mt-auto text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
                    {selectedBook.author}
                  </div>
                  {/* Page Edge Effect */}
                  <div className="absolute top-0 right-0 bottom-0 w-2 bg-gradient-to-l from-black/5 to-transparent" />
                </motion.div>
              </div>

              {/* Right: Info */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white">
                <div className="space-y-8 md:space-y-12">
                  <div>
                    <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] opacity-60 mb-4">{selectedBook.class}</p>
                    <h3 className="text-4xl md:text-6xl font-unbounded font-black tracking-tighter uppercase leading-none break-words">{selectedBook.title}</h3>
                    <p className="text-lg md:text-xl font-mono mt-4 opacity-80">BY {selectedBook.author.toUpperCase()}</p>
                  </div>

                  <div className="space-y-6 text-sm leading-relaxed font-medium">
                    <p>
                      THIS PUBLICATION IS PART OF THE MAIAD CURATED COLLECTION. 
                      EXPLORING THE BOUNDARIES OF GRAPHIC DESIGN, TYPOGRAPHY, AND 
                      ALGORITHMIC CREATIVITY.
                    </p>
                    <p className="opacity-60 text-xs">
                      FIRST PUBLISHED: 2026<br />
                      ARCHIVE REF: LIB-{selectedBook.title.slice(0,3).toUpperCase()}-09X
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => {
                        setViewingPdf(selectedBook.pdf);
                        setIsPdfLoading(true);
                      }}
                      className="flex items-center justify-center gap-3 bg-[#0000FF] text-white px-8 py-4 font-unbounded font-black text-xs uppercase hover:bg-black transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      ACCESS ARCHIVE
                    </button>
                    <button className="flex items-center justify-center gap-3 border-2 border-[#0000FF] px-8 py-4 font-unbounded font-black text-xs uppercase hover:bg-[#0000FF] hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                      COLLECT
                    </button>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#0000FF]/10 flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest opacity-40">
                  <span>MAIAD DIGITAL ARCHIVE</span>
                  <span>© 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {viewingPdf && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPdf(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-crosshair"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full bg-white shadow-2xl flex flex-col z-[210] overflow-hidden"
            >
              {/* PDF Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#0000FF]/10 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#0000FF] text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0000FF]">
                    Digital Archive Viewer
                  </span>
                </div>
                <button 
                  onClick={() => setViewingPdf(null)}
                  className="p-2 hover:bg-[#0000FF] hover:text-white transition-colors text-[#0000FF]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* PDF Content */}
              <div className="flex-1 bg-zinc-100 relative">
                {isPdfLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white z-10">
                    <div className="w-12 h-12 border-4 border-[#0000FF]/20 border-t-[#0000FF] rounded-full animate-spin" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0000FF] animate-pulse">
                      Loading Archive...
                    </span>
                  </div>
                )}
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingPdf)}&embedded=true`}
                  className="w-full h-full border-none"
                  title="PDF Viewer"
                  onLoad={() => setIsPdfLoading(false)}
                />
              </div>

              {/* PDF Footer */}
              <div className="px-6 py-3 border-t border-[#0000FF]/10 bg-white flex justify-between items-center">
                <div className="text-[8px] font-mono uppercase tracking-widest opacity-40 text-[#0000FF]">
                  MAIAD Library System v1.0
                </div>
                <a 
                  href={viewingPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8px] font-mono uppercase tracking-widest text-[#0000FF] hover:underline"
                >
                  Open in new window
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}
