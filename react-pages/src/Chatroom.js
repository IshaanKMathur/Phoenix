import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';

function Chatroom() {
  const { groupName, userName } = useParams();

  const handleIframeload=()=>{
    console.log('Iframe loaded');
  }

  useEffect(() => {
    // Get a reference to the iframe
    const iframe = document.getElementById('chatroomIframe');
    if (iframe && userName) {
      iframe.contentWindow.postMessage(userName, `http://localhost:5500/${groupName}`);
    }
  }, [userName]);

  return (
    <iframe 
      src={`http://localhost:5500/${groupName}`} 
      id="chatroomIframe"
      title="Chatroom" 
      style={{ width: '100%', height: '100vh' }} 
      onLoad={handleIframeload}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
    />
  );
}

export default Chatroom;