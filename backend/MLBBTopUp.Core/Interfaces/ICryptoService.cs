namespace MLBBTopUp.Core.Interfaces;

public interface ICryptoService
{
    string GetPublicKeyPem();
    byte[] DecryptAesKeyWithRsa(string base64EncryptedKey);
    byte[] DecryptAes(byte[] combinedBytes, byte[] key);
    byte[] EncryptAes(byte[] plainBytes, byte[] key, byte[] iv);
    string DecryptString(string base64Combined, byte[] key);
    string EncryptString(string plainText, byte[] key, byte[] iv);
}
