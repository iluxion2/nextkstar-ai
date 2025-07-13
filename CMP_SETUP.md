# 2-Choice Consent Management Platform (CMP) Setup

This guide explains how to set up and use the 2-choice CMP for Google AdSense compliance.

## What is the 2-Choice CMP?

The 2-choice CMP provides users with two options:
1. **Accept all** - Users consent to all cookies and tracking
2. **Manage options** - Users can customize their cookie preferences

## Implementation Details

### Components Created:

1. **ConsentBanner.tsx** - Main consent banner component
2. **ConsentWrapper.tsx** - Wrapper that manages consent state
3. **GoogleTagManager.tsx** - Handles Google Tag Manager and AdSense loading
4. **Privacy Policy** - Required privacy page at `/privacy`

### Features:

- ✅ GDPR compliant consent management
- ✅ Google AdSense integration
- ✅ Google Tag Manager support
- ✅ Persistent consent storage
- ✅ Granular cookie preferences
- ✅ Animated UI with Framer Motion
- ✅ Mobile-responsive design

## Setup Instructions

### 1. Google AdSense Configuration

1. Go to your Google AdSense account
2. Navigate to **Privacy & messaging**
3. Select **"Use Google's CMP"**
4. Choose **2-choice option** (Consent + Manage options)
5. Save your settings

### 2. Google Tag Manager Setup

1. Create a Google Tag Manager account if you don't have one
2. Get your GTM container ID (format: GTM-XXXXXXX)
3. Update the `gtmId` in `ConsentWrapper.tsx`:

```typescript
const [gtmId] = useState('GTM-XXXXXXX') // Replace with your actual GTM ID
```

### 3. Privacy Policy

The privacy policy is automatically available at `/privacy`. Make sure to:
- Update the contact email if needed
- Review and customize the content for your specific use case
- Ensure it complies with your local privacy laws

## How It Works

### Consent Flow:

1. **First Visit**: User sees the consent banner
2. **Accept All**: User consents to all cookies, AdSense loads immediately
3. **Manage Options**: User can customize preferences for each cookie type
4. **Persistent**: User's choice is remembered for future visits

### Cookie Types:

- **Necessary**: Always enabled (required for site functionality)
- **Analytics**: Google Analytics tracking
- **Marketing**: Google AdSense and advertising
- **Personalization**: User preferences and settings

### Technical Implementation:

- Uses `localStorage` to persist consent choices
- Integrates with Google Tag Manager for consent management
- Only loads AdSense after consent is granted
- Updates GTM consent state based on user preferences

## Testing

### To test the CMP:

1. Clear your browser's localStorage:
   ```javascript
   localStorage.clear()
   ```

2. Refresh the page - you should see the consent banner

3. Test both "Accept all" and "Manage options" flows

4. Verify that AdSense only loads after consent is granted

### Browser Developer Tools:

Check the Network tab to confirm:
- AdSense script only loads after consent
- GTM consent events are fired correctly

## Compliance Notes

### GDPR Requirements Met:

- ✅ Explicit consent before tracking
- ✅ Granular consent options
- ✅ Easy withdrawal of consent
- ✅ Clear privacy information
- ✅ No pre-ticked boxes
- ✅ Persistent consent storage

### Google AdSense Requirements:

- ✅ CMP integration
- ✅ Consent before ad serving
- ✅ Proper consent state management
- ✅ Privacy policy available

## Customization

### Styling:

The CMP uses Tailwind CSS classes. You can customize:
- Colors in the component files
- Animations in the Framer Motion components
- Layout and spacing

### Text Content:

Update the text in `ConsentBanner.tsx` to match your brand voice and legal requirements.

### Cookie Categories:

Add or modify cookie categories in the preferences state and UI.

## Troubleshooting

### Common Issues:

1. **AdSense not loading**: Check that consent is properly granted
2. **GTM not working**: Verify your GTM ID is correct
3. **Banner not showing**: Clear localStorage and refresh
4. **Consent not persisting**: Check browser localStorage support

### Debug Mode:

Add console logs to track consent state:

```typescript
console.log('Consent granted:', consentGranted)
console.log('Preferences:', localStorage.getItem('consent-preferences'))
```

## Future Enhancements

Possible improvements:
- Geolocation-based consent requirements
- A/B testing for consent banner variants
- Analytics on consent rates
- Integration with other ad networks
- Advanced preference management

## Support

For questions or issues:
- Check the browser console for errors
- Verify all dependencies are installed
- Ensure proper GTM and AdSense setup
- Contact: privacy@nextkstar.com 