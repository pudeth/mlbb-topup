namespace MLBBTopUp.Core.Interfaces;

public interface ICryptoService
{
    string GetPublicKeyPem();
    byte[] DecryptAesKeyWithRsa(string base64EncryptedKey);
    byte[] DecryptAes(byte[] cipherBytes, byte[] key, byte[] iv);
    byte[] EncryptAes(byte[] plainBytes, byte[] key, byte[] iv);
    string DecryptString(string base64Cipher, byte[] key, byte[] iv);
    string EncryptString(string plainText, byte[] key, byte[] iv);
}
