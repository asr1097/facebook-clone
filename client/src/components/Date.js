import { Link } from "react-router-dom";

const PostDate = ({ date, url }) => {
    let dateNow = Date.now()
    let dateObject = new Date(date);
    let parsedDate = parseInt((dateNow - Date.parse(date)) / 1000);

    if(parsedDate < 60) {
        let secondsText = parsedDate === 1 ? "second" : "seconds";
        return <Link to={`../${url}`}>{parsedDate} {secondsText} ago</Link>
    }
    else if(parsedDate > 59 && parsedDate < 3600) {
        let minutes = parseInt(parsedDate / 60);
        let minutesText = minutes === 1 ? "minute" : "minutes";
        return <Link to={`../${url}`}>{minutes} {minutesText} ago</Link>
    }
    else if(parsedDate > 3600 && parsedDate < 86400) {
        let hours = parseInt(parsedDate / 3600);
        let hoursText = hours === 1 ? "hour" : "hours";
        return <Link to={`../${url}`}>{hours} {hoursText} ago</Link>
    }
    else if(parsedDate > 86400 && parsedDate < 86400 * 2) {
        let time = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
        return <Link to={`../${url}`}>Yesterday at {time}</Link>
    }
    else if(parsedDate > 86400 * 2 && parsedDate < 86000 * 3) {
        return <Link to={`../${url}`}>2 days ago</Link>
    }
    else if(parsedDate > 86400 * 3 && parsedDate < 86000 * 4) {
        return <Link to={`../${url}`}>3 days ago</Link>
    }
    else {
        let postDate = `${dateObject.getDate()}/${dateObject.getMonth()+1}/${dateObject.getFullYear()}`
        return <Link to={`../${url}`}>{postDate}</Link>
    }
};

export { PostDate };