package com.example.smartinventory.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.smartinventory.data.Category
import com.example.smartinventory.data.ExpiryStatus
import com.example.smartinventory.data.Product
import com.example.smartinventory.data.StorageType
import com.example.smartinventory.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventoryApp() {
    val navController = rememberNavController()
    val today = LocalDate.now()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    
    // Global state for products to allow interaction across screens
    var products by remember { 
        mutableStateOf(listOf(
            Product(name = "Fresh Milk", category = Category.DAIRY, storageType = StorageType.FRIDGE, quantity = "1 Liter", expiryDate = today, addedDate = today.minusDays(5)),
            Product(name = "Baby Spinach", category = Category.PRODUCE, storageType = StorageType.FRIDGE, quantity = "200g", expiryDate = today.plusDays(2), addedDate = today.minusDays(2)),
            Product(name = "Greek Yogurt", category = Category.DAIRY, storageType = StorageType.FRIDGE, quantity = "500g", expiryDate = today.plusDays(1), addedDate = today.minusDays(6)),
            Product(name = "Chicken Breast", category = Category.MEAT, storageType = StorageType.FREEZER, quantity = "500g", expiryDate = today.plusDays(10), addedDate = today.minusDays(1)),
            Product(name = "Whole Wheat Bread", category = Category.BAKERY, storageType = StorageType.PANTRY, quantity = "1 loaf", expiryDate = today.plusDays(5), addedDate = today.minusDays(1))
        ))
    }
    
    var filterByCategory by remember { mutableStateOf(Category.ALL) }
    
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Smart Inventory", fontWeight = FontWeight.ExtraBold, fontSize = 24.sp) },
                actions = {
                    IconButton(onClick = { 
                        scope.launch { snackbarHostState.showSnackbar("Profile Settings Coming Soon!") }
                    }) {
                        Box(
                            modifier = Modifier.size(36.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Person, contentDescription = "Profile", modifier = Modifier.size(24.dp))
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface, tonalElevation = 8.dp) {
                val items = listOf(
                    NavigationItem("home", "Home", Icons.Default.Home),
                    NavigationItem("pantry", "Pantry", Icons.Default.Inventory2),
                    NavigationItem("add", "Add", Icons.Default.AddCircle),
                    NavigationItem("settings", "Settings", Icons.Default.Settings)
                )
                items.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = currentRoute == item.route,
                        onClick = { 
                            if (item.route == "pantry") filterByCategory = Category.ALL
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.startDestinationId)
                                launchSingleTop = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(navController = navController, startDestination = "home", modifier = Modifier.padding(innerPadding)) {
            composable("home") { 
                HomeScreen(
                    products = products,
                    onSummaryClick = { filterByCategory = Category.ALL; navController.navigate("pantry") }
                ) 
            }
            composable("pantry") { 
                InventoryScreen(
                    products = products, 
                    initialCategory = filterByCategory,
                    onRemoveProduct = { productToRemove ->
                        products = products.filter { it.id != productToRemove.id }
                        scope.launch { snackbarHostState.showSnackbar("${productToRemove.name} removed") }
                    }
                ) 
            }
            composable("add") { 
                AddItemScreen { newProduct -> 
                    products = products + newProduct
                    navController.navigate("pantry")
                    scope.launch { snackbarHostState.showSnackbar("${newProduct.name} added to inventory") }
                } 
            }
            composable("settings") { SettingsScreen() }
        }
    }
}

data class NavigationItem(val route: String, val label: String, val icon: ImageVector)

@Composable
fun HomeScreen(products: List<Product>, onSummaryClick: () -> Unit) {
    val today = LocalDate.now()
    val expiringToday = products.filter { it.expiryDate == today }
    val expiringNext3Days = products.filter { 
        val diff = ChronoUnit.DAYS.between(today, it.expiryDate)
        diff > 0 && diff <= 3
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        item {
            Text("Pantry Health", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                SummaryCard(
                    count = expiringToday.size,
                    label = "Expiring Today",
                    color = SoftRedCoral,
                    modifier = Modifier.weight(1f).clickable { onSummaryClick() }
                )
                SummaryCard(
                    count = expiringNext3Days.size,
                    label = "Next 3 Days",
                    color = MutedOrange,
                    modifier = Modifier.weight(1f).clickable { onSummaryClick() }
                )
            }
        }

        item {
            Text("Urgent Actions", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }

        if (expiringToday.isEmpty() && expiringNext3Days.isEmpty()) {
            item { EmptyState(message = "All good! Nothing expiring soon.") }
        } else {
            items(expiringToday) { product -> ProductCard(product) }
            items(expiringNext3Days) { product -> ProductCard(product) }
        }
        item { Spacer(modifier = Modifier.height(16.dp)) }
    }
}

@Composable
fun SummaryCard(count: Int, label: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.08f)),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.2f))
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(text = count.toString(), fontSize = 42.sp, fontWeight = FontWeight.Black, color = color)
            Text(text = label, style = MaterialTheme.typography.labelLarge, color = color, fontWeight = FontWeight.Bold)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventoryScreen(products: List<Product>, initialCategory: Category, onRemoveProduct: (Product) -> Unit) {
    var selectedCategory by remember { mutableStateOf(initialCategory) }
    val filteredProducts = if (selectedCategory == Category.ALL) products else products.filter { it.category == selectedCategory }

    Column(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        Spacer(modifier = Modifier.height(16.dp))
        Text("My Inventory", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))
        
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp), contentPadding = PaddingValues(bottom = 16.dp)) {
            items(Category.values()) { category ->
                FilterChip(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    label = { 
                        val labelText = category.name.lowercase().replaceFirstChar { it.titlecase(Locale.getDefault()) }
                        Text("${category.icon} $labelText") 
                    },
                    shape = CircleShape
                )
            }
        }
        
        if (filteredProducts.isEmpty()) {
            EmptyState(message = "No items here yet.")
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp), contentPadding = PaddingValues(bottom = 24.dp)) {
                items(filteredProducts) { product ->
                    ProductDetailedCard(product, onUse = { onRemoveProduct(product) })
                }
            }
        }
    }
}

@Composable
fun ProductCard(product: Product) {
    val statusColor = when (product.status) {
        ExpiryStatus.CRITICAL -> SoftRedCoral
        ExpiryStatus.WARNING -> MutedOrange
        ExpiryStatus.SAFE -> VibrantGreen
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Surface(modifier = Modifier.size(48.dp), shape = RoundedCornerShape(12.dp), color = statusColor.copy(alpha = 0.1f)) {
                Box(contentAlignment = Alignment.Center) { Text(product.category.icon, fontSize = 24.sp) }
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(product.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    text = if (product.status == ExpiryStatus.CRITICAL) "Expires TODAY" else "Expires in ${ChronoUnit.DAYS.between(LocalDate.now(), product.expiryDate)} days",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (product.status == ExpiryStatus.CRITICAL) SoftRedCoral else Color.Gray
                )
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.LightGray)
        }
    }
}

@Composable
fun ProductDetailedCard(product: Product, onUse: () -> Unit) {
    val statusColor = when (product.status) {
        ExpiryStatus.CRITICAL -> SoftRedCoral
        ExpiryStatus.WARNING -> MutedOrange
        ExpiryStatus.SAFE -> VibrantGreen
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.LightGray.copy(alpha = 0.2f))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(product.category.icon, fontSize = 32.sp)
                Spacer(modifier = Modifier.width(16.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(product.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(shape = RoundedCornerShape(4.dp), color = NeutralSecondary, modifier = Modifier.padding(end = 8.dp)) {
                            Text(product.storageType.name.lowercase().replaceFirstChar { it.titlecase(Locale.getDefault()) }, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), style = MaterialTheme.typography.labelSmall)
                        }
                        Text(product.quantity, style = MaterialTheme.typography.bodyMedium, color = Color.Gray)
                    }
                }
                IconButton(onClick = onUse) { Icon(Icons.Default.DeleteOutline, contentDescription = "Remove", tint = SoftRedCoral) }
            }
            Spacer(modifier = Modifier.height(20.dp))
            val daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), product.expiryDate)
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(if (daysLeft <= 0) "Expired" else "${daysLeft} days remaining", style = MaterialTheme.typography.labelMedium, color = statusColor, fontWeight = FontWeight.Bold)
                Text("${(product.expiryProgress * 100).toInt()}% Fresh", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
            }
            Spacer(modifier = Modifier.height(8.dp))
            LinearProgressIndicator(
                progress = product.expiryProgress,
                modifier = Modifier.fillMaxWidth().height(10.dp).clip(CircleShape),
                color = statusColor,
                trackColor = statusColor.copy(alpha = 0.15f)
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddItemScreen(onAdd: (Product) -> Unit) {
    var name by remember { mutableStateOf("") }
    var quantity by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(Category.PRODUCE) }
    var storageType by remember { mutableStateOf(StorageType.FRIDGE) }
    var isScanning by remember { mutableStateOf(false) }

    LazyColumn(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(20.dp), contentPadding = PaddingValues(vertical = 24.dp)) {
        item { Text("Add New Item", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.ExtraBold) }
        
        item {
            Surface(
                modifier = Modifier.fillMaxWidth().height(220.dp).clickable { 
                    if (!isScanning) {
                        isScanning = true
                    }
                },
                shape = RoundedCornerShape(28.dp),
                color = if (isScanning) VibrantGreen.copy(alpha = 0.1f) else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
                border = androidx.compose.foundation.BorderStroke(2.dp, if (isScanning) VibrantGreen else MaterialTheme.colorScheme.primary.copy(alpha = 0.1f))
            ) {
                Box(contentAlignment = Alignment.Center) {
                    if (isScanning) {
                        LaunchedEffect(Unit) {
                            delay(2000)
                            name = "Organic Avocados"
                            quantity = "3 units"
                            category = Category.PRODUCE
                            isScanning = false
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator(color = VibrantGreen)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("AI Detecting Freshness...", fontWeight = FontWeight.Bold, color = VibrantGreen)
                        }
                    } else {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.PhotoCamera, contentDescription = null, modifier = Modifier.size(64.dp), tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("Take Photo", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                            Text("Auto-detect item & expiry date", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f))
                        }
                    }
                }
            }
        }

        item {
            OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Product Name") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), leadingIcon = { Icon(Icons.Default.ShoppingBasket, contentDescription = null) })
        }

        item {
            OutlinedTextField(value = quantity, onValueChange = { quantity = it }, label = { Text("Quantity") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), leadingIcon = { Icon(Icons.Default.Scale, contentDescription = null) })
        }
        
        item {
            Text("Category", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(Category.values().filter { it != Category.ALL }) { cat ->
                    FilterChip(
                        selected = category == cat,
                        onClick = { category = cat },
                        label = { Text("${cat.icon} ${cat.name.lowercase().replaceFirstChar { it.titlecase(Locale.getDefault()) }}") },
                        shape = CircleShape
                    )
                }
            }
        }

        item {
            Text("Storage", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StorageType.values().forEach { type ->
                    FilterChip(
                        selected = storageType == type,
                        onClick = { storageType = type },
                        label = { Text("${type.icon} ${type.name.lowercase().replaceFirstChar { it.titlecase(Locale.getDefault()) }}") },
                        shape = CircleShape
                    )
                }
            }
        }

        item {
            Button(
                onClick = {
                    if (name.isNotEmpty()) {
                        onAdd(Product(name = name, category = category, storageType = storageType, quantity = quantity, expiryDate = LocalDate.now().plusDays(5)))
                    }
                },
                modifier = Modifier.fillMaxWidth().height(64.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = VibrantGreen)
            ) {
                Text("Add to Inventory", fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
            }
        }

        item {
            Card(colors = CardDefaults.cardColors(containerColor = MutedOrange.copy(alpha = 0.1f)), shape = RoundedCornerShape(20.dp)) {
                Row(modifier = Modifier.padding(20.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Lightbulb, contentDescription = null, tint = MutedOrange, modifier = Modifier.size(28.dp))
                    Spacer(modifier = Modifier.width(16.dp))
                    Text("Pro Tip: Snap a photo of the expiry text for the fastest results!", fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
fun SettingsScreen() {
    var notificationsEnabled by remember { mutableStateOf(true) }
    
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Settings", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(24.dp))
        ListItem(
            headlineContent = { Text("Notifications") }, 
            supportingContent = { Text(if (notificationsEnabled) "Expiry alerts enabled" else "Expiry alerts disabled") }, 
            leadingContent = { Icon(Icons.Default.Notifications, contentDescription = null) }, 
            trailingContent = { 
                Switch(
                    checked = notificationsEnabled, 
                    onCheckedChange = { notificationsEnabled = it }
                ) 
            }
        )
        Divider(modifier = Modifier.padding(vertical = 4.dp), thickness = 0.5.dp, color = Color.LightGray.copy(alpha = 0.3f))
        ListItem(
            headlineContent = { Text("Cloud Sync") }, 
            supportingContent = { Text("Last synced: Today 2:15 PM") }, 
            leadingContent = { Icon(Icons.Default.CloudDone, contentDescription = null) }, 
            trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
            modifier = Modifier.clickable { /* Action */ }
        )
    }
}

@Composable
fun EmptyState(message: String) {
    Box(modifier = Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Inventory, contentDescription = null, modifier = Modifier.size(64.dp), tint = Color.LightGray)
            Spacer(modifier = Modifier.height(16.dp))
            Text(message, color = Color.Gray, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        }
    }
}
