const Photo = ({ post }) => {
    
    return (
        <div>
            <img src={`https://localhost:3000/images/${post.image}`} alt="Post"/>
        </div>
    )
};

export { Photo };