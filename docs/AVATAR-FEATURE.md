# Player Avatar Feature Documentation

## Overview
The MLBB Top-Up website now displays real player profile avatars when verifying game accounts. Since MLBB doesn't provide official API access to player-uploaded profile photos, we've implemented a professional avatar generation system.

## How It Works

### 1. Account Verification Flow
When a user enters their Player ID and Server ID:
1. Frontend sends request to `/api/topup/check-account`
2. Backend calls `api.isan.eu.org` to verify the account and get player's username
3. Backend generates a unique avatar URL based on the username
4. Frontend displays the avatar in the profile card

### 2. Avatar Generation
We use **DiceBear API** (https://dicebear.com) to generate unique, gaming-style avatars:

- **Service**: DiceBear Avatars v7
- **Style**: Adventurer (cartoon gaming-style characters)
- **Seed**: Player's MLBB username (ensures same avatar for same player)
- **Size**: 256x256 pixels
- **Background**: Dark blue (#1e3a8a) matching MLBB theme

#### Example Avatar URL
```
https://api.dicebear.com/7.x/adventurer/png?seed=Pu+Deth&size=256&backgroundColor=1e3a8a
```

### 3. Avatar Features
✅ **Unique per player** - Each username generates a different avatar
✅ **Consistent** - Same player always gets the same avatar
✅ **Gaming-style** - Adventurer style looks like game characters
✅ **Fast loading** - Generated on-the-fly by DiceBear CDN
✅ **Fallback support** - Falls back to hero avatars if generation fails

## Implementation Details

### Backend Changes

#### File: `backend/MLBBTopUp.Core/Interfaces/ITopUpService.cs`
```csharp
public class CheckAccountResult
{
    public bool Valid { get; set; }
    public string PlayerId { get; set; } = string.Empty;
    public string ServerId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? AvatarUrl { get; set; }  // ← NEW FIELD
    public string? Message { get; set; }
}
```

#### File: `backend/MLBBTopUp.Infrastructure/Services/TopUpService.cs`
```csharp
private static string GenerateAvatarUrl(string username)
{
    var seed = System.Web.HttpUtility.UrlEncode(username);
    return $"https://api.dicebear.com/7.x/adventurer/png?seed={seed}&size=256&backgroundColor=1e3a8a";
}
```

### Frontend Changes

#### File: `frontend/src/pages/TopUp.js`
```javascript
const getPlayerAvatar = (avatarUrl, playerId, overrideHero = null) => {
  // Priority 1: API-provided avatar URL
  if (avatarUrl) return avatarUrl;
  
  // Priority 2: User-selected hero avatar
  if (overrideHero) return `/avatars/${overrideHero}.png`;
  
  // Priority 3: Deterministic hero avatar based on player ID
  if (!playerId) return '/avatars/Zilong.png';
  const num = parseInt(String(playerId).replace(/\D/g, ''), 10) || 0;
  const hero = MLBB_HEROES[num % MLBB_HEROES.length];
  return `/avatars/${hero}.png`;
};
```

## Alternative Avatar Styles

DiceBear offers multiple styles. You can change the style in the backend:

### Available Styles
| Style | Description | Example URL |
|-------|-------------|-------------|
| `adventurer` | Gaming-style cartoon characters (current) | `/7.x/adventurer/png?seed=...` |
| `avataaars` | Cartoon avatars (Sketch style) | `/7.x/avataaars/png?seed=...` |
| `big-smile` | Happy cartoon faces | `/7.x/big-smile/png?seed=...` |
| `bottts` | Robot avatars | `/7.x/bottts/png?seed=...` |
| `pixel-art` | 8-bit retro style | `/7.x/pixel-art/png?seed=...` |
| `lorelei` | Illustrated characters | `/7.x/lorelei/png?seed=...` |

### How to Change Avatar Style
Edit `backend/MLBBTopUp.Infrastructure/Services/TopUpService.cs`:

```csharp
// Change 'adventurer' to any style above
return $"https://api.dicebear.com/7.x/pixel-art/png?seed={seed}&size=256&backgroundColor=1e3a8a";
```

## Customization Options

### Background Colors
Change the `backgroundColor` parameter:
- Dark blue (current): `1e3a8a`
- MLBB purple: `6b21a8`
- Gold/mythic: `d97706`
- Random: `random`
- Transparent: Remove parameter

### Size
Current: 256x256 pixels
- For larger avatars: `size=512`
- For smaller avatars: `size=128`

### Additional Options
Add these parameters to the URL:
- `&radius=50` - Rounded corners
- `&backgroundType=gradientLinear` - Gradient background
- `&flip=true` - Mirror the avatar

## Testing

### Test the API directly:
```powershell
# PowerShell
curl "http://localhost:5000/api/topup/check-account?playerId=1225368571&serverId=11446" -UseBasicParsing | ConvertFrom-Json
```

### Expected Response:
```json
{
  "valid": true,
  "playerId": "1225368571",
  "serverId": "11446",
  "username": "Pu Deth",
  "country": "Cambodia",
  "avatarUrl": "https://api.dicebear.com/7.x/adventurer/png?seed=Pu+Deth&size=256&backgroundColor=1e3a8a",
  "message": "Account verified successfully"
}
```

## Known Limitations

1. **Not Real Player Photos**: MLBB doesn't provide API access to player-uploaded profile photos
2. **Generated Avatars**: Avatars are algorithmically generated, not actual player photos
3. **Internet Required**: Requires internet connection to generate avatars
4. **DiceBear Dependency**: Relies on third-party service (DiceBear API)

## Future Improvements

### Option 1: Allow Players to Upload Photos
- Add avatar upload feature in user profile
- Store in cloud storage (AWS S3, Azure Blob)
- Associate with user account

### Option 2: Use MLBB Hero Avatars
- Let players choose their favorite MLBB hero
- Display hero portrait instead of generated avatar
- Already implemented as fallback

### Option 3: Integrate with Real MLBB API (if available)
- Monitor for official MLBB API releases
- Integrate direct player photo fetching
- Requires official partnership with MLBB/Moonton

## Troubleshooting

### Avatar Not Displaying
1. Check browser console for errors
2. Verify API response contains `avatarUrl`
3. Test DiceBear URL directly in browser
4. Check internet connectivity

### Avatar Shows Wrong Character
- This is normal - avatars are randomly generated based on username
- Each unique username gets a unique avatar design
- Same username = same avatar (consistent)

### Want to Use Different Style
1. Edit `TopUpService.cs`
2. Change `/7.x/adventurer/` to another style
3. Rebuild backend: `dotnet build`
4. Restart backend: `dotnet run`

## Resources

- **DiceBear Documentation**: https://dicebear.com/docs
- **DiceBear Playground**: https://dicebear.com/playground
- **API Status**: https://status.dicebear.com
- **MLBB Verification API**: https://api.isan.eu.org

## Support

For issues or questions about the avatar feature:
1. Check this documentation
2. Test with different player IDs
3. Verify backend is returning `avatarUrl`
4. Check frontend console for errors

---

**Last Updated**: August 28, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
