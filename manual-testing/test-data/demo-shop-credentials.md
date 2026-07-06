# DemoWebShop Test Credentials & Data

## Application Details

**Application**: Tricentis DemoWebShop  
**URL**: https://demowebshop.tricentis.com/  
**Type**: E-commerce Demo Application  
**Purpose**: QA Training & Testing  

---

## Default Test User

```json
{
  "username": "neuralqaacademy@gmail.com",
  "password": "Tester@123",
  "userType": "Registered Customer"
}
```

### Access
1. Navigate to: https://demowebshop.tricentis.com/
2. Click **Log in** (top right)
3. Enter username: `neuralqaacademy@gmail.com`
4. Enter password: `Tester@123`
5. Click **Log in**

---

## Test Scenarios Available

### 1. Authentication Tests
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Logout functionality
- ✅ Password reset
- ✅ Account registration

### 2. Shopping Tests
- ✅ Browse products
- ✅ Add products to cart
- ✅ Remove from cart
- ✅ Update quantities
- ✅ Apply coupons/discounts
- ✅ Checkout process
- ✅ Order placement

### 3. Account Management
- ✅ View profile
- ✅ Update account info
- ✅ Change password
- ✅ View order history
- ✅ Manage addresses

### 4. Product Search
- ✅ Search by keyword
- ✅ Filter by category
- ✅ Sort by price/name
- ✅ View product details

---

## Key URL Endpoints

```
Base URL:      https://demowebshop.tricentis.com/
Login:         https://demowebshop.tricentis.com/login
Logout:        https://demowebshop.tricentis.com/logout
Account:       https://demowebshop.tricentis.com/customer/info
My Orders:     https://demowebshop.tricentis.com/customer/orders
Cart:          https://demowebshop.tricentis.com/cart
Products:      https://demowebshop.tricentis.com/
```

---

## Common Test Data

### Product Categories
- Books
- Computers
- Electronics
- Apparel & Shoes
- Digital downloads
- Jewelry
- Gift Cards

### Sample Products
- Nikon D5
- Leica T Mirrorless Camera
- Apple Macbook Pro 13"
- Samsung 49" Curved Monitor

### Payment Methods
- Check/Money Order (Test Method)
- Credit Card (Test Method)
- Purchase Order

### Shipping Methods
- Ground Shipping
- Next Day Air
- 2nd Day Air

---

## Test Account Scenarios

### Scenario 1: Returning Customer
```
Username: neuralqaacademy@gmail.com
Password: Tester@123
Status: Active, Has Previous Orders
```

### Scenario 2: New Customer Registration
```
Email: [new-test-email@gmail.com]
First Name: Test
Last Name: User
Password: Test@123456
Confirm: Test@123456
```

### Scenario 3: Guest Checkout
```
No login required
Enter email: guest@test.com
Continue with shipping address
```

---

## Common Test Cases

### TC-001: Login with Valid Credentials
```
Steps:
1. Navigate to https://demowebshop.tricentis.com/
2. Click Log in
3. Enter: neuralqaacademy@gmail.com
4. Enter password: Tester@123
5. Click Log in

Expected:
- User dashboard displayed
- Username shown in welcome message
- Cart and My Account visible
```

### TC-002: Add Product to Cart
```
Steps:
1. Log in as test user
2. Navigate to Products
3. Select any product (e.g., Nikon D5)
4. View product details
5. Click "Add to cart"
6. Verify cart updated

Expected:
- Product added to cart
- Cart count incremented
- Success message shown
```

### TC-003: Complete Checkout
```
Steps:
1. Log in as test user
2. Add product to cart
3. View cart
4. Proceed to checkout
5. Confirm shipping address
6. Select shipping method
7. Select payment method
8. Review order
9. Place order

Expected:
- Order confirmation page
- Order number generated
- Success message shown
```

---

## Important Notes

⚠️ **Test Data Handling**
- This is a public demo site
- Test data may be shared
- Don't use real/sensitive personal info
- Use "test" prefixes for new accounts

⚠️ **Credentials**
- Default credentials are publicly available
- Change password periodically
- Don't hardcode in test files
- Use environment variables for CI/CD

✅ **Best Practices**
- Clean up test data after tests
- Use consistent test user
- Log out after each session
- Clear cart between tests
- Document new test users

---

## Troubleshooting

### Issue: Login fails with valid credentials
**Solution**: 
- Check internet connection
- Verify URL is correct: https://demowebshop.tricentis.com/
- Clear browser cache and cookies
- Try incognito/private mode

### Issue: Cart not updating
**Solution**:
- Refresh page
- Clear browser cache
- Try different product
- Check JavaScript is enabled

### Issue: Checkout button unavailable
**Solution**:
- Ensure logged in
- Add product to cart first
- Check cart is not empty
- Verify shipping address is set

### Issue: Payment method not available
**Solution**:
- Check country/region selected
- Try different shipping address
- Use test payment method (Check/Money Order)

---

## Quick Reference

| Action | URL/Location |
|--------|-------------|
| Log In | Click Log in (top right) |
| Log Out | Click Log out (top right) |
| Account Info | Link in top right menu |
| View Cart | Cart link (top right) |
| Browse Products | Click Products menu |
| Search | Use search box (top) |
| Help/Feedback | Footer links |

---

## Additional Resources

- **Help/FAQ**: Available on site
- **Demo Info**: For training purposes
- **Sample Orders**: Pre-loaded for testing
- **Test Environment**: Fresh reset daily

---

## Test Data File Format

When creating new test users, use format:
```json
{
  "testCase": "TC-XXX",
  "userRole": "Registered Customer",
  "email": "test-user-XXX@gmail.com",
  "password": "Tester@123",
  "firstName": "Test",
  "lastName": "User",
  "createdDate": "2026-07-04",
  "status": "Active"
}
```

---

**Ready to start testing with DemoWebShop!** 🛒
