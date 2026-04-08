# Smart Inventory Tracker

A modern Android application for tracking product expiration dates, built with Jetpack Compose.

## Features

- **Inventory Management**: Keep track of all your products in one place.
- **Expiration Tracking**: Automatic calculation of product status (Safe, Warning, Critical) based on expiry date.
- **Home Dashboard**: Quick view of items expiring today.
- **Barcode Scanning**: (Experimental) Scan products to quickly add them to your inventory.
- **Modern UI**: Built using Material Design 3 and Jetpack Compose.

## Tech Stack

- **UI**: [Jetpack Compose](https://developer.android.com/jetpack/compose)
- **Navigation**: [Navigation Compose](https://developer.android.com/jetpack/compose/navigation)
- **Language**: [Kotlin](https://kotlinlang.org/)
- **Theme**: [Material Design 3](https://m3.material.io/)
- **Architecture**: MVVM (Planned)
- **Dependencies**: 
  - Coil (Image loading)
  - ML Kit (Barcode scanning)
  - CameraX (Camera support)

## Getting Started

1.  Open the project in **Android Studio Hedgehog** or later.
2.  Wait for Gradle to sync.
3.  Connect an Android device or start an emulator.
4.  Run the `:app` module.

## Project Structure

- `app/src/main/kotlin`: Application source code.
  - `com.example.smartinventory.data`: Data models and enums.
  - `com.example.smartinventory.ui`: UI components and navigation.
  - `com.example.smartinventory.ui.theme`: App theme and styling.
- `app/src/main/res`: App resources (Strings, Themes).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
