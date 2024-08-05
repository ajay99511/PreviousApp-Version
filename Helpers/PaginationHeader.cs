namespace API.Helpers;

public class PaginationHeader(int currentPage,int itemsPerPage,int totalPages,int totalItems)
{
    public int CurrentPage { get; set; } = currentPage;    
    public int ItemsPerPage{get; set; } = itemsPerPage;
    public int TotalPages{ get; set; } = totalPages;
    public int TotalItems{ get; set; } = totalItems;
}