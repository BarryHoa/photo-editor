import React, {useEffect, useState} from 'react';
import axios from "axios";
export function Process(props) {
    let ctx_rel = React.useRef(null);
    const [process, setProcess] = useState(0);
    useEffect(() => {
        // axios({
        //     url: 'https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg',
        //     onDownloadProgress(progress) {
        //         progress = Math.round((progress.loaded / progress.total) * 100);
        //
        //         setProcess(progress);
        //     }
        // }).then(response => {
        //     console.log('response has arrived');
        // });
    },[]);
    return(
        <>
            <div>Process : {process} %</div>
            <img width="500" height="300" src="https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg"/>
        </>
    )
}