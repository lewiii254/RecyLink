# 🐛 Debugging Report Submission Issues

## Quick Test Steps

### 1. Check Browser Console
1. Open the application in your browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Try to submit a report
5. Look for any error messages or validation logs

### 2. Test with Valid Data
Make sure your test data meets these requirements:

**Title**: 5-100 characters
- ✅ Good: "Waste Dumping in Park"
- ❌ Bad: "Waste" (too short)

**Description**: 10-500 characters  
- ✅ Good: "There is a large amount of plastic waste dumped near the playground area"
- ❌ Bad: "Waste here" (too short)

**Location**: Valid coordinates
- ✅ Good: Latitude: 40.7128, Longitude: -74.0060
- ❌ Bad: Latitude: 95 (invalid), Longitude: abc (not a number)

**Image URL**: Valid URL
- ✅ Good: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"
- ❌ Bad: "not-a-url" or "http://invalid"

### 3. Test Form Step by Step

1. **Go to New Report page**
2. **Fill in Title**: "Test Waste Report" (18 characters)
3. **Fill in Description**: "This is a test report to check if the validation is working properly" (70 characters)
4. **Fill in Location**: 
   - Click "Use current location" OR
   - Enter Latitude: 40.7128
   - Enter Longitude: -74.0060
5. **Fill in Image URL**: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"
6. **Click Submit Report**

### 4. Check What Happens

**If it works**: You should see:
- Success toast: "Report created successfully! You earned 25 points."
- Redirect to dashboard
- Points updated in navbar

**If it fails**: Check console for:
- Validation errors
- Network errors
- Data being sent

### 5. Common Issues and Solutions

#### Issue: "Title must be between 5 and 100 characters"
**Solution**: Make sure title is at least 5 characters long

#### Issue: "Description must be between 10 and 500 characters"  
**Solution**: Make sure description is at least 10 characters long

#### Issue: "Latitude must be between -90 and 90"
**Solution**: Use valid latitude values (-90 to 90)

#### Issue: "Longitude must be between -180 and 180"
**Solution**: Use valid longitude values (-180 to 180)

#### Issue: "Please provide a valid image URL"
**Solution**: Use a valid URL starting with http:// or https://

#### Issue: "Access denied. No token provided"
**Solution**: Make sure you're logged in

### 6. Debug Information

The form now includes debug logging. Check the browser console for:
- `🔍 Validating form data:` - Shows what data is being validated
- `🔍 Validation errors:` - Shows any frontend validation errors
- `📝 Sending report data:` - Shows what data is being sent to server
- `❌ Report submission error:` - Shows any server errors

### 7. Test with Different Data

Try these exact values to test:

```json
{
  "title": "Plastic Waste in Central Park",
  "description": "Large amount of plastic bottles and bags scattered around the playground area near the fountain",
  "location": {
    "lat": 40.7829,
    "lng": -73.9654
  },
  "imageUrl": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"
}
```

### 8. Check Server Logs

If you're running the server in terminal, check for:
- `📝 Received report data:` - Shows what the server received
- Any error messages

### 9. Reset and Try Again

If nothing works:
1. Clear browser cache and cookies
2. Restart the development servers
3. Try with a fresh browser session
4. Check if MongoDB is running

## Still Having Issues?

If you're still getting validation errors:

1. **Copy the exact error message** from the console
2. **Check what data** is being sent (look for the debug logs)
3. **Verify all fields** meet the requirements above
4. **Try the exact test data** provided above

The validation is working correctly - the issue is likely with the data being submitted not meeting the requirements.
