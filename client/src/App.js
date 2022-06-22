import React from "react";
import push from "./push.png";
import pull from "./pull.png";
import { io } from 'socket.io-client'

const host = window.location.host.split(':').length ? window.location.host.split(':')[0] : '';

function App() {
    const [pushData, setPushData] = React.useState(null);
    const [pullData, setPullData] = React.useState(null);
    const [isHovering, setIsHovering] = React.useState(false);

    const jsonStyle={ fontSize: 17, border:'1px solid grey', padding:10 };
    const divStyle={ backgroundColor: 'white', display: 'flex', justifyContent: 'center' };
    const innerDivStyle={ border: '1px solid grey', padding: 20, backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
    const buttonStyle={ cursor: 'pointer', fontSize: 20, color: isHovering ? 'black' : 'white', backgroundColor: isHovering ? 'white' : 'black', padding: 5, marginTop: 20 };

    const doRequest = async (destination) => {
        const res = await fetch(destination)
        const json = await res.json()
        if (destination === '/pull') {
            setPullData(JSON.parse(json.message))
        } else {
            setPushData(JSON.parse(json.message))
        }
    }

    React.useEffect(() => {
        const socket = io(`http://${host}:30001`)
        socket.on('connect', () => console.log(socket.id))
        socket.on('connect_error', () => {
            setTimeout(() => socket.connect(), 5000)
        })
        socket.on('data', (data) => {
            setPullData(JSON.parse(data))
        })
        socket.on('disconnect', () => setPullData('server disconnected'))
        doRequest('/pull')
    }, [])

    const pushButton = () => doRequest('/push')
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    return (
        <React.Fragment>
            <div style={{ marginTop: 70, ...divStyle }}>
                <h1 >TYPES OF CONFIGURATION UPDATES</h1>
            </div>
            <div style={{ marginTop: 30, ...divStyle}}>
                <div style={{ marginRight: 70, ...innerDivStyle }}>
                    <img src={push} width={300} />
                    <span>{!pushData ? "" :
                        <pre style={jsonStyle}>{JSON.stringify(pushData, null, 2)}</pre>
                    }</span>
                    <button onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => pushButton()}
                        style={buttonStyle}>
                        PUSH ME !
                    </button>
                </div>
                <div style={innerDivStyle}>
                    <img src={pull} width={300} />
                    <span>{!pullData ? "" :
                        <pre style={jsonStyle}>{JSON.stringify(pullData, null, 2)}</pre>
                    }</span>
                </div>
            </div>
        </React.Fragment>
    );
}
export default App;