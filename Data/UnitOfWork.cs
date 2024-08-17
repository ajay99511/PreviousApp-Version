using API.Interfaces;

namespace API.Data
{
    public class UnitOfWork(DataContext context,IUserRepository userRepository,
    ILikeRepository likeRepository,IMessageRepository messageRepository,IPostRepository postRepository): IUnitOfWork
    {
        public IUserRepository UserRepository => userRepository;

        public IMessageRepository MessageRepository => messageRepository;

        public ILikeRepository LikeRepository => likeRepository;

        public IPostRepository PostRepository => postRepository;

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync()>0;
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges ();
        }
    }
}