import { Tweet, Timeline} from 'react-twitter-widgets';


function TwitterWidget () {
    let tweetID = '1585041605584900096';

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