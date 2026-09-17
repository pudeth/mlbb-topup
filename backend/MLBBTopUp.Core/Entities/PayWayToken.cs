namespace MLBBTopUp.Core.Entities;

public class PayWayToken
{
    public int PayWayTokenId { get; set; }
    public int UserId { get; set; }
    
    // ABA PayWay Specifics
    public string Ctid { get; set; } = string.Empty; // e.g. "USER123"
    public string Pwt { get; set; } = string.Empty; // e.g. "6451397B..."
    public string Type { get; set; } = string.Empty; // "ABA ACCOUNT", "Visa", "MC"
    public string SourceOfFund { get; set; } = string.Empty; // Masked e.g. "*****1481"
    public string TokenFlag { get; set; } = string.Empty; // "CITI_FLEX", "CITR_FIX", etc.
    public DateTime ExpiredAt { get; set; }
    public int Status { get; set; } = 1; // 1 = Active, 0 = Inactive, 2 = Frozen
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
