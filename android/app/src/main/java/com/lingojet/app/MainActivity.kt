package com.lingojet.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.lingojet.app.ui.theme.LingoJetTheme
import com.lingojet.app.viewmodel.MainViewModel
import com.lingojet.app.screens.*

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LingoJetTheme(darkTheme = viewModel.isDarkMode.collectAsState().value) {
                MainAppScreen(viewModel)
            }
        }
    }
}

@Composable
fun MainAppScreen(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val currentLanguage by viewModel.currentLanguage.collectAsState()
    val streak by viewModel.streak.collectAsState()

    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController = navController)
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "learn",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("learn") { 
                LearnScreen(viewModel = viewModel, navController = navController) 
            }
            composable("ai_chat") { 
                AIChatScreen(viewModel = viewModel) 
            }
            composable("achievements") { 
                AchievementsScreen(viewModel = viewModel) 
            }
            composable("profile") { 
                ProfileScreen(viewModel = viewModel) 
            }
        }
    }
}
