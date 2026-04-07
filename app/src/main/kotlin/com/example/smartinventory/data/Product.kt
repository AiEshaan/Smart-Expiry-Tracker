package com.example.smartinventory.data

import java.time.LocalDate
import java.util.UUID

enum class Category(val icon: String) {
    PRODUCE("🍎"),
    DAIRY("🥛"),
    MEAT("🥩"),
    BAKERY("🥖"),
    PANTRY("🥫"),
    FROZEN("❄️")
}

enum class ExpiryStatus {
    CRITICAL,
    WARNING,
    SAFE
}

data class Product(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val category: Category,
    val quantity: String,
    val expiryDate: LocalDate,
    val reminderDays: Int = 1,
    val imageUrl: String? = null,
    val barcode: String? = null
) {
    val status: ExpiryStatus
        get() {
            val today = LocalDate.now()
            val diff = java.time.temporal.ChronoUnit.DAYS.between(today, expiryDate)
            return when {
                diff <= 0 -> ExpiryStatus.CRITICAL
                diff <= 3 -> ExpiryStatus.WARNING
                else -> ExpiryStatus.SAFE
            }
        }
}
