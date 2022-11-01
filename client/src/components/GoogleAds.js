import { Component } from 'react';

class GoogleAds extends Component {

    componentDidMount () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render () {
        return (
            <ins class="adsbygoogle"
                style={{display: 'block'}}
                data-ad-client="ca-pub-8280885557380428"
                data-ad-slot="9124687802"
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        );
    }

    
}

export default GoogleAds;