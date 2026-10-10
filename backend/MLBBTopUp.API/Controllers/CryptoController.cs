using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class CryptoController : ControllerBase
{
    private readonly ICryptoService _cryptoService;

    public CryptoController(ICryptoService cryptoService)
    {
        _cryptoService = cryptoService;
    }

    [HttpGet("public-key")]
    public IActionResult GetPublicKey()
    {
        return Ok(new
        {
            success = true,
            publicKey = _cryptoService.GetPublicKeyPem(),
            algorithm = "RSA-OAEP-256",
            aesAlgorithm = "AES-256-CBC"
        });
    }
}
