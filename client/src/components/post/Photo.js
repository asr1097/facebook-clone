const Photo = ({ post }) => {
    
    return (
        <div>
            <img src={`images/${post.image}`} alt="Post"/>
        </div>
    )
};

export { Photo };