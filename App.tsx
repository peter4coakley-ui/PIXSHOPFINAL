/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import EditorPage from './components/EditorPage';


const App: React.FC = () => {
    // Determine the initial page based on the URL path
    const getInitialPage = () => {
        return window.location.pathname === '/app' ? 'app' : 'landing';
    };

    const [page, setPage] = useState(getInitialPage());

    // Listen for browser back/forward navigation
    useEffect(() => {
        const onPopState = () => {
            setPage(getInitialPage());
        };
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('popstate', onPopState);
        };
    }, []);

    const handleLaunchApp = () => {
        window.history.pushState({}, '', '/app');
        setPage('app');
    };

    if (page === 'landing') {
        return (
            <div className="min-h-screen text-gray-100 flex flex-col">
                <main className="flex-grow w-full mx-auto p-4 md:p-8 flex justify-center items-center">
                    <LandingPage onLaunchApp={handleLaunchApp} />
                </main>
            </div>
        );
    }
    
    // If page is 'app', render the editor page
    return <EditorPage />;
};


export default App;