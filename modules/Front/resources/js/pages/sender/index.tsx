import { useState } from 'react';
import Posting from './posting';
import Linimasa from './linimasa';

export default function Sender() {
    return (
        <div>
            <Posting />
            <Linimasa />
        </div>
    );
}
