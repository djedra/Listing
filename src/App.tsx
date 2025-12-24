import React from 'react';
import Listing from './components/Listing';
import etsyData from './data/etsy.json';

const App: React.FC = () => {
    return (
        <div className="wrapper">
            <Listing items={etsyData} />
        </div>
    );
};

export default App;