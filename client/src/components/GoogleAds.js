import { Component } from 'react';

class GoogleAds extends Component {

    componentDidMount () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render () {
        return (
            <ins class="adsbygoogle"
                style={{display:'inline-block', width:'728px', height:"90px"}}
                data-ad-client="ca-pub-8280885557380428"
                data-ad-slot="9124687802">    
            </ins>
        );
    }

    
}

export default GoogleAds;