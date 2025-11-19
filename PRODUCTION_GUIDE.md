# KachaBazar Mobile - Production Deployment Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Building for Production](#building-for-production)
5. [Deployment](#deployment)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide will walk you through deploying the KachaBazar mobile app to production for both iOS and Android platforms.

## ✅ Prerequisites

### Required Tools
- Node.js >= 18.x
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Xcode (for iOS) >= 14.0
- Android Studio (for Android)

### Required Accounts
- Expo Account (free tier is sufficient)
- Apple Developer Account ($99/year) for iOS
- Google Play Console Account ($25 one-time) for Android

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your production values:

```env
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_BASE_URL=https://api.kachabazar.com/v1
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key
# ... other production keys
```

### 3. Update App Configuration

Edit `app.config.js`:
- Update app name, version, and build numbers
- Configure bundle identifiers
- Set up deep linking schemes

### 4. Configure EAS Build

Edit `eas.json`:
- Update project ID
- Configure build profiles
- Set up submission credentials

## 🏗️ Building for Production

### Login to EAS

```bash
eas login
```

### Configure Project

```bash
eas build:configure
```

### iOS Build

#### 1. Generate iOS Credentials

```bash
eas credentials
```

Select:
- iOS App Store distribution certificate
- iOS App Store provisioning profile

#### 2. Build for iOS

```bash
# Build for App Store
eas build --platform ios --profile production

# Build for TestFlight (internal testing)
eas build --platform ios --profile preview
```

### Android Build

#### 1. Generate Android Keystore

```bash
eas credentials
```

Select:
- Android keystore
- Generate new keystore (or upload existing)

#### 2. Build for Android

```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview
```

### Build Both Platforms

```bash
eas build --platform all --profile production
```

## 🚀 Deployment

### iOS Deployment (App Store)

#### 1. Submit to App Store

```bash
eas submit --platform ios
```

Or manually:
1. Download IPA from EAS build
2. Open Xcode > Window > Organizer
3. Upload to App Store Connect
4. Configure app metadata in App Store Connect
5. Submit for review

#### 2. App Store Metadata

Required information:
- App name and description
- Screenshots (all device sizes)
- App icon
- Privacy policy URL
- Support URL
- Keywords
- Age rating

### Android Deployment (Play Store)

#### 1. Submit to Play Store

```bash
eas submit --platform android
```

Or manually:
1. Download AAB from EAS build
2. Go to Google Play Console
3. Create new release
4. Upload AAB
5. Fill in release notes
6. Submit for review

#### 2. Play Store Metadata

Required information:
- App name and description
- Screenshots (phone, tablet, etc.)
- Feature graphic
- App icon
- Privacy policy URL
- Content rating questionnaire

## 📱 Over-the-Air (OTA) Updates

### Configure OTA Updates

```javascript
// app.config.js
updates: {
  url: "https://u.expo.dev/your-project-id",
  fallbackToCacheTimeout: 0
}
```

### Publish Updates

```bash
# Publish update to production
eas update --branch production --message "Bug fixes and improvements"

# Publish to staging
eas update --branch staging --message "Testing new features"
```

### Update Strategy

- Minor bug fixes: OTA update
- New features: OTA update
- Native code changes: New build required
- Breaking changes: New build required

## 🔍 Post-Deployment

### 1. Monitor Crash Reports

Set up error tracking:
```bash
# Install Sentry
npm install @sentry/react-native

# Configure in app
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV,
});
```

### 2. Analytics

Track key metrics:
- User engagement
- Conversion rates
- Cart abandonment
- Popular products
- Search queries

### 3. Performance Monitoring

Monitor:
- App startup time
- API response times
- Screen load times
- Memory usage
- Crash-free rate

### 4. User Feedback

- Monitor app store reviews
- Set up in-app feedback
- Track support tickets
- Conduct user surveys

## 🐛 Troubleshooting

### Common Build Issues

#### iOS Build Fails

```bash
# Clear build cache
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reinstall pods
cd ios && pod install && cd ..

# Retry build
eas build --platform ios --clear-cache
```

#### Android Build Fails

```bash
# Clear gradle cache
cd android && ./gradlew clean && cd ..

# Retry build
eas build --platform android --clear-cache
```

### Common Runtime Issues

#### API Connection Issues

Check:
- API base URL is correct
- CORS is configured
- SSL certificates are valid
- API keys are correct

#### Payment Gateway Issues

Verify:
- Live API keys (not test keys)
- Webhook URLs are configured
- Return URLs are correct

#### Push Notifications Not Working

Check:
- FCM/APNS credentials
- Device permissions
- Server endpoint configuration

## 📝 Checklist Before Launch

### Testing
- [ ] Test on real iOS devices
- [ ] Test on real Android devices
- [ ] Test all payment methods
- [ ] Test offline functionality
- [ ] Test deep links
- [ ] Test push notifications
- [ ] Load testing
- [ ] Security audit

### App Store
- [ ] Complete app metadata
- [ ] Upload screenshots
- [ ] Set pricing
- [ ] Configure territories
- [ ] Privacy policy
- [ ] Terms of service

### Backend
- [ ] Production API is live
- [ ] Database is backed up
- [ ] CDN is configured
- [ ] SSL certificates
- [ ] Rate limiting
- [ ] Monitoring setup

### Legal
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie policy
- [ ] GDPR compliance
- [ ] COPPA compliance (if applicable)

## 🔐 Security Checklist

- [ ] API keys are in environment variables
- [ ] Sensitive data is encrypted
- [ ] SSL pinning implemented
- [ ] Input validation on all forms
- [ ] Rate limiting enabled
- [ ] Authentication tokens expire
- [ ] Secure storage for sensitive data
- [ ] Code obfuscation enabled

## 📊 Performance Optimization

### Before Launch
- [ ] Enable Hermes (Android)
- [ ] Optimize images
- [ ] Lazy load components
- [ ] Implement code splitting
- [ ] Enable ProGuard (Android)
- [ ] Strip unused code
- [ ] Minify JavaScript

### Monitoring
- [ ] Set up performance monitoring
- [ ] Track bundle size
- [ ] Monitor API latency
- [ ] Track crash-free rate
- [ ] Monitor memory usage

## 🆘 Support

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

### Getting Help
- Expo Discord: https://chat.expo.dev/
- Stack Overflow: Tag `expo` or `react-native`
- GitHub Issues: For bugs and feature requests

## 📅 Maintenance Schedule

### Weekly
- Monitor crash reports
- Review user feedback
- Check analytics

### Monthly
- Security updates
- Dependency updates
- Performance review

### Quarterly
- Feature updates
- UX improvements
- Major version bumps

---

## 🎉 Congratulations!

Your app is now production-ready. Remember to:
- Monitor metrics closely after launch
- Respond to user feedback promptly
- Keep dependencies updated
- Plan regular feature updates

Good luck with your launch! 🚀

