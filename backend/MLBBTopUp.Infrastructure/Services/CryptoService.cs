using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.Infrastructure.Services;

public class CryptoService : ICryptoService
{
    private readonly ILogger<CryptoService> _logger;
    private readonly RSA _rsa;
    private readonly string _publicKeyPem;

    private const string DefaultPrivateKeyPem = @"-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDZGE+ygm1cBwNa
FNZ0D/J0trV5iWwmNgKkEjIGNwV4sGddUx+g7MEYDUWLB1y1SJILY530Bz4cwZZ9
Kj3kp8fEbH3JocaBsu4qsAvF5zAbi/ZDV8Ct1CeY+zTw1VLsAeueBrXdgR73Plge
JyKxUW/c8NEh9BU3HYX5nGEh6OxdLLqLOoViCsx5wtfwCqr7PzkgCtrTAj6E9Ojl
tORTaUNnehscU9jxqdIfpXKvHp9hKpgGu3NZ7iMxX4GollxaywIIi/wYb9CdF4EA
HrMo65nQEDvcgrIweIhUkzxXxzTf6ZYabL5ulIrAMJZZ2a1FiPHVxag1stc0xejz
mPFXcrn1AgMBAAECggEAEfgNrLBX/eyErgGYiI3DWz6+QZuKzJTe3ha1dkc6mDU9
sP9O2GKQTv3WOj43QbgKgo/RxJ+O2BF788s5yUHL6qmyNazCwfx98yGUL+LFXBpX
HVbXl2u+hU6RoLd/gBJenrtedUGZPwy1fXVuzS9461gxbzaFRQUYEEON1KEzYzjH
/j8Jn0YAhDzz3wdcjLRZVmFtMLZ5lOkNeVvvdlkTlCCEmkkrceCc31LI1XrMJrDk
S9yfL3U3bjjPLbydIiaWf4C/E6q8kvIBlkK/3Hb6PYzSR65lco6VvOQE6oWlIXXr
yS5Q93vNu8oMH9lT6vY87h5iucHXCCMl8RGlMDaMdwKBgQD2AVQhLU1/7ABx+RYg
bnDimcGOORQGY5mcIkkl1f8j5cB0Z6sroA4LfVLXGjQkRbO/m453eN43+zDbQhZd
Y3mjLcn72HhgeA00BsBos/i8YBh6vPpJfnMhz6RI/aFzqK0BqSFmetTQeX427f3V
ZKAwQqwgS07NAxxoDM/k609unwKBgQDh6kpyicCWwP04Ni7qZX+wOmkgtHgOlP9Z
ZEiR5wgC/g0mHP2LE+yVJ6jwwMysEiQ77/U5CbNCkb/eUn/0c/35E/HN0/Mt5ntT
u9YDtDgKaUl6QyfMWKKuiZHe9nLijYbx4WWroqJvF8X8Uf/EtFPp4mqv57ikzN9S
4LeHFZ8S6wKBgHU2aNlt9nEvB39GiW5mcM7nJ7wWIh5xMm2cQHIQpoJ6I9rS0lH0
7vw2eFQZHiLyOxTej2EJbAgMXVj7AiD5FqnTVVvz5ldAnDnfxamdprRKrR8+D5sY
7s57WvGUN2seQWB7L3jeqauzV5ngh4M3cMPN4Kl6eE9iXhSNljiijbRNAoGADuC7
HmfsAwGaq4UF+fHNQvHV0o2QCoXNezmbfeBVKr1IaGYoXGxnfDssaQ6JbBuVv0zC
PYth/tRSanXMb3DkHO8vUXrP3Qn8vTr1kTDhL+5XJHIfwNllfVEaBjD8x+bCKFPL
uk3vnJlYNJHB4lZt4E1E8Wi1REUpv++EpqTJ4RkCgYBDPSgvcRFp5li26iKGFMX2
kD1ARNMx0retoGiAvVZQ64QpkdIMABDaXdRyiaWaTw4SVd1Ws7rZ/uROTM2S9oa0
Y8KC/NybEsKe4QQPUX0DNgioYSVeSCcMu3fluUWfJ5h68h9Z10REsOMIsPdoow/m
z1+9mIn8p+EC7fjHSSyItw==
-----END PRIVATE KEY-----";

    private const string DefaultPublicKeyPem = @"-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2RhPsoJtXAcDWhTWdA/y
dLa1eYlsJjYCpBIyBjcFeLBnXVMfoOzBGA1FiwdctUiSC2Od9Ac+HMGWfSo95KfH
xGx9yaHGgbLuKrALxecwG4v2Q1fArdQnmPs08NVS7AHrnga13YEe9z5YHicisVFv
3PDRIfQVNx2F+ZxhIejsXSy6izqFYgrMecLX8Aqq+z85IAra0wI+hPTo5bTkU2lD
Z3obHFPY8anSH6Vyrx6fYSqYBrtzWe4jMV+BqJZcWssCCIv8GG/QnReBAB6zKOuZ
0BA73IKyMHiIVJM8V8c03+mWGmy+bpSKwDCWWdmtRYjx1cWoNbLXNMXo85jxV3K5
9QIDAQAB
-----END PUBLIC KEY-----";

    public CryptoService(IConfiguration configuration, ILogger<CryptoService> logger)
    {
        _logger = logger;
        _rsa = RSA.Create();

        var privKey = configuration["Crypto:PrivateKeyPem"]
            ?? Environment.GetEnvironmentVariable("CRYPTO_PRIVATE_KEY_PEM")
            ?? DefaultPrivateKeyPem;

        try
        {
            _rsa.ImportFromPem(privKey);
            _publicKeyPem = _rsa.ExportSubjectPublicKeyInfoPem();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[CryptoService] Failed to load configured RSA key, falling back to default key pair");
            _rsa.ImportFromPem(DefaultPrivateKeyPem);
            _publicKeyPem = DefaultPublicKeyPem;
        }
    }

    public string GetPublicKeyPem() => _publicKeyPem;

    public byte[] DecryptAesKeyWithRsa(string base64EncryptedKey)
    {
        var cipherBytes = Convert.FromBase64String(base64EncryptedKey);
        return _rsa.Decrypt(cipherBytes, RSAEncryptionPadding.OaepSHA256);
    }

    public byte[] EncryptAes(byte[] plainBytes, byte[] key, byte[] iv)
    {
        using var aes = Aes.Create();
        aes.KeySize = 256;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = key;
        aes.IV = iv;

        using var encryptor = aes.CreateEncryptor();
        var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        // Prepend IV (16 bytes) to cipherBytes so frontend doesn't need separate iv property
        var combined = new byte[iv.Length + cipherBytes.Length];
        Buffer.BlockCopy(iv, 0, combined, 0, iv.Length);
        Buffer.BlockCopy(cipherBytes, 0, combined, iv.Length, cipherBytes.Length);

        return combined;
    }

    public byte[] DecryptAes(byte[] combinedBytes, byte[] key)
    {
        if (combinedBytes.Length < 16)
            throw new ArgumentException("Payload too short", nameof(combinedBytes));

        var iv = new byte[16];
        var cipherBytes = new byte[combinedBytes.Length - 16];
        Buffer.BlockCopy(combinedBytes, 0, iv, 0, 16);
        Buffer.BlockCopy(combinedBytes, 16, cipherBytes, 0, cipherBytes.Length);

        using var aes = Aes.Create();
        aes.KeySize = 256;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = key;
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor();
        return decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
    }

    public string EncryptString(string plainText, byte[] key, byte[] iv)
    {
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var combinedBytes = EncryptAes(plainBytes, key, iv);
        return Convert.ToBase64String(combinedBytes);
    }

    public string DecryptString(string base64Combined, byte[] key)
    {
        var combinedBytes = Convert.FromBase64String(base64Combined);
        var plainBytes = DecryptAes(combinedBytes, key);
        return Encoding.UTF8.GetString(plainBytes);
    }
}
