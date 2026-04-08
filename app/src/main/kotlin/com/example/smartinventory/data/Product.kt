package com.example.smartinventory.data

import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.UUID

enum class Category(val icon: String) {
    ALL("📦"),
    PRODUCE("🍎"),
    DAIRY("🥛"),
    MEAT("🥩"),
    BAKERY("🥖"),
    PANTRY("🥫"),
    FROZEN("❄️")
}

enum class StorageType(val icon: String) {
    FRIDGE("🧊"),
    FREEZER("❄️"),
    PANTRY("🥫")
}

enum class ExpiryStatus {
    CRITICAL, // Today or Expired (Soft Red/Coral)
    WARNING,  // 2-3 days left (Muted Orange)
    SAFE      // 4+ days left (Vibrant Green)
}

data class Product(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val category: Category,
    val storageType: StorageType = StorageType.PANTRY,
    val quantity: String,
    val addedDate: LocalDate = LocalDate.now(),
    val expiryDate: LocalDate,
    val reminderDays: Int = 1,
    val imageUrl: String? = null,
    val barcode: String? = null
) {
    val status: ExpiryStatus
        get() {
            val today = LocalDate.now()
            val daysUntilExpiry = ChronoUnit.DAYS.between(today, expiryDate)
            return when {
                daysUntilExpiry <= 0 -> ExpiryStatus.CRITICAL
                daysUntilExpiry <= 3 -> ExpiryStatus.WARNING
                else -> ExpiryStatus.SAFE
            }
        }

    val expiryProgress: Float
        get() {
            val totalDuration = ChronoUnit.DAYS.between(addedDate, expiryDate).toFloat()
            if (totalDuration <= 0) return 0f
            val daysPassed = ChronoUnit.DAYS.between(addedDate, LocalDate.now()).toFloat()
            return (1f - (daysPassed / totalDuration)).coerceIn(0f, 1f)
        }
}
