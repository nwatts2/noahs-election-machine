import { Tweet, Timeline} from 'react-twitter-widgets';
import $ from 'jquery';


function TwitterWidget () {
    //const list = await fetch("https://api.twitter.com/1.1/lists/statuses.json?slug=teams&ElectionNoah=MLS&count=1");
    //console.log(list[0].truncated);
    let tweetID = '1585041605584900096';

    /*$.getJSON("http://twitter.com/status/user_timeline/ElectionNoah.json?count=1&callback=callbackName", function (data) {
        if (data.length > 0) {
            let link = $.jQuery('<a>').attr('http://twitter.com/ElectionNoah/status/' + data[0].id).text('Read');
            tweetID = data[0].id;
        }
    });*/

    return (
       <Tweet tweetId={tweetID} />
    );
}

export default TwitterWidget;

/* <Timeline
            dataSource={{
                sourceType: 'tweet',
                ownerScreenName: 'ElectionNoah',
                slug: '1583216805983571968'
                tweet
            }}
            options={{
                height:'400',
                width:'800',
                chrome: 'noheader transparent nofooter',
                tweetLimit: 10,
                theme: 'dark'
            }}
        />*/