package com.example.smartinventory.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

// Visual Hierarchy & Color Theory
val VibrantGreen = Color(0xFF2E7D32)
val SoftRedCoral = Color(0xFFE57373)
val MutedOrange = Color(0xFFFFA726)
val NeutralBackground = Color(0xFFF8F9FA)
val NeutralCard = Color(0xFFFFFFFF)
val NeutralSecondary = Color(0xFFE9ECEF)

private val LightColorScheme = lightColorScheme(
    primary = VibrantGreen,
    secondary = MutedOrange,
    error = SoftRedCoral,
    background = NeutralBackground,
    surface = NeutralCard,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Color(0xFF212529),
    onSurface = Color(0xFF212529),
    surfaceVariant = NeutralSecondary
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF81C784),
    secondary = Color(0xFFFFB74D),
    error = Color(0xFFE57373),
    onPrimary = Color.Black,
    onSecondary = Color.Black
)

@Composable
fun SmartInventoryTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        shapes = MaterialTheme.shapes.copy(
            small = RoundedCornerShape(12.dp),
            medium = RoundedCornerShape(16.dp),
            large = RoundedCornerShape(20.dp)
        ),
        content = content
    )
}
