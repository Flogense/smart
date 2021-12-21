import React from 'react';
import Tilt from 'react-tilt';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        // <div className='center ma'>
        //     <div className='absolute mt2'>
        //         <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
        //         <div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}> </div>
        //     </div>
        // </div >

        <div className='center'>
            <Tilt options={{ max: 80 }} >
                <div className="pt2 center">
                    <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'></img>
                </div>
                <div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}>
                </div>
            </Tilt>
        </div>
    );
}

export default FaceRecognition;