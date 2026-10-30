import React, { useState } from 'react';
import Searching from './search';
import Topics from './topic';
import Items from './items';

export default function Home() {
    return (
        <div className="p-2">
            <div className="min-h-200 max-w-200 border border-gray-300">
                <Searching />
                <Topics />
                <Items />
            </div>
        </div>
    );
}
