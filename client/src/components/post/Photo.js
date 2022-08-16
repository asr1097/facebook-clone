const Photo = ({ post }) => {
    
    return (
        <div>
            <img src={`http://localhost:3000/images/${post.image}`} alt="Post"/>
        </div>
    )
};

export { Photo };