const Photo = ({ post }) => {
    
    return (
        <div>
            <img src={`${process.env.REACT_APP_SERVER_URL}/images/${post.image}`} alt="Post"/>
        </div>
    )
};

export { Photo };