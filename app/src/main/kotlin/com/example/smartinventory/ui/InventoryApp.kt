package com.example.smartinventory.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.smartinventory.data.Category
import com.example.smartinventory.data.Product
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventoryApp() {
    val navController = rememberNavController()
    var products by remember { mutableStateOf(mutableListOf<Product>()) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    selected = true,
                    onClick = { navController.navigate("home") }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Inventory, contentDescription = "Inventory") },
                    label = { Text("Inventory") },
                    selected = false,
                    onClick = { navController.navigate("inventory") }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Add, contentDescription = "Add") },
                    label = { Text("Add") },
                    selected = false,
                    onClick = { navController.navigate("add") }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { HomeScreen(products) }
            composable("inventory") { InventoryScreen(products) }
            composable("add") { AddItemScreen { newProduct -> 
                products.add(newProduct)
                navController.navigate("inventory")
            } }
        }
    }
}

@Composable
fun HomeScreen(products: List<Product>) {
    val expiringToday = products.filter { it.expiryDate == LocalDate.now() }
    
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Expiring Today", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        if (expiringToday.isEmpty()) {
            Text("All good! Nothing expiring today.")
        } else {
            LazyColumn {
                items(expiringToday) { product ->
                    ProductCard(product)
                }
            }
        }
    }
}

@Composable
fun InventoryScreen(products: List<Product>) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("My Inventory", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        LazyColumn {
            items(products) { product ->
                ProductCard(product)
            }
        }
    }
}

@Composable
fun ProductCard(product: Product) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(product.category.icon, style = MaterialTheme.typography.headlineSmall)
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(product.name, style = MaterialTheme.typography.titleMedium)
                Text("${product.quantity} • ${product.expiryDate}", style = MaterialTheme.typography.bodySmall)
                if (product.barcode != null) {
                    Text("Barcode: ${product.barcode}", style = MaterialTheme.typography.labelSmall)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddItemScreen(onAdd: (Product) -> Unit) {
    var name by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(Category.PRODUCE) }
    var quantity by remember { mutableStateOf("") }
    var barcode by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Add New Item", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Product Name") },
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        OutlinedTextField(
            value = quantity,
            onValueChange = { quantity = it },
            label = { Text("Quantity") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = barcode,
            onValueChange = { barcode = it },
            label = { Text("Barcode") },
            modifier = Modifier.fillMaxWidth(),
            trailingIcon = {
                IconButton(onClick = { /* Open Barcode Scanner */ }) {
                    Icon(Icons.Default.QrCodeScanner, contentDescription = "Scan")
                }
            }
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = {
                onAdd(Product(
                    name = name,
                    category = category,
                    quantity = quantity,
                    expiryDate = LocalDate.now().plusDays(7),
                    barcode = if (barcode.isNotEmpty()) barcode else null
                ))
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Add to Inventory")
        }
    }
}
