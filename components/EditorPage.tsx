/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import Header from './Header';
import StartScreen from './StartScreen';
import AdjustmentPanel from './AdjustmentPanel';
import FilterPanel from './FilterPanel';
import Spinner from './Spinner';
import { generateAdjustedImage, generateFilteredImage, generateEditedImage } from '../services/geminiService';
import { UndoIcon, RedoIcon, EyeIcon, BullseyeIcon, PaletteIcon, SunIcon } from './icons';

export type Tool = 'retouch' | 'filter' | 'adjust' | 'crop';

const toolConfig = {
    retouch: { icon: BullseyeIcon, label: 'Retouch' },
    filter: { icon: PaletteIcon, label: 'Filter' },
    adjust: { icon: SunIcon, label: 'Adjust' },
};

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
}

const EditorPage: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isComparing, setIsComparing] = useState(false);
    
    const [retouchHotspot, setRetouchHotspot] = useState<{ x: number, y: number } | null>(null);
    const [retouchPrompt, setRetouchPrompt] = useState('');
    const imageRef = useRef<HTMLImageElement>(null);

    const currentImageUrl = history[historyIndex];
    const originalImageUrl = history[0];

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const updateHistory = (newImageUrl: string) => {
        setError(null);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newImageUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setActiveTool(null);
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setOriginalFile(file);
            setHistory([url]);
            setHistoryIndex(0);
            setActiveTool(null);
            setError(null);
            setRetouchHotspot(null);
            setRetouchPrompt('');
        }
    };
    
    const handleUndo = () => canUndo && setHistoryIndex(historyIndex - 1);
    const handleRedo = () => canRedo && setHistoryIndex(historyIndex + 1);
    
    const handleToolSelect = (tool: Tool) => {
        if (isLoading) return;
        setActiveTool(activeTool === tool ? null : tool);
        setRetouchHotspot(null);
    };

    const handleApplyAdjustment = async (prompt: string) => {
        if (!currentImageUrl || !originalFile) return;
        setIsLoading(true);
        setError(null);
        try {
            const currentImageFile = await dataUrlToFile(currentImageUrl, originalFile.name);
            const newImageUrl = await generateAdjustedImage(currentImageFile, prompt, false);
            updateHistory(newImageUrl);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during adjustment.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyFilter = async (prompt: string) => {
        if (!currentImageUrl || !originalFile) return;
        setIsLoading(true);
        setError(null);
        try {
            const currentImageFile = await dataUrlToFile(currentImageUrl, originalFile.name);
            const newImageUrl = await generateFilteredImage(currentImageFile, prompt, false);
            updateHistory(newImageUrl);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during filtering.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (activeTool !== 'retouch' || isLoading) return;

        const img = imageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left) * (img.naturalWidth / img.width));
        const y = Math.round((e.clientY - rect.top) * (img.naturalHeight / img.height));
        
        setRetouchHotspot({ x, y });
    };

    const handleApplyRetouch = async () => {
        if (!currentImageUrl || !originalFile || !retouchHotspot || !retouchPrompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const currentImageFile = await dataUrlToFile(currentImageUrl, originalFile.name);
            const newImageUrl = await generateEditedImage(currentImageFile, retouchPrompt, retouchHotspot, false);
            updateHistory(newImageUrl);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during retouching.');
        } finally {
            setIsLoading(false);
            setRetouchHotspot(null);
            setRetouchPrompt('');
        }
    };
    
    const renderActiveToolPanel = () => {
        switch (activeTool) {
            case 'adjust':
                return <AdjustmentPanel onApplyAdjustment={handleApplyAdjustment} isLoading={isLoading} />;
            case 'filter':
                return <FilterPanel onApplyFilter={handleApplyFilter} isLoading={isLoading} />;
            case 'retouch':
                return (
                    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-center text-gray-300">Retouch Image</h3>
                        <p className="text-sm text-gray-400 text-center -mt-2">
                            {retouchHotspot ? 'Now describe the change you want to make.' : 'Click on the image to select a point to edit.'}
                        </p>
                        {retouchHotspot && (
                            <div className="flex flex-col gap-3 animate-fade-in">
                                <input
                                    type="text"
                                    value={retouchPrompt}
                                    onChange={(e) => setRetouchPrompt(e.target.value)}
                                    placeholder="e.g., 'remove the blemish' or 'add a bird'"
                                    className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <button
                                    onClick={handleApplyRetouch}
                                    className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={isLoading || !retouchPrompt.trim()}
                                >
                                    Apply Retouch
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (!originalFile) {
        return (
            <div className="bg-gray-900 min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4">
                    <StartScreen onFileSelect={handleFileSelect} />
                </main>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col text-gray-100">
            <Header />
            <main className="flex-grow flex flex-col items-center gap-6 p-4 md:p-8">
                <div className="w-full max-w-7xl bg-gray-800/50 border border-gray-700 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        {Object.entries(toolConfig).map(([key, { icon: Icon, label }]) => (
                            <button
                                key={key}
                                onClick={() => handleToolSelect(key as Tool)}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                                    activeTool === key
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20' 
                                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                                }`}
                                title={label}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleUndo} disabled={!canUndo || isLoading} title="Undo" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><UndoIcon className="w-5 h-5" /></button>
                        <button onClick={handleRedo} disabled={!canRedo || isLoading} title="Redo" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><RedoIcon className="w-5 h-5" /></button>
                        <button 
                            onMouseDown={() => setIsComparing(true)}
                            onMouseUp={() => setIsComparing(false)}
                            onTouchStart={() => setIsComparing(true)}
                            onTouchEnd={() => setIsComparing(false)}
                            disabled={isLoading} title="Hold to compare with original" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 active:bg-white/30 transition-colors"><EyeIcon className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="w-full max-w-7xl flex-grow flex flex-col lg:flex-row items-start gap-6">
                    <div className="w-full lg:w-2/3 flex-grow bg-black/20 rounded-lg border border-gray-700/50 flex items-center justify-center p-4 relative overflow-hidden">
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-fade-in">
                                <Spinner />
                                <p className="mt-4 text-lg font-semibold text-gray-200">AI is working its magic...</p>
                            </div>
                        )}
                        <img
                            ref={imageRef}
                            src={isComparing ? originalImageUrl : currentImageUrl}
                            alt="Editable asset"
                            className={`max-w-full max-h-[65vh] object-contain ${activeTool === 'retouch' && !isLoading ? 'cursor-crosshair' : ''}`}
                            onClick={handleImageClick}
                        />
                    </div>
                    <div className="w-full lg:w-1/3">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-4 animate-fade-in" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {renderActiveToolPanel() || (
                            <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center h-full text-center backdrop-blur-sm">
                                <h3 className="text-lg font-semibold text-gray-300">Select a tool to begin editing</h3>
                                <p className="text-sm text-gray-400 mt-1">Choose an option from the toolbar above to start making changes to your image.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditorPage;