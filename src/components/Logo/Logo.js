import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
	return (
                                      
                <div className='logoContainer ma4 mt0'>
                    <Tilt className="Tilt br2 shadow-2 pa3">
                        <div>
                            <img alt="Logo" src={brain} />
                        </div>
                    </Tilt>
                </div>              
            
    );
}

export default Logo;