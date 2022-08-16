import { Link } from "react-router-dom";

const DateFormat = ({ date, url }) => {
    let dateNow = Date.now()
    let dateObject = new Date(date);
    let parsedDate = parseInt((dateNow - Date.parse(date)) / 1000);

    const link = (url, parsedDate, timeText) => {
        return <Link to={`../${url}`}>{parsedDate} {timeText} ago</Link>
    };

    const text = (parsedDate, timeText) => {
        return <p>{parsedDate} {timeText} ago</p>
    }

    if(parsedDate < 60) {
        let secondsText = parsedDate === 1 ? "second" : "seconds";
        if(url) {return link(url, parsedDate, secondsText)}
        else {return text(parsedDate, secondsText)}
    }
    else if(parsedDate > 59 && parsedDate < 3600) {
        let minutes = parseInt(parsedDate / 60);
        let minutesText = minutes === 1 ? "minute" : "minutes";
        if(url) {return link(url, minutes, minutesText)}
        else {return text(minutes, minutesText)}
    }
    else if(parsedDate > 3600 && parsedDate < 86400) {
        let hours = parseInt(parsedDate / 3600);
        let hoursText = hours === 1 ? "hour" : "hours";
        if(url) {return link(url, hours, hoursText)}
        else {return text(hours, hoursText)}
    }
    else if(parsedDate > 86400 && parsedDate < 86400 * 2) {
        let time = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
        if(url) {return <Link to={`../${url}`}>Yesterday at {time}</Link>}
        else{return <p>Yesterday at {time}</p>}
    }
    else if(parsedDate > 86400 * 2 && parsedDate < 86000 * 3) {
        if(url){ return <Link to={`../${url}`}>2 days ago</Link>}
        else{return <p>2 days ago</p>}
    }
    else if(parsedDate > 86400 * 3 && parsedDate < 86000 * 4) {
        if(url){return <Link to={`../${url}`}>3 days ago</Link>}
        else{return <p>3 days ago</p>}
    }
    else {
        let postDate = `${dateObject.getDate()}/${dateObject.getMonth()+1}/${dateObject.getFullYear()}`
        if(url){return <Link to={`../${url}`}>{postDate}</Link>}
        else{return <p>{postDate}</p>}
    }
};

export { DateFormat };