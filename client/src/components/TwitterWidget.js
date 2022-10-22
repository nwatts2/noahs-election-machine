import { Timeline} from 'react-twitter-widgets';

function TwitterWidget () {
    return (
        <Timeline
            dataSource={{
                sourceType: 'list',
                ownerScreenName: 'ElectionNoah',
                slug: '1583216805983571968'
            }}
            options={{
                height:'400',
                width:'800',
                chrome: 'noheader transparent nofooter',
                tweetLimit: 10,
                theme: 'dark'
            }}
        />
    );
}

export default TwitterWidget;
