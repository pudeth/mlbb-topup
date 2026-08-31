# Contributing to MLBB Top-Up Website

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the project's goals
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Enhancements

1. Check existing feature requests
2. Provide clear use case
3. Explain expected benefits
4. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit PR with clear description

## Development Setup

See [QUICK-START.md](QUICK-START.md) for setup instructions.

## Coding Standards

### C# Backend

- Follow Microsoft C# coding conventions
- Use meaningful variable names
- Add XML documentation for public APIs
- Keep methods focused and small
- Use async/await for I/O operations

```csharp
/// <summary>
/// Creates a new order for diamond top-up
/// </summary>
/// <param name="userId">The user ID</param>
/// <param name="request">Order creation request</param>
/// <returns>Created order details</returns>
public async Task<OrderResponse?> CreateOrderAsync(int userId, CreateOrderRequest request)
{
    // Implementation
}
```

### React Frontend

- Use functional components with hooks
- Follow React best practices
- Use TypeScript types where beneficial
- Keep components small and focused
- Extract reusable logic to custom hooks

```javascript
// Good
const OrderCard = ({ order, onView }) => {
  return (
    <div className="card">
      <h3>{order.orderId}</h3>
      <button onClick={() => onView(order.orderId)}>View</button>
    </div>
  );
};

// Bad - too many responsibilities
const OrderCard = ({ order }) => {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  // ... lots of logic
};
```

### CSS/Tailwind

- Use Tailwind utility classes
- Extract repeated patterns to components
- Maintain responsive design
- Follow mobile-first approach

## Project Structure

```
backend/
├── MLBBTopUp.API/          # Controllers, startup
├── MLBBTopUp.Core/         # Domain models, interfaces
└── MLBBTopUp.Infrastructure/ # Data access, services

frontend/
├── src/
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── context/           # React context
│   └── utils/             # Utility functions
```

## Testing

### Backend Tests

```csharp
[Fact]
public async Task CreateOrder_ValidRequest_ReturnsOrder()
{
    // Arrange
    var request = new CreateOrderRequest
    {
        PlayerID = "12345",
        ServerID = "1234",
        ProductId = 1
    };

    // Act
    var result = await _orderService.CreateOrderAsync(1, request);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("12345", result.PlayerID);
}
```

### Frontend Tests

```javascript
describe('OrderCard', () => {
  it('renders order information', () => {
    const order = { orderId: 1, amount: 10.99 };
    render(<OrderCard order={order} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

## Commit Messages

Use conventional commits format:

```
feat: add payment method selection
fix: resolve CORS issue on production
docs: update API documentation
style: format code with prettier
refactor: extract payment logic to service
test: add order creation tests
chore: update dependencies
```

## Branch Naming

```
feature/payment-integration
bugfix/order-status-display
hotfix/security-vulnerability
docs/api-documentation
```

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings
```

## Security

### Reporting Vulnerabilities

- Email security issues to: security@example.com
- Do not create public issues for security vulnerabilities
- Provide detailed description and steps to reproduce

### Security Best Practices

- Never commit secrets or API keys
- Use parameterized queries
- Validate all user inputs
- Sanitize output
- Use HTTPS for all communications

## Documentation

- Update README.md for user-facing changes
- Update API documentation for endpoint changes
- Add code comments for complex logic
- Include examples in documentation

## Review Process

### Code Review Checklist

- [ ] Code is readable and maintainable
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Error handling is appropriate
- [ ] Tests cover new functionality
- [ ] Documentation is updated

### Response Time

- Issues: Within 48 hours
- Pull requests: Within 3-5 days
- Security issues: Within 24 hours

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Join community chat

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## Recognition

Contributors will be added to the project's contributors list.

Thank you for contributing! 🎉
